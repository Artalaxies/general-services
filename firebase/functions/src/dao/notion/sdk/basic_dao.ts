import {PageObjectResponse,
  GetPageResponse,
  GetDatabaseResponse,
  UpdateDatabaseParameters,
  UpdatePageParameters,
  DatabaseObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  ListBlockChildrenParameters,
  ListBlockChildrenResponse} from "@notionhq/client/build/src/api-endpoints";
import {notion, NotionEnv} from "../../../configs/notion";
import {pipe} from "fp-ts/function";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import {LoggerEnv} from "logger-fp-ts";
import * as L from "logger-fp-ts";
import * as RTE2
  from "../../../typed/ReaderTaskEither";
import {ReaderTaskEither} from "fp-ts/lib/ReaderTaskEither";
import {EntityParameters}
  from "../../../models/notion/entity_parameters";
import {errorHandler} from "../../../typed/Error";
import * as TE from "fp-ts/lib/TaskEither";


export type EntityParameterType =
UpdateDatabaseParameters | UpdatePageParameters;

export type EntityResponseType =
GetPageResponse | GetDatabaseResponse;

type EntityType = "page" | "database";


/**
 * Create an Entity with Notion API.
 * @example
 * createEntity();
 * @category Database Operation
 * @since 0.0.1
 * @internal
 * @param {EntityParameters} entity user id.
 * @return {ReaderTaskEither<LoggerEnv, Error, string>}
 * The id of the Entity.
 */
export const createEntity = <R extends LoggerEnv>(entity:
  EntityParameters<any>):
ReaderTaskEither<R, Error, string> => pipe(
      RTE.ask<R, Error>(),
      RTE2.log(() => L.debug("Beginning execution of \"createEntity\"")),
      RTE2.log(() => L.debugP("Entity Type")({type: entity._tag})),
      RTE2.tryCatch(
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
          },
          errorHandler
      ),
      RTE2.log((createdEntityId) =>
        L.debugP("Created Entity")({id: createdEntityId})),
      RTE2.logOnError((e) =>
        L.errorP("Access Notion API Error")({error: e.message})),
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
 * @param {string} entity user id.
 * @return {ReaderTaskEither<LoggerEnv, Error, string>}
 * The id of the Entity.
 */
export const deleteEntity =
<R extends LoggerEnv>(entity: EntityParameters<any>):
ReaderTaskEither<R, Error, any> => pipe(
      RTE.ask<R, Error>(),
      RTE2.log(() => L.debug("Beginning execution of \"deleteEntity\"")),
      RTE.chain(() => updateEntity<R>({
        ...entity,
        parameters: {
          ...entity.parameters,
          archived: true,
        },
      })),
      RTE2.log(() =>
        L.debug("Deleted Enity")),
  );

/**
 * Update an Entity with Notion API.
 * @example
 * updateEntity(defaultUpdateDatabase("notion_id"));
 * @category Database Operation
 * @since 0.0.1
 * @internal
 * @param {EntityParameters<any>} entityParameters Entity Parameters.
 * @return {ReaderTaskEither<LoggerEnv, Error, string>}
 * The id of the Entity.
 */
export const updateEntity = <R>(entityParameters: EntityParameters<any>):
 ReaderTaskEither<R, Error, string> => pipe(
      RTE.ask<LoggerEnv, Error>(),
      RTE2.log(() => L.debug("Beginning execution of \"updateEntity\"")),
      RTE2.tryCatch(
          () => {
            switch (entityParameters._tag) {
              case "page":
                return notion.pages
                    .update(entityParameters.parameters)
                    .then((res)=> res.id);
              case "database":
                return notion.databases
                    .update(entityParameters.parameters)
                    .then((res)=> res.id);
              default: // placeholder
                throw new Error("Invalid template");
            }
          },
          errorHandler
      ),
      RTE2.log(() =>
        L.debug("Updated Enity")),
      RTE2.logOnError((e) =>
        L.errorP("Access Notion API Error")({error: e.message})),
  );


