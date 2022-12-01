import {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";
import {DataSnapshot} from "../../../utilities/type/data_snapshot";
import {notion, TODOLIST_DATABASE_ID} from "./config";
import {getDatabaseIdbyUserId} from "./database_dao";
import {pipe} from "fp-ts/function";
import {LoggerEnv} from "logger-fp-ts";
import {ReaderTask} from "fp-ts/lib/ReaderTask";
import * as L from "logger-fp-ts";
import * as RT from "fp-ts/lib/ReaderTask";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import {loggingRT, loggingRTE} from "../../../utilities/logger";
import {chainReaderTaskEitherTryCatch} from "../../../utilities/type/error";

/**
 * getTodoListDatabaseIdbyUserId.
 * @param {string} userId user id.
 * @return {string} database id.
 */
export const getTodoListDatabaseIdbyUserId = (userId: string):
ReaderTask<LoggerEnv, DataSnapshot<string>> => pipe(
    RT.ask<LoggerEnv>(),
    loggingRT(
        ()=> L.debug("function getTodoListDatabaseIdbyUserId accessed.")),
    RT.chain(() => getDatabaseIdbyUserId(TODOLIST_DATABASE_ID, userId)
    )
);

/**
 * getTodoListContent.
 * @param {string} databaseId database id.
 * @return {Promise<DataSnapshot<PageObjectResponse[]>>}
 * Todo List Content.
 */
export const getTodoListContent = (databaseId: string):
ReaderTask<LoggerEnv, DataSnapshot<PageObjectResponse[]>> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    loggingRTE(() => L.debug("function getTodoListContent accessed.")),
    chainReaderTaskEitherTryCatch(
        () => notion.databases.query(
            {
              database_id: databaseId,
            }).then((res) =>{
          return new DataSnapshot(2000, <PageObjectResponse[]>res.results);
        })
    ),
    RTE.getOrElse((error) =>
      RT.of(new DataSnapshot<PageObjectResponse[]>(2001,
          undefined, error.message)))
);


