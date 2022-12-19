import {pipe} from "fp-ts/function";
import * as RTE from "fp-ts/ReaderTaskEither";
import {LoggerEnv} from "logger-fp-ts";
import {ReaderTaskEither} from "fp-ts/ReaderTaskEither";
import * as L from "logger-fp-ts";
import {
  createEntity, queryDatabase} from "../basic_dao";
import {CreateDatabaseParameters, PageObjectResponse}
  from "@notionhq/client/build/src/api-endpoints";
import {serviceDatabaseTemplate}
  from "../../../../models/notion/services/general";
import {ServiceEntity, ServiceList}
  from "../../../../models/adt/service";
// import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
// import {Option} from "fp-ts/lib/Option";
import {defaultCreatePageTemplate} from "../../../../models/notion/basic";
import {RichText, Select} from "../../../../models/notion/package";
import * as RTE2 from "../../../../typed/ReaderTaskEither";
import {ServiceKey, UIDKey, ServiceIdKey}
  from "../../../../configs/service/general";
import {NotionEnv} from "../../../../configs/notion";


/**
 * getServiceList.
 * @param {string} uid entity id.
 * @return {string} The sum of the two numbers.
 * @category Data Access
 * @since 0.0.1
 */
export const getServiceList =
<R extends LoggerEnv & NotionEnv>(uid: string):
 (ReaderTaskEither<R, Error, ServiceList>) => pipe(
      RTE.ask<R, Error>(),
      RTE2.log(() =>
        L.debug("Accessing Endpoint \"getServiceList\"")),
      RTE.chain(()=> queryDatabase({
        filter: {
          property: UIDKey,
          title: {
            equals: uid,
          },
        },
      })),
      RTE.map((res) => <PageObjectResponse[]>res.results),
      RTE.map(A.map((p) => <ServiceEntity>({
        name: (<Select>p.properties[ServiceKey]).select?.name || "",
        id: (<RichText>p.properties[ServiceIdKey])
            .rich_text[0].plain_text || "",
      }))),
  );

/**
 * createIndividualServiceDatabase
 * @param {string} entityId entity id.
 * @param {string} serviceName Service Name.
 * @param {EntityParameters<CreateDatabaseParameters>} parameters
 * user id.
 * @return {string} The sum of the two numbers.
 * @category Data Access
 */
export const createIndividualServiceDatabase =
(entityId: string, serviceName: string,
    parameters: Partial<CreateDatabaseParameters>):
ReaderTaskEither<LoggerEnv, Error, string> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    RTE2.log(() =>
      L.debug("Accessing Endpoint \"createServiceDatabase\"")),
    RTE.chain(()=>
      createEntity(serviceDatabaseTemplate(entityId, serviceName)
          .update(parameters)))
);


/**
 * register service.
 * @param {string} uid user id.
 * @param {string} serviceName user id.
 * @param {string} serviceId service Database id.
 * @return {string} The sum of the two numbers.
 * @category Data Access
 * @since 0.0.1
 */
export const registerService =
<R extends LoggerEnv & NotionEnv>(uid: string,
    serviceName: string, serviceId: string):
 (ReaderTaskEither<R, Error, string>) =>
    pipe(
        RTE.ask<R, Error>(),
        RTE2.log(() => L.debug("Accessing Endpoint \"registerService\"")),
        RTE2.log(() =>
          L.debug("Registering Service " + serviceName + "to " + uid)),
        RTE.chain(() => (r: R) =>
          createEntity(defaultCreatePageTemplate(r.SERVICE_DATABASE_ID).update({
            properties: {
              [UIDKey]: {
                title: [
                  {
                    text: {
                      content: uid,
                    },
                  },
                ],
              },
              [ServiceKey]: {
                select: {
                  id: serviceName,
                  name: serviceName,
                },
              },
              [ServiceIdKey]: {
                rich_text: [
                  {
                    text: {
                      content: serviceId,
                    },
                  },
                ],
              },
            },
          }))(r)),
    );


// TODO: implement it.
export const unregisterService = (entityId: string) =>
  (databaseId : string) => pipe(
      RTE.ask<LoggerEnv, Error>(),
      RTE2.log(() => L.debug("Accessing Endpoint \"registerService\"")),

  );
