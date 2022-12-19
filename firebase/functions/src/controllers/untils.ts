import {flow, pipe} from "fp-ts/lib/function";
import {ReaderTaskEither} from "fp-ts/lib/ReaderTaskEither";
import {LoggerEnv} from "logger-fp-ts";
import * as functions from "firebase-functions";
import * as O from "fp-ts/Option";
import * as RTE2 from "../typed/ReaderTaskEither";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as L from "logger-fp-ts";

// export const readParameter =
// <R extends LoggerEnv, A, N extends string>(key: Exclude<N, keyof A>,
//     data : () => string | undefined) =>
//     (reader:
//   ReaderTaskEither<R, functions.https.HttpsError, A>)
//    :ReaderTaskEither<R, functions.https.HttpsError,
//     A & Record<typeof key, string> > => pipe(
//         reader,
//         RTE2.log(() => L.debug("Fetching Parameter: " + key)),
//         RTE.map( (param) =>({
//           ...param,
//           option: O.fromNullable<string | undefined>(data()),
//         })),
//         RTE.map((param) =>({
//           ...param,
//           either: E.fromOption(
//               () => new functions.https.HttpsError("invalid-argument",
//                   "Incorrect arguments."))(param.option),
//         })),
//         RTE.map((param) =>
//           E.match<functions.auth.HttpsError, string,
//       A & Record<typeof key, string>>(throwError,
//           (value) => ({
//             ...<A>param,
//             ...(<Record<typeof key, string>>{
//               [key]: value,
//             }),
//           }))(param.either)
//         ),

//     );
export const readParameter =
<R extends LoggerEnv, A, N extends string>(key: Exclude<N, keyof A>,
    data : (a: A) => string | undefined) =>
    (reader: ReaderTaskEither<R, functions.https.HttpsError, A>) => pipe(
        reader,
        RTE2.log(() => L.debug("Fetching Parameter: " + key)),
        RTE.bind(key, (param)=> ((get) => get ? RTE.of(get) :
            RTE.left(new functions.https.HttpsError("invalid-argument",
                "Incorrect arguments."))
        )(data(param))),
    );


export const readParameterOption =
<R extends LoggerEnv, A, N extends string>(key: Exclude<N, keyof A>,
    data : (a:A) => string | undefined) => flow(
      RTE2.log<R, functions.https.HttpsError, A>(
          () => L.debug("Fetching Parameter: " + key)),
      RTE.bind(key, (param)=>
        RTE.of(O.fromNullable<string | undefined>(data(param)))),
  );


export const authCheck = <R extends LoggerEnv, A>(
  context : functions.https.CallableContext) =>
    flow(
        RTE2.log<R, functions.https.HttpsError, A>(
            () => L.debug("Start checking authorization.")),
        RTE.chain(()=> RTE.fromNullable(
            new functions.https.HttpsError("unauthenticated",
                "This function must be called by authorized user."
            ))(context.auth)),
    );
