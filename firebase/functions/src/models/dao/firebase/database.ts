/*eslint linebreak-style: ["error", "unix"]*/

import firebaseAdmin from 'firebase-admin';
export const admin = firebaseAdmin.initializeApp({
    storageBucket: 'art-planet.appspot.com'
});


