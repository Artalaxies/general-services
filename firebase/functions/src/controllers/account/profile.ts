// import * as functions from "firebase-functions";
// import corsLib from "cors";


// const cors = corsLib({
//   origin: true,
// });


// exports.getProfile = functions.https
//     .onRequest((request, response) =>
//       cors(request, response, async () => {
//         try {
//           if (request.method !== "POST") {
//             return response.status(403).send("Not accepted request type");
//           }

//           return response.status(200);
//         } catch (err) {
//           console.log(err);
//           return response.sendStatus(500);
//         }
//       }));


// exports.setProfile = functions.https
//     .onRequest((request, response) =>
//       cors(request, response, async () => {
//         try {
//           if (request.method !== "POST") {
//             return response.status(403).send("Not accepted request type");
//           }
//           return response.status(200);
//         } catch (err) {
//           console.log(err);
//           return response.sendStatus(500);
//         }
//       }));


// exports.getName = functions.https
//     .onRequest((request, response) =>
//       cors(request, response, async () => {
//         try {
//           if (request.method !== "POST") {
//             return response.status(403).send("Not accepted request type");
//           }
//           return response.status(200);
//         } catch (err) {
//           console.log(err);
//           return response.sendStatus(500);
//         }
//       }));
