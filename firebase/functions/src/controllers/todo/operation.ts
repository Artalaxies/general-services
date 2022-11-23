import {onCall} from "../../utilities/https";
import * as functions from "firebase-functions";
import {getTodoListDatabaseIdbyUserId} from "../../models/dao/notion/todo_dao";


exports.getMyTodoList = onCall(async (_, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated",
        "The function must be called by authorized user.");
  }

  const id = (await getTodoListDatabaseIdbyUserId(context.auth.uid)).data?.();
  console.log("id:" + id);
  return {id: id};
});
