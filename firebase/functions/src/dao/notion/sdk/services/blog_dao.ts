import {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";
import {pipe} from "fp-ts/lib/function";
import {ReaderTaskEither} from "fp-ts/lib/ReaderTaskEither";
import {LoggerEnv} from "logger-fp-ts";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import {queryDatabase} from "../basic_dao";
import * as L from "logger-fp-ts";
import * as RTE2 from "../../../../typed/ReaderTaskEither";
import {PublishDateKey, PublishedKey} from "../../../../configs/service/blog";
import {NotionEnv} from "../../../../configs/notion";


/**
 * get PostList.
 * @param {number} limit size for the response.
 * @param {string} databaseId database id.
 * @return {Promise<DataSnapshot<PageObjectResponse[]>>}
 * Todo List Content.
 */
export const getPostList = (limit: number = 10):
ReaderTaskEither<LoggerEnv & NotionEnv, Error, PageObjectResponse[]> =>
  pipe(
      RTE.ask<LoggerEnv, Error>(),
      RTE2.log(() => L.debug("Beginning execution of \"getPostList\"")),
      RTE.chain(() => queryDatabase({
        sorts: [
          {
            property: PublishDateKey,
            direction: "descending",
          },
        ],
        filter: {
          property: PublishedKey,
          checkbox: {
            equals: true,
          },
        },
        page_size: limit,
      })),
      RTE.map((rep) => <PageObjectResponse[]>rep.results),
  );
