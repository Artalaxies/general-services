"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var functions = require("firebase-functions");
var authDao_1 = require("artalaxies-backend/src/models/dao/firebase/authDao");
var corsLib = require('cors');
// const metaUtil = require('@metamask/eth-sig-util');
// const multiformats = require('multiformats/cid');
// const sha2 = require('multiformats/hashes/sha2');
// const dagPB = require('@ipld/dag-pb');
// const  UnixFS = require('ipfs-unixfs');
var cors = corsLib({
    origin: true
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
exports.getNonce = functions.https.onRequest(function (request, response) {
    return cors(request, response, function () { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (request.method !== 'POST') {
                        return [2 /*return*/, response.status(403).send('Not accepted request type')];
                    }
                    return [4 /*yield*/, authDao_1.getLatestNonce(request.body.address)];
                case 1:
                    userDoc = _a.sent();
                    if (!request.body.address && userDoc.data !== undefined)
                        return [2 /*return*/, response.status(200).json({ nonce: userDoc.data() })];
                    else {
                        return [2 /*return*/, response.sendStatus(400)];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, response.sendStatus(500)];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
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
