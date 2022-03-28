/* eslint-disable no-tabs */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {getLatestNonce, setLatestNonce} from "./models/dao/firebase/web3AuthorizationDao";
import {getCustomToken} from "./models/dao/firebase/userDao";
import corsLib from "cors";
import * as nonce from "./utilities/nonce";
// const multiformats = require('multiformats/cid');
// const sha2 = require('multiformats/hashes/sha2');
// const dagPB = require('@ipld/dag-pb');
// const  UnixFS = require('ipfs-unixfs');

const cors = corsLib({
  origin: true,
});


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// exports.renameToCID = functions.storage.bucket('art-planet.appspot.com').object().onFinalize(async (object) => {
// 	// console.log('listened');
// 	// console.log(object);
// 	const bucket = admin.storage().bucket();
// 	const file = bucket.file(object.name);
// 	const data = await file.download({
// 		// destination: object.name,
// 		validation: false
// 	});
// 	// console.log(data)
// 	const bytes = dagPB.encode({Data: new UnixFS.UnixFS({type:'file',data: data.pop()}).marshal(),Links:[]});
// 	console.log(bytes);

// 	const hash = await sha2.sha256.digest(bytes);

// 	const cid = multiformats.CID.createV0(hash);
// 	// console.log('cid: ' + cid.toString());
// 	if(cid.toString().localeCompare(file.name)){
// 		await file.rename(cid.toString());
// 	}
// });


exports.getNonce = functions.https.onRequest((request, response) =>
  cors(request, response, async () => {
    try {
      if (request.method !== "POST") {
        return response.status(403).send("Not accepted request type");
      }
      const userDoc = await getLatestNonce(request.body.address);

      functions.logger.info("address: ", request.body.address, "userDoc", userDoc.data, {structuredData: true});

      if (request.body.address && userDoc.data) {
        return response.status(200).json({nonce: userDoc.data()});
      } else {
        return response.sendStatus(400);
      }
    } catch (err) {
      console.log(err);
      return response.sendStatus(500);
    }
  })
);

exports.verifySignedMessage = functions.https.onRequest((request, response) =>
  cors(request, response, async () => {
    console.log(request.body.address, request.body.sigature);
    try {
      if (request.method !== "POST") {
        return response.status(403).send("Not accepted request type");
      }
      if (!request.body.address || !request.body.signature) {
        return response.sendStatus(400);
      }
      const address = request.body.address;
      const sig = request.body.signature;
      // Get the nonce for this address
      const userDoc = await getLatestNonce(request.body.address);
      // const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        const existingNonce :string = (userDoc.data || (() => ""))();
        console.log("existingNonce is: ", existingNonce);
        // Recover the address of the account used to create the given Ethereum signature.

        // See if that matches the address the user is claiming the signature is from
        if (nonce.isVerified(address, existingNonce, sig)) {
          // The signature was verified - update the nonce to prevent replay attacks
          // update nonce
          console.log("yooo");
          await setLatestNonce(request.body.adress);
          // Create a custom token for the specified address

          console.log("yooo1");


          const tokenDataSnapshot = await getCustomToken(request.body.address); // TO-DO: set time limit
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
  })
);