/**
 * Check an Entity with Notion API.
 * @example
 * checkEntity("notion_id");
 * @category Database Operation
 * @since 0.0.1
 * @internal
 * @param {EntityType} type Entity Type.
 * @param {string} id notion id.
 * @return {ReaderTaskEither<LoggerEnv, Error, string>}
 * The id of the Entity.
 */
export const checkEntity = (type: EntityType):
((_: string) =>ReaderTaskEither<LoggerEnv, Error, EntityResponseType>) =>
  (id: string) => pipe(
      RTE.ask<LoggerEnv, Error>(),
      RTE2.log(() => L.debug("Beginning execution of \"checkEntity\"")),
      RTE2.tryCatch(
          () => {
            switch (type) {
              case "page":
                return notion.pages
                    .retrieve({page_id: id})
                    .then((a) => <GetPageResponse | GetDatabaseResponse>a);
              case "database":
                return notion.databases
                    .retrieve({database_id: id})
                    .then((a) => <GetPageResponse | GetDatabaseResponse>a);
              default: // placeholder
                throw new Error("Invalid template");
            }
          },
          errorHandler
      ),
      RTE2.log(() =>
        L.debug("Updated Enity")),
      RTE2.logOnError((e) =>
        L.errorP("Access Notion API Error")({error: e.message})),
  );


/**
 * Check an Database with Notion API.
 * @example
 * checkDatabase("notion_id");
 * @category Database Operation
 * @since 0.0.1
 * @internal
 * @param {string} id notion id.
 * @return {ReaderTaskEither<LoggerEnv, Error, string>}
 * The id of the Entity.
 */
export const checkDatabaseProperties = (id: string):
 ReaderTaskEither<LoggerEnv, Error, DatabaseObjectResponse> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    RTE2.log(() => L.debug("Beginning execution of \"checkDatabase\"")),
    RTE.chain(() => checkEntity("database")(id)),
    RTE.map((a)=> <DatabaseObjectResponse>a)
);


/**
 * Check an Page with Notion API.
 * @example
 * checkEntity("notion_id");
 * @category Database Operation
 * @since 0.0.1
 * @internal
 * @param {string} pageId notion id.
 * @return {ReaderTaskEither<LoggerEnv, Error, string>}
 * The id of the Entity.
 */
export const checkPageProperties = (pageId: string):
 ReaderTaskEither<LoggerEnv, Error, PageObjectResponse> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    RTE2.log(() => L.debug("Beginning execution of \"checkPage\"")),
    RTE.chain(() => checkEntity("page")(pageId)),
    RTE.map((a)=> <PageObjectResponse>a),
);


/**
 * query an Database with Notion API.
 * @example
 * queryDatabase("notion_id");
 * @category Database Operation
 * @since 0.0.1
 * @internal
 * @param {QueryDatabaseParameters} queryParameters notion id.
 * @return {ReaderTaskEither<LoggerEnv, Error, string>}
 * The id of the Entity.
 */
export const queryDatabase =
 <R extends LoggerEnv & NotionEnv>(
    queryParameters: Partial<QueryDatabaseParameters>):
 ReaderTaskEither<R, Error, QueryDatabaseResponse> => pipe(
      RTE.ask<R, Error>(),
      RTE2.log(() => L.debug("Beginning execution of \"queryDatabase\"")),
      RTE.chain(
          () => ({SERVICE_DATABASE_ID}) => TE.tryCatch(
              ()=> notion.databases.query({
                ...queryParameters,
                database_id: SERVICE_DATABASE_ID,
              }),
              errorHandler
          )
      ),
  );


/**
 * Get Page Content.
 * @category Database Operation
 * @since 0.0.1
 * @internal
 * @param {QueryDatabaseParameters} queryParameters notion id.
 * @return {ReaderTaskEither<LoggerEnv, Error, string>}
 * The id of the Entity.
 */
export const getPageContent =
(queryParameters: ListBlockChildrenParameters):
ReaderTaskEither<LoggerEnv, Error, ListBlockChildrenResponse> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    RTE2.log(() => L.debug("Beginning execution of \"getPageContent\"")),
    RTE2.tryCatch(
        ()=> notion.blocks.children.list(queryParameters),
        errorHandler
    ),
);

