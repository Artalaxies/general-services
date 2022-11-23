import {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";
import {DataSnapshot} from "../../../utilities/snapshot/data_snapshot";
import {notion, TODOLIST_DATABASE_ID} from "./config";
import {getDatabaseIdbyUserId} from "./user_database_dao";

/**
 * getTodoListDatabaseIdbyUserId.
 * @param {string} userId user id.
 * @return {string} database id.
 */
export function getTodoListDatabaseIdbyUserId(userId: string):
 Promise<DataSnapshot<string>> {
  return getDatabaseIdbyUserId(TODOLIST_DATABASE_ID, userId);
}

/**
 * getTodoListContent.
 * @param {string} databaseId database id.
 * @return {Promise<DataSnapshot<PageObjectResponse[]>>}
 * Todo List Content.
 */
export function getTodoListContent(databaseId: string):
 Promise<DataSnapshot<PageObjectResponse[]>> {
  return notion.databases.query(
      {
        database_id: databaseId,
      }).then((res) =>{
    return new DataSnapshot(true, 2000,
        ()=> <PageObjectResponse[]>res.results);
  });
}
