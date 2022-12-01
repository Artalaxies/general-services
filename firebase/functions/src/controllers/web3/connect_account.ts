import {onRequest} from "../../utilities/https";


// TO-DO
exports.bindWeb3AddressToAccount = onRequest( async (request, response) =>{
  try {
    if (request.method !== "POST") {
      return response.status(403).send("Not accepted request type");
    }

    return response.status(200);
  } catch (err) {
    console.log(err);
    return response.sendStatus(500);
  }
});

// TO-DO
exports.disconnectWeb3addressFromAccount = onRequest(
    async (request, response) => {
      try {
        if (request.method !== "POST") {
          return response.status(403).send("Not accepted request type");
        }
        return response.status(200);
      } catch (err) {
        console.log(err);
        return response.sendStatus(500);
      }
    });
