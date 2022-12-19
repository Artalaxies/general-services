

// const useEmulator = true;

// if (useEmulator) {
//   process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
// }


// export * from "./controllers/account/account";
// export * from "./controllers/account/profile";
export * as todo from "./controllers/todo/operation";
export * as blog from "./controllers/blog/operation";
export * as web3auth from "./controllers/web3/authorization";
export * as web3connect from "./controllers/web3/connect_account";


// const multiformats = require('multiformats/cid');
// const sha2 = require('multiformats/hashes/sha2');
// const dagPB = require('@ipld/dag-pb');
// const  UnixFS = require('ipfs-unixfs');


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

