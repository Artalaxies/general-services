import * as L from "logger-fp-ts";
import {SystemClock} from "clock-ts";
import {pipe} from "fp-ts/function";
import * as C from "fp-ts/Console";
import {ReaderIO} from "fp-ts/lib/ReaderIO";
import {LoggerEnv} from "logger-fp-ts";
import * as RIO from "fp-ts/ReaderIO";
import * as RT from "fp-ts/ReaderTask";
// import {IO} from "fp-ts/IO";
import * as RTE from "fp-ts/ReaderTaskEither";
import {ReaderTaskEither} from "fp-ts/ReaderTaskEither";


export const developmentEnv: L.LoggerEnv = {
  clock: SystemClock,
  logger: pipe(
      C.log,
      L.withShow(L.getColoredShow(L.ShowLogEntry))),
};

export const productionEnv: L.LoggerEnv = {
  clock: SystemClock,
  logger: pipe(C.error, L.withShow(L.ShowLogEntry)),
};


export const loggingRT =
  <R, A>(rio:(a: A) => ReaderIO<R, void>) =>
    (rt: RT.ReaderTask<R, A>):
    RT.ReaderTask<R, A> =>
      RT.chainFirst<A, R, any>(
          (a) => pipe(
              RIO.ask<R>(),
              RIO.chainFirst(() => rio(a)),
              RT.fromReaderIO,
          ))(rt);


export const loggingRTE =
 <E, A>(rio: (a: A) => ReaderIO<LoggerEnv, void>) =>
    (rte: ReaderTaskEither<any, E, A>) => pipe(
        RTE.ask<LoggerEnv>(),
        RTE.chain(() => rte),
        RTE.chainFirst((a) =>
          RTE.fromReaderIOK<A[], any, any>((a) => pipe(
              RIO.ask<LoggerEnv>(),
              RIO.chainFirst(() => rio(a)),
          ))(a)),
    );


export const loggingRTEonError =
<A, E>(rio: (e: E) => ReaderIO<LoggerEnv, void>) =>
    (rte: ReaderTaskEither<any, E, A>) => pipe(
        RTE.ask<LoggerEnv>(),
        RTE.chain(() => rte),
        (rte) => RTE.orElse<any, E, A, E>((e) =>
          RTE.chainFirst<any, E, A, any>((a) =>
            RTE.fromReaderIOK<A[], any, any>((a) => pipe(
                RIO.ask<LoggerEnv>(),
                RIO.chainFirst(() => rio(e)),
            ))(a))(rte))(rte),
    );
