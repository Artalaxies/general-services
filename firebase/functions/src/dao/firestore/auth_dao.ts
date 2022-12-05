import {admin} from "./config";
import {DataSnapshot} from "../../utilities/type/data_snapshot";
import {isValidateAddress} from "../../utilities/address";
import {InvalidWalletAddressErrorDataSnapshot}
  from "../../utilities/type/address";
import * as TE from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import * as T from "fp-ts/Task";
import * as B from "fp-ts/Boolean";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as RT from "fp-ts/lib/ReaderTask";
import {ReaderTask} from "fp-ts/lib/ReaderTask";
import * as L from "logger-fp-ts";
import {LoggerEnv} from "logger-fp-ts";
import * as R from "fp-ts/Reader";
import {loggingRT} from "../../utilities/logger";

/**
 * @todo refactor logging.
 * getCustomToken.
 * @param {string} address input a web3 wallet address.
 * @return {ReaderTask<LoggerEnv, DataSnapshot<string>>}
 * return a custom token.
 */
export const getCustomToken = (address: string):
 ReaderTask<LoggerEnv, DataSnapshot<string>> => pipe(
    RT.ask<LoggerEnv>(),
    loggingRT(()=>L.debug("function getCustomToken accessed.")),
    RT.map((_) => isValidateAddress(address)),
    RT.chain(B.match(
        () => RT.of(new InvalidWalletAddressErrorDataSnapshot<string>()),
        () => pipe(
            TE.tryCatch(
                () => admin.auth().createCustomToken(address).then((token) =>{
                  return new DataSnapshot(2000, token);
                },
                (error) =>{
                  console.log("Genreate token failed");
                  return new DataSnapshot<string>(2001, undefined, error);
                }),
                (message) => <Error>message
            ),
            TE.getOrElse((err)=>
              T.of(new DataSnapshot<string>(2001, undefined, err.message))),
            RT.fromTask
        )
    )));

// isValidateAddress(address),
// B.match(
//     () => T.of(new InvalidWalletAddressErrorDataSnapshot<string>()),
//     () => pipe(
//         TE.tryCatch(
//             () => admin.auth().createCustomToken(address).then((token) =>{
//               return new DataSnapshot(2000, token);
//             },
//             (error) =>{
//               console.log("Genreate token failed");
//               return new DataSnapshot<string>(2001, undefined, error);
//             }),
//             (msg) => new Error(<string>msg)
//         ),
//         TE.getOrElse((err)=>
//           T.of(new DataSnapshot<string>(2001, undefined, err.message))),
//     )
// ));


/**
 * verifySessionCookie.
 * @param {string} sessionCookie input a id token.
 * @return {Promise<DataSnapshot<boolean>>} return a custom token.
 */
export const verifySessionCookie = (sessionCookie:string):
ReaderTask<LoggerEnv, DataSnapshot<boolean>> => pipe(
    RT.ask<L.LoggerEnv>(),
    RT.chainFirst((_) =>
      RT.fromReader(L.debug("function verifySessionCookie accessed."))),
    R.map((_) =>
      TE.tryCatch(
          () => admin.auth().verifySessionCookie(sessionCookie, true)
              .then((decodedClaims) =>
                new DataSnapshot(4000, true)
              ),
          (message) => <Error>message
      )),
    RTE.getOrElse((err)=>
      RT.of(new DataSnapshot( 4001, false, err.message))
    )
);
