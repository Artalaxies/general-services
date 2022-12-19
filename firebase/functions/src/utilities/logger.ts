import * as L from "logger-fp-ts";
import {SystemClock} from "clock-ts";
import * as C from "fp-ts/Console";
import {LoggerEnv} from "logger-fp-ts";
import {pipe} from "fp-ts/function";


export const developmentLoggerEnv: LoggerEnv = {
  clock: SystemClock,
  logger: pipe(
      C.log,
      L.withShow(L.getColoredShow(L.ShowLogEntry))),
};

export const productionEnv: LoggerEnv = {
  clock: SystemClock,
  logger: pipe(C.error, L.withShow(L.ShowLogEntry)),
};

