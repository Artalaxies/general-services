import {PageObjectResponse,
  RichTextItemResponse} from "@notionhq/client/build/src/api-endpoints";
import {DataSnapshot} from "../../../utilities/type/data_snapshot";
import {notion} from "./config";
import {createUserTodoDatabase} from "./utils";
import {pipe} from "fp-ts/function";
import {ReaderTask} from "fp-ts/lib/ReaderTask";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as RT from "fp-ts/lib/ReaderTask";
import {LoggerEnv} from "logger-fp-ts";
import * as L from "logger-fp-ts";
import * as O from "fp-ts/lib/Option";
import {loggingRTE, loggingRTEonError} from "../../../utilities/logger";
import {chainReaderTaskEitherTryCatch} from "../../../utilities/type/error";
import {EntityParameter} from "../../entities/notion/template";
import {ReaderTaskEither} from "fp-ts/lib/ReaderTaskEither";


type rich_text = {
  type: "rich_text";
  rich_text: Array<RichTextItemResponse>;
  id: string;
}

/**
 * getTodoListDatabaseIdbyUserId.
 * @param {string} rootDatabaseId user id.
 * @param {string} userId user id.
 * @return {ReaderTask<LoggerEnv, DataSnapshot<string>>}
 *  The sum of the two numbers.
 */
export const getDatabaseIdbyUserId = (
    rootDatabaseId: string,
    userId: string):
    ReaderTask<LoggerEnv, DataSnapshot<string>> => pipe(
    RTE.ask<LoggerEnv>(),
    loggingRTE(()=>L.debug("function createUserTodoDatabase accessed.")),
    chainReaderTaskEitherTryCatch(
        () => notion.databases.query({
          database_id: rootDatabaseId,
          filter: {
            property: "Name",
            rich_text: {
              equals: userId,
            },
          },
        })),
    RTE.map((res) =>
      O.fromNullable((res.results.at(0)))),
    RTE.chain(O.match(
        () => pipe(
            RTE.ask<LoggerEnv, Error>(),
            RTE.chainFirst((a) => RTE.fromReader(L.debug("User not found."))),
            RTE.chainFirst((_) => createUserTodoDatabase(userId)),
            RTE.map((_) => new DataSnapshot<string>(
                2001,
                undefined,
                "User not found."))
        ),
        (pageObj) => pipe(
            RTE.ask<LoggerEnv, Error>(),
            RTE.map((_) =>
              O.fromNullable(
                  (<rich_text>(<PageObjectResponse >pageObj)
                      .properties["database"])
                      .rich_text[0].plain_text)),
            RTE.chain(O.match(
                () => pipe(
                    RTE.ask<LoggerEnv, Error>(),
                    RTE.map((_) => new DataSnapshot<string>( 2001, undefined))
                ),
                (pageId) => pipe(
                    RTE.ask<LoggerEnv, Error>(),
                    RTE.map((_) => new DataSnapshot(2000, pageId))
                )
            ))
        )
    ),
    ),
    RTE.getOrElse((error) => RT.of(
        new DataSnapshot<string>( 2001, undefined, error.message))),
);


/**
 * getTodoListDatabaseIdbyUserId.
 * @param {string} blockId user id.
 * @return {string} The sum of the two numbers.
 */
export const getDatabaseIdbyBlockId =(blockId: string):
ReaderTask<LoggerEnv, DataSnapshot<string>> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    loggingRTE(()=>L.debug("function createUserTodoDatabase accessed.")),
    chainReaderTaskEitherTryCatch(
        () => notion.blocks.children.list({
          block_id: blockId,
        }).then((res) =>{
          const pageId = res.results[0]?.id;
          if (pageId) {
            return new DataSnapshot(2000, pageId);
          } else {
            return new DataSnapshot<string>(2001,
                undefined,
                "Database Not Found");
          }
        })
    ),
    RTE.getOrElse((error) =>
      RT.of(new DataSnapshot<string>(2001, undefined, error.message)))
);


/**
 * Create an Entity with Notion API.
 * @example
 * createEntity({title: [],
 *               properties: {
 *                  "Name": {
 *                     title: {},
 *                   },
 *               }
 *              });
 * @category Database Operation
 * @since 0.0.1
 * @internal
 * @param {EntityParameter} entity user id.
 * @return {ReaderTaskEither<LoggerEnv, Error, string>}
 * The id of the Entity.
 */
export const createEntity = (entity:
  EntityParameter<any>):
ReaderTaskEither<LoggerEnv, Error, string> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    loggingRTE(() => L.debug("Beginning execution of \"createDatabase\"")),
    loggingRTE(() => L.debugP("Entity Type")({type: entity._tag})),
    chainReaderTaskEitherTryCatch(
        () => {
          switch (entity._tag) {
            case "page":
              return notion.pages
                  .create(entity.parameters)
                  .then((res)=> res.id);
            case "database":
              return notion.databases
                  .create(entity.parameters)
                  .then((res)=> res.id);
            default: // placeholder
              throw new Error("Invalid template");
          }
        }
    ),
    loggingRTE((createdEntityId) =>
      L.debugP("Created Database")({id: createdEntityId})),
    loggingRTEonError((e) =>
      L.errorP("Access Notion API Error")({error: e.message})),
);
