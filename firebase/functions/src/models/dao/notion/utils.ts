import {notion, TODOLIST_DATABASE_ID} from "./config";
import {pipe} from "fp-ts/function";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import {LoggerEnv} from "logger-fp-ts";
import {ReaderTaskEither} from "fp-ts/lib/ReaderTaskEither";
import * as L from "logger-fp-ts";
import {loggingRTE} from "../../../utilities/logger";
// import {
//   CreateDatabaseParameters} from "@notionhq/client/build/src/api-endpoints";
import {todolistDatabaseTemplate,
  defaultPageTemplate} from "../../entities/notion/template";
import {chainReaderTaskEitherTryCatch} from "../../../utilities/type/error";
import {createEntity} from "./database_dao";


/**
 * Adds two numbers together.
 * @param {string} userId user id.
 * @return {string} The sum of the two numbers.
 * @category Data Access
 */
export const createUserTodoDatabase = (userId: string):
ReaderTaskEither<LoggerEnv, Error, string> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    loggingRTE(() =>
      L.debug("function createUserTodoDatabase accessed.")),
    RTE.bind("response", () =>
      createEntity(defaultPageTemplate(TODOLIST_DATABASE_ID, userId)) ),
    RTE.bind("response2", ({response})=>
      createEntity(todolistDatabaseTemplate(response, []))),
    chainReaderTaskEitherTryCatch(
        ({response, response2}) => notion.pages.update({
          page_id: response,
          properties: {
            "database": {
              rich_text: [
                {
                  text: {
                    content: response2,
                  },
                },
              ],
            },
          },
        }).then((_) => response2))
);


