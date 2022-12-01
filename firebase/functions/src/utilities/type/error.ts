import * as TE from "fp-ts/TaskEither";
import * as RTE from "fp-ts/ReaderTaskEither";
import {ReaderTaskEither} from "fp-ts/ReaderTaskEither";


export const errorHandler = <E>(error: unknown) => <E>error;

export const chainReaderTaskEitherTryCatch =
<P, R, E, A>(p: (a: A) => Promise<P>) =>
    (rte: ReaderTaskEither<R, E, A>) =>
      RTE.chain<R, E, A, P>((a: A) => RTE.fromTaskEither<E, P, R>(
          TE.tryCatch<E, P>(() => p(a), errorHandler)
      )
      )(rte);
