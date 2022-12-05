import {onRequest} from "../../utilities/https";
import {getLatestNonce, setLatestNonce}
  from "../../dao/firestore/web3_dao";
import {getCustomToken} from "../../dao/firestore/auth_dao";
import * as nonce from "../../utilities/nonce";
import {isValidateAddress} from "../../utilities/address";
import {pipe} from "fp-ts/function";
import * as B from "fp-ts/Boolean";
// import * as RIO from "fp-ts/ReaderIO";
import * as R from "fp-ts/Reader";
import * as O from "fp-ts/Option";
import * as RT from "fp-ts/lib/ReaderTask";
import * as L from "logger-fp-ts";
import {developmentEnv, loggingRT} from "../../utilities/logger";
// import {runReaderTask} from "../../utilities/type/task";
import {LoggerEnv} from "logger-fp-ts";


export const getNonce = onRequest((request, response) => pipe(
    RT.ask<LoggerEnv>(),
    loggingRT(
        () => L.debug("Accessing endpoint \"getNonce\"")),
    loggingRT(
        () => L.debugP("Request method")({
          "request.method": request.method})),
    RT.map((_) => request.method === "GET"),
    RT.chain(B.match(
        () => RT.of(response.status(403).send("Not accepted request type")),
        () => pipe(
            RT.ask<L.LoggerEnv>(),
            RT.map((_) => !(!request.query.address ||
      !isValidateAddress(<string>request.query.address))),
            RT.chain(B.match(
                () => RT.of(response.sendStatus(400).send("Invalid address")),
                () => pipe(
                    RT.ask<LoggerEnv>(),
                    RT.map( () =>
                      (<string>request.query.address).toLowerCase()),
                    loggingRT(
                        (address) => L.infoP("Recived address")({
                          address: address})),
                    RT.chain((address) => getLatestNonce(address)),
                    RT.chain((nonceData) => {
                      if (nonceData.stateId == 2010) {
                        return pipe(
                            RT.ask<LoggerEnv>(),
                            RT.chain((_) => RT.of(nonceData.getOption())),
                            loggingRT(
                                (nonceOp) => L.infoP("Got Nonce")({
                                  nonce: O.getOrElse(()=>"0")(nonceOp)})),
                            RT.map(O.match(
                                () => response.status(400),
                                (data) =>
                                  response.status(200).json({nonce: data}))),
                        );
                      } else if (nonceData.stateId == 2004) {
                        return pipe(
                            RT.ask<LoggerEnv>(),
                            RT.bind( "nonce",
                                () => RT.of(nonce.generatedNonce().toString())),
                            RT.bind("setResponse", ({nonce}) =>
                              setLatestNonce((<string>request.query.address),
                                  nonce)),
                            RT.map(({setResponse, nonce})=>{
                              if (setResponse.isSuccess()) {
                                return response.status(200)
                                    .json({nonce: nonce});
                              } else {
                                return response.status(400)
                                    .json({error: setResponse.message});
                              }
                            })
                        );
                      } else {
                        return RT.of(response.sendStatus(400)
                            .json({status: nonceData.stateId,
                              message: nonceData.message}));
                      }
                    }),
                )
            ),
            ),
        )
    )),

)(developmentEnv)()
);


exports.verifySignedMessage = onRequest(async (request, response) => await pipe(
    RT.ask<LoggerEnv>(),
    loggingRT(
        () => L.debug("Accessing endpoint \"verifySignedMessage\"")),
    loggingRT(()=>L.debugP("Request method")({
      "request.method": request.method})),
    RT.map((_) => request.method === "POST"),
    RT.chain(B.match(
        () => RT.of(response.status(403).send("Not accepted request type")),
        () => pipe(
            RT.ask<LoggerEnv>(),
            RT.map((_) => O.fromNullable<string>(request.body.address)),
            RT.map((aOp) =>
              O.map<string, O.Option<[string, string]>>((a) =>
                O.map<string, [add: string, sig: string]>((s) =>
                  [a, s])(O.fromNullable<string>(
                      request
                          .body
                          .signature)))(aOp)),
            RT.map(O.flatten),
            RT.chain(O.match(
                () => RT.of(response.sendStatus(400)),
                ([address, signature]) => pipe(
                    RT.ask<LoggerEnv>(),
                    R.chain((_) => getLatestNonce(address)),
                    loggingRT(
                        (nonceData) => L.infoP("Get Lastest Nonce")({
                          stateId: nonceData.stateId})),
                    RT.map((nonce) => nonce.getOption()),
                    loggingRT(
                        (nonceOp) => L.infoP("Got Nonce")({
                          nonce: O.getOrElse(()=>"0")(nonceOp)})),
                    RT.chain(O.match(
                        () => RT.of(response.status(400)),
                        (nonceData) => pipe(
                            RT.ask<LoggerEnv>(),
                            RT.map((_) =>
                              nonce.isValidatedMessage(address,
                                  nonceData,
                                  signature)),
                            RT.chain(B.match(
                                () => RT.of(response.status(400)),
                                () => pipe(
                                    RT.ask<LoggerEnv>(),
                                    RT.chain((_) =>
                                      setLatestNonce(address,
                                          nonce
                                              .generatedNonce()
                                              .toString())),
                                    RT.map((data) => data.getOption()),
                                    RT.chain(O.match(
                                        () => RT.of(response.status(400)),
                                        (_) => pipe(
                                            RT.ask<LoggerEnv>(),
                                            RT.chain((_) =>
                                              getCustomToken(address)),
                                            RT.map((data) =>
                                              data.getOption()),
                                            RT.chain(O.match(
                                                () =>
                                                  RT.of(response.status(400)),
                                                (token) =>
                                                  RT.of(response.status(200)
                                                      .json({token: token}))
                                            ))
                                        )
                                    ))
                                )

                            ))
                        )

                    ))
                )
            )),
        )
    ))
)(developmentEnv)());

// exports.verifySignedMessage = onRequest(async (request, response) => {
//   console.log(request.body.address, request.body.sigature);
//   try {
//     if (request.method !== "POST") {
//       return response.status(403).send("Not accepted request type");
//     }
//     if (!request.body.address || !request.body.signature) {
//       return response.sendStatus(400);
//     }
//     const address = request.body.address.toLowerCase();
//     const sig = request.body.signature;
//     // Get the nonce for this address
//     const userDoc = await getLatestNonce(address);
//     // const userDoc = await userDocRef.get();
//     if (userDoc.isSuccess()) {
//       const existingNonce :string = userDoc.data?.() || "";
//       console.log("existingNonce is: ", existingNonce);
//       // Recover the address of the account used to
//       // create the given Ethereum signature.

//       // See if that matches the address the user is
//       // claiming the signature is from
//       if (nonce.isValidatedMessage(address, existingNonce, sig)) {
//       // The signature was verified
//       // - update the nonce to prevent replay attacks
//       // update nonce
//         await setLatestNonce(address,
//             nonce.generatedNonce().toString());
//         // Create a custom token for the specified address

//         const tokenDataSnapshot = await getCustomToken(address);
//         // TO-DO: set time limit
//         console.log("yooo2");

//         const firebaseToken = (tokenDataSnapshot.data || (() => ""))();
//         // Return the token
//         console.log("yooo3");

//         return response.status(200).json({token: firebaseToken});
//       } else {
//       // The signature could not be verified
//         return response.sendStatus(401);
//       }
//     } else {
//       console.log("user doc does not exist");
//       return response.sendStatus(500);
//     }
//   } catch (err) {
//     console.log(err);
//     return response.sendStatus(500);
//   }
// });
