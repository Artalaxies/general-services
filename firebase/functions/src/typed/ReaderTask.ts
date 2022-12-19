import {ReaderIO} from "fp-ts/lib/ReaderIO";
import {pipe} from "fp-ts/function";
import * as RIO from "fp-ts/ReaderIO";
import * as RT from "fp-ts/ReaderTask";


export const log =
<R, A>(rio:(a: A) => ReaderIO<R, void>) =>
    (rt: RT.ReaderTask<R, A>):
  RT.ReaderTask<R, A> =>
      RT.chainFirst<A, R, any>(
          (a) => pipe(
              RIO.ask<R>(),
              RIO.chainFirst(() => rio(a)),
              RT.fromReaderIO,
          ))(rt);
