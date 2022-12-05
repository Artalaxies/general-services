import {DataSnapshot} from "../../utilities/type/data_snapshot";
import {notion, USER_DATABASE_ID} from "./config";
import {pipe} from "fp-ts/function";
import * as RT from "fp-ts/lib/ReaderTask";
import * as O from "fp-ts/lib/Option";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import {ReaderTask} from "fp-ts/lib/ReaderTask";
import {LoggerEnv} from "logger-fp-ts";
import * as L from "logger-fp-ts";
import {loggingRTE} from "../../utilities/logger";
import {chainReaderTaskEitherTryCatch} from "../../utilities/type/error";

/**
 * Adds two numbers together.
 * @param {string} _id The first number.
 * @return {string} The sum of the two numbers.
 */
export const getUserInfo = (_id: string):
  ReaderTask<LoggerEnv, DataSnapshot<string>> =>
  pipe(
      RTE.ask<LoggerEnv>(),
      loggingRTE(() => L.debug("function getUserInfo accessed.")),
      chainReaderTaskEitherTryCatch(
          () => notion.databases.query({
            database_id: USER_DATABASE_ID,
            filter: {
              property: "identity",
              rich_text: {
                equals: _id,
              },
            },
          })),
      RTE.map((res) => O.fromNullable(res.results.at(0)?.id)),
      RTE.chain(O.match(
          () => pipe(
              RTE.ask<LoggerEnv, Error>(),
              RTE.chainFirst(() => RTE.fromReader(L.debug("User not found"))),
              RTE.map( (_) => new DataSnapshot<string>(2001,
                  undefined,
                  "User not found.")),
          ),
          (id) => pipe(
              RTE.ask<LoggerEnv, Error>(),
              RTE.chainFirst(() =>
                RTE.fromReader(L.debug("Get User Id: " + id))),
              RTE.map((_) => new DataSnapshot(2000, id)),
          )
      )),
      RTE.getOrElse( (err) => RT.of(
          new DataSnapshot<string>(2001, undefined, "User not found.")))
  );
