import * as TE from "fp-ts/TaskEither";
import * as RTE from "fp-ts/ReaderTaskEither";
import {ReaderTaskEither} from "fp-ts/ReaderTaskEither";
import {flow, pipe} from "fp-ts/lib/function";
import {ReaderIO} from "fp-ts/lib/ReaderIO";
import {LoggerEnv} from "logger-fp-ts";


export const tryCatch =
<P, R, E, A>(p: (a: A) => Promise<P>, onRejected: (error: unknown) => E ) =>
    flow(
        RTE.chain<R, E, A, P>((a: A) => RTE.fromTaskEither<E, P, R>(
            TE.tryCatch<E, P>(() => p(a), onRejected)
        )));


export const log =
<R extends LoggerEnv, E, A>(rio: (a: A) => ReaderIO<LoggerEnv, void>) =>
    RTE.chainFirst<R, E, A, void>((a) => (r2: R) => TE.fromIO(rio(a)(r2)));

export const logOnError =
<R, E, A>(rio: (e: E) => ReaderIO<LoggerEnv, void>) =>
    (rte: ReaderTaskEither<R, E, A>) => pipe(
        RTE.ask<R>(),
        RTE.chain(() => rte),
        flow(RTE.orElse<any, E, A, E>((e) =>
          RTE.chainFirst<any, E, A, any>((a) =>
            RTE.fromReaderIOK<A[], any, any>(() =>rio(e))(a))(rte))),
    );


export const read =
<R, E, A>(f: (r: R) => ReaderTaskEither<R, E, A>) =>
    RTE.chain(() => ((r: R) => f(r)(r)));
