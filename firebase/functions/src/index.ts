import * as functions from "firebase-functions";
import {getLatestNonce} from 'artalaxies-backend/src/models/dao/firebase/authDao';

const corsLib = require('cors');
// const metaUtil = require('@metamask/eth-sig-util');
// const multiformats = require('multiformats/cid');
// const sha2 = require('multiformats/hashes/sha2');
// const dagPB = require('@ipld/dag-pb');
// const  UnixFS = require('ipfs-unixfs');

const cors = corsLib({
	origin: true,
});


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
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
			if (request.method !== 'POST') {
				return response.status(403).send('Not accepted request type');
			}

			const userDoc = await getLatestNonce(request.body.address)
            
            if(!request.body.address && userDoc.data !== undefined)
				return response.status(200).json({ nonce: userDoc.data()});
			else{
				return response.sendStatus(400);
            }
		} catch (err) {
			console.log(err);
			return response.sendStatus(500);
		}
	})
);

// exports.verifySignedMessage = functions.https.onRequest((request, response) =>
// 	cors(request, response, async () => {
// 		try {
// 			if (request.method !== 'POST') {
// 				return response.status(403).send('Not accepted request type');
// 			}
// 			if (!request.body.address || !request.body.signature) {
// 				return response.sendStatus(400);
// 			}
// 			const address = request.body.address;
// 			const sig = request.body.signature;
// 			// Get the nonce for this address
// 			const userDocRef = admin.firestore().collection('users').doc(address);
// 			const userDoc = await userDocRef.get();
// 			if (userDoc.exists) {
// 				const existingNonce = userDoc.data()?.nonce;
// 				console.log('existingNonce is: ', existingNonce)
// 				// Recover the address of the account used to create the given Ethereum signature.
// 				const recoveredAddress = metaUtil.recoverPersonalSignature({
// 					data: `0x${toHex(existingNonce)}`,
// 					signature: sig,
// 				});
// 				console.log('data is: ', `0x${toHex(existingNonce)}`);
// 				console.log('recoveredAddress is: ', recoveredAddress);
// 				console.log('address is: ', address);
// 				// See if that matches the address the user is claiming the signature is from
// 				if (recoveredAddress === address.toLowerCase()) {
// 					// The signature was verified - update the nonce to prevent replay attacks
// 					// update nonce
// 					await userDocRef.update({
// 						nonce: Math.floor(Math.random() * 1000000).toString(),
// 					});
// 					// Create a custom token for the specified address
// 					const firebaseToken = await admin.auth().createCustomToken(address); // TO-DO: set time limit 
// 					// Return the token
// 					return response.status(200).json({ token: firebaseToken });
// 				} else {
// 					// The signature could not be verified
// 					return response.sendStatus(401);
// 				}
// 			} else {
// 				console.log('user doc does not exist');
// 				return response.sendStatus(500);
// 			}
// 		} catch (err) {
// 			console.log(err);
// 			return response.sendStatus(500);
// 		}
// 	})
// );

// function toHex(stringToConvert:string):string {
// 	return stringToConvert
// 		.split('')
// 		.map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
// 		.join('');
// }
