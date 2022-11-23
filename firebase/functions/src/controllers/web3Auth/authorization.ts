import {onRequest} from "../../utilities/https";
import * as functions from "firebase-functions";

import {getLatestNonce, setLatestNonce}
  from "../../models/dao/firestore/web3_dao";
import {getCustomToken} from "../../models/dao/firestore/auth_dao";
import * as nonce from "../../utilities/nonce";
import {validateAddress} from "../../utilities/address";


exports.getNonce = onRequest(async (request, response) => {
  try {
    if (request.method !== "GET") {
      return response.status(403).send("Not accepted request type");
    }
    if (!request.query.address ||
      !validateAddress(<string>request.query.address)) {
      return response.sendStatus(400);
    }
    const address = (<string>request.query.address).toLowerCase();
    const userDoc = await getLatestNonce(address);

    functions.logger.info("address: ",
        address, "userDoc",
        userDoc.data, {structuredData: true});

    if (userDoc.isSuccess()) {
      return response.status(200).json({nonce: userDoc.data?.()});
    } else if (userDoc.stateId == 2004) {
      const newNonce = nonce.generatedNonce().toString();
      await setLatestNonce(address, newNonce);
      return response.status(200).json({nonce: newNonce});
    } else {
      return response.sendStatus(400)
          .json({status: userDoc.stateId, message: userDoc.message});
    }
  } catch (err) {
    console.log(err);
    return response.sendStatus(500);
  }
});

exports.verifySignedMessage = onRequest(async (request, response) => {
  console.log(request.body.address, request.body.sigature);
  try {
    if (request.method !== "POST") {
      return response.status(403).send("Not accepted request type");
    }
    if (!request.body.address || !request.body.signature) {
      return response.sendStatus(400);
    }
    const address = request.body.address.toLowerCase();
    const sig = request.body.signature;
    // Get the nonce for this address
    const userDoc = await getLatestNonce(address);
    // const userDoc = await userDocRef.get();
    if (userDoc.isSuccess()) {
      const existingNonce :string = userDoc.data?.() || "";
      console.log("existingNonce is: ", existingNonce);
      // Recover the address of the account used to
      // create the given Ethereum signature.

      // See if that matches the address the user is
      // claiming the signature is from
      if (nonce.isValidatedMessage(address, existingNonce, sig)) {
      // The signature was verified
      // - update the nonce to prevent replay attacks
      // update nonce
        await setLatestNonce(address,
            nonce.generatedNonce().toString());
        // Create a custom token for the specified address

        const tokenDataSnapshot = await getCustomToken(address);
        // TO-DO: set time limit
        console.log("yooo2");

        const firebaseToken = (tokenDataSnapshot.data || (() => ""))();
        // Return the token
        console.log("yooo3");

        return response.status(200).json({token: firebaseToken});
      } else {
      // The signature could not be verified
        return response.sendStatus(401);
      }
    } else {
      console.log("user doc does not exist");
      return response.sendStatus(500);
    }
  } catch (err) {
    console.log(err);
    return response.sendStatus(500);
  }
});
