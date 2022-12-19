import {onCall} from "../../utilities/https";
import * as functions from "firebase-functions";
import {pipe} from "fp-ts/function";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as O from "fp-ts/lib/Option";
import * as L from "logger-fp-ts";
import * as Blog from "../../dao/notion/sdk/services/blog_dao";
import * as RTE2 from "../../typed/ReaderTaskEither";
import {readParameterOption} from "../untils";
import {throwError} from "../../typed/Error";
import {Binding} from "../../configs/binding";


exports.getRecentPost = onCall(async (data, context) => await pipe(
    RTE.asks<typeof Binding, void, functions.https.HttpsError>(() => {}),
    RTE2.log(() => L.debug("Accessing Endpoint \"getRecentPost\"")),
    readParameterOption("limit", () => data["limit"]),
    RTE.map((param) =>
      ({...param, limit: O.map((value) => Number(value))(param.limit)})),
    RTE.map((param) => ({...param, limit: O.getOrElse(() => 10)(param.limit)})),
    RTE.chainW(({limit})=>
      Blog.getPostList(limit)),
    RTE.bimap((e) => throwError(e instanceof functions.https.HttpsError ? e :
    new functions.https
        .HttpsError("unavailable", e.message)),
    (taskList) => taskList),
)(Binding)());
