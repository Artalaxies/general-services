import * as functions from "firebase-functions";
import corsLib from "cors";


const cors = corsLib({
  origin: true,
});


exports.registerAccount = functions.https
    .onRequest((request, response) =>
      cors(request, response, () => {
        try {
          if (request.method !== "GET") {
            return response.status(403).send("Not accepted request type");
          }

          return response.status(200);
        } catch (err) {
          console.log(err);
          return response.sendStatus(500);
        }
      }));

exports.deleteAccount = functions.https
    .onRequest((request, response) =>
      cors(request, response, () => {
        try {
          if (request.method !== "POST") {
            return response.status(403).send("Not accepted request type");
          }

          return response.status(200);
        } catch (err) {
          console.log(err);
          return response.sendStatus(500);
        }
      }));
