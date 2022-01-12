const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const corsLib = require('cors');
const metaUtil = require('@metamask/eth-sig-util');
const multiformats = require('multiformats/cid');
const sha2 = require('multiformats/hashes/sha2');
const dagPB = require('@ipld/dag-pb');
const  UnixFS = require('ipfs-unixfs');

const admin = firebaseAdmin.initializeApp({
	storageBucket: 'art-planet.appspot.com'
});
const cors = corsLib({
	origin: true,
});



exports.renameToCID = functions.storage.bucket('art-planet.appspot.com').object().onFinalize(async (object) => {
	// console.log('listened');
	// console.log(object);
	const bucket = admin.storage().bucket();
	const file = bucket.file(object.name);
	const data = await file.download({
		// destination: object.name,
		validation: false
	});
	// console.log(data)
	const bytes = dagPB.encode({Data: new UnixFS.UnixFS({type:'file',data: data.pop()}).marshal(),Links:[]});
	console.log(bytes);
	
	const hash = await sha2.sha256.digest(bytes);

	const cid = multiformats.CID.createV0(hash);
	// console.log('cid: ' + cid.toString());
	if(cid.toString().localeCompare(file.name)){
		await file.rename(cid.toString());
	}
});


exports.getNonceToSign = functions.https.onRequest((request, response) =>
	cors(request, response, async () => {
		try {
			if (request.method !== 'POST') {
				return response.status(403).send('Not accepted request type');
			}
			if (!request.body.address) {
				return response.sendStatus(400);
			}
			// Get the user document for that address
			const userDoc = await admin
				.firestore()
				.collection('users')
				.doc(request.body.address)
				.get();
			if (userDoc.exists) {
				// The user document exists already, so just return the nonce
				const existingNonce = userDoc.data()?.nonce;
				return response.status(200).json({ nonce: existingNonce });
			} else {
				// The user document does not exist, create it first
				const generatedNonce = Math.floor(Math.random() * 1000000).toString();
				// Create an Auth user
				const createdUser = await admin.auth().createUser({
					uid: request.body.address,
				});
				// Associate the nonce with that user
				await admin.firestore().collection('users').doc(createdUser.uid).set({
					nonce: generatedNonce,
				});
				return response.status(200).json({ nonce: generatedNonce });
			}
		} catch (err) {
			console.log(err);
			return response.sendStatus(500);
		}
	})
);

exports.verifySignedMessage = functions.https.onRequest((request, response) =>
	cors(request, response, async () => {
		try {
			if (request.method !== 'POST') {
				return response.status(403).send('Not accepted request type');
			}
			if (!request.body.address || !request.body.signature) {
				return response.sendStatus(400);
			}
			const address = request.body.address;
			const sig = request.body.signature;
			// Get the nonce for this address
			const userDocRef = admin.firestore().collection('users').doc(address);
			const userDoc = await userDocRef.get();
			if (userDoc.exists) {
				const existingNonce = userDoc.data()?.nonce;
				console.log('existingNonce is: ', existingNonce)
				// Recover the address of the account used to create the given Ethereum signature.
				const recoveredAddress = metaUtil.recoverPersonalSignature({
					data: `0x${toHex(existingNonce)}`,
					signature: sig,
				});
				console.log('data is: ', `0x${toHex(existingNonce)}`);
				console.log('recoveredAddress is: ', recoveredAddress);
				console.log('address is: ', address);
				// See if that matches the address the user is claiming the signature is from
				if (recoveredAddress === address.toLowerCase()) {
					// The signature was verified - update the nonce to prevent replay attacks
					// update nonce
					await userDocRef.update({
						nonce: Math.floor(Math.random() * 1000000).toString(),
					});
					// Create a custom token for the specified address
					const firebaseToken = await admin.auth().createCustomToken(address); // TO-DO: set time limit 
					// Return the token
					return response.status(200).json({ token: firebaseToken });
				} else {
					// The signature could not be verified
					return response.sendStatus(401);
				}
			} else {
				console.log('user doc does not exist');
				return response.sendStatus(500);
			}
		} catch (err) {
			console.log(err);
			return response.sendStatus(500);
		}
	})
);

const toHex = stringToConvert =>
	stringToConvert
		.split('')
		.map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
		.join('');
