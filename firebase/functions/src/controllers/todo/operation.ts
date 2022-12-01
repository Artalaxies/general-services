import {onCall} from "../../utilities/https";
import * as functions from "firebase-functions";
import {getTodoListDatabaseIdbyUserId} from "../../models/dao/notion/todo_dao";
import {pipe} from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as L from "logger-fp-ts";
import {developmentEnv, loggingRTE} from "../../utilities/logger";
import {LoggerEnv} from "logger-fp-ts";

exports.getMyTodoList = onCall(async (_, context) => await pipe(
    RTE.ask<LoggerEnv, functions.https.HttpsError>(),
    loggingRTE(
        () => L.debug("Accessing Endpoint \"getMyTodoList\"")),
    RTE.map((_) => O.fromNullable(context.auth)),
    RTE.chain(O.match(
        () => RTE.left(new functions.https.HttpsError("unauthenticated",
            "The function must be called by authorized user.")),
        (auth) => pipe(
            RTE.ask<LoggerEnv, functions.https.HttpsError>(),
            RTE.chainFirst((_) => RTE.fromReader(L.debug("id: " + auth.uid))),
            RTE.chain((_)=>
              RTE.fromReader(getTodoListDatabaseIdbyUserId(auth.uid))),
        )
    ))
)(developmentEnv)());

//   if (!context.auth) {
//     throw new functions.https.HttpsError("unauthenticated",
//         "The function must be called by authorized user.");
//   }

//   const id = (await getTodoListDatabaseIdbyUserId(context.auth.uid)).get?.();
//   console.log("id:" + id);
//   return {id: id};
// });
