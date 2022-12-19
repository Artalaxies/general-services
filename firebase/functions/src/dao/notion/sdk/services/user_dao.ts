import {DataSnapshot} from "../../../../models/data_snapshot/data_snapshot";
import {pipe} from "fp-ts/function";
import * as O from "fp-ts/lib/Option";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import {ReaderTaskEither} from "fp-ts/lib/ReaderTaskEither";
import {ReaderTask} from "fp-ts/lib/ReaderTask";
import {LoggerEnv} from "logger-fp-ts";
import * as L from "logger-fp-ts";
import {queryDatabase} from "../basic_dao";
import {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";
import * as RTE2 from "../../../../typed/ReaderTaskEither";
import {NotionEnv} from "../../../../configs/notion";

/**
 * Adds two numbers together.
 * @param {string} userId The first number.
 * @param {string} databaseId The first number.
 * @return {string} The sum of the two numbers.
 */
export const getUserInfo = (userId: string):
  ReaderTaskEither<LoggerEnv & NotionEnv, Error, PageObjectResponse> => pipe(
    RTE.ask<LoggerEnv & NotionEnv, Error>(),
    RTE2.log(() => L.debug("Beginning execution of \"getUserInfo\"")),
    RTE.chain(
        () => queryDatabase({
          filter: {
            property: "identity",
            rich_text: {
              equals: userId,
            },
          },
        })),
    RTE.map((res) => O.fromNullable(<PageObjectResponse>res.results.at(0))),
    RTE.map(O.match(
        () => {
          throw new Error("Unable to find user information data.");
        },
        (pagebr) => pagebr
    )),
);


/**
 * Adds two numbers together.
 * @param {string} userId The first number.
 * @param {string} databaseId The first number.
 * @return {string} The sum of the two numbers.
 */
export const updateUserInfo = (userId: string):
 ReaderTask<LoggerEnv & NotionEnv, DataSnapshot<string>> =>
  pipe(
      RTE.ask<LoggerEnv & NotionEnv>(),
      RTE2.log(() => L.debug("function getUserInfo accessed.")),
      RTE.chain(
          () => queryDatabase({
            filter: {
              property: "identity",
              rich_text: {
                equals: userId,
              },
            },
          })),
      RTE.map((res) => O.fromNullable(res.results.at(0)?.id)),
      RTE.chain(O.match(
          () => pipe(
              RTE.ask<LoggerEnv & NotionEnv, Error>(),
              RTE2.log(() => L.debug("User not found")),
              RTE.map(() => new DataSnapshot<string>(2001,
                  undefined,
                  "User not found.")),
          ),
          (id) => pipe(
              RTE.ask<LoggerEnv & NotionEnv, Error>(),
              RTE2.log(() => L.debug("Get User Id: " + id)),
              RTE.map(() => new DataSnapshot(2000, id)),
          )
      )),
      RTE.match(
          (err) => new DataSnapshot<string>(2001, undefined, err.message),
          (id) => id
      ),
  );
