/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import corsLib from "cors";
// import {DataSnapshot} from "./snapshot/data_snapshot";

const cors = corsLib({
//   origin: true,
});

export function onRequest(handler:
  ((_: functions.https.Request,
  __: functions.Response) => any)):functions.HttpsFunction {
  return functions.https.onRequest((request, response) =>
    cors(request, response, async () => await handler(request, response)));
}

export function onCall(handler:
    ((data: any,
    context: functions.https.CallableContext) => any)):
    functions.HttpsFunction & functions.Runnable<any> {
  return functions.https.onCall((data, context) =>handler(data, context));
}


// export function cookieCheck(request: functions.https.Request,
//     response: functions.Response): DataSnapshot<any> {
//   // Verify the session cookie. In this case an
//   // additional check is added to detect
//   // if the user's Firebase session was revoked, user deleted/disabled, etc.

//   // Get the ID token passed and the CSRF token.
//   const csrfToken:string = request.body.csrfToken.toString();
//   // Guard against CSRF attacks.
//   if (csrfToken !== request.cookies.csrfToken) {
//     response.status(401).send("Unauthorized Request!");
//     return;
//   }
// }


// export function sessionUpdate(sessionCookie: string,
//     response: functions.Response) {
//   // Set session expiration to 5 days.
//   const expiresIn = 60 * 60 * 24 * 5 * 1000;
//   // Set cookie policy for session cookie.
//   const options = {maxAge: expiresIn, httpOnly: true, secure: true};
//   response.cookie("session", sessionCookie, options);
//   response.end(JSON.stringify({status: "success"}));
// }
