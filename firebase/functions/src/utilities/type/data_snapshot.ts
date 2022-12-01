/* eslint-disable require-jsdoc */
import {Kind, URIS} from "fp-ts/HKT";
import {IOOption} from "fp-ts/IOOption";
import * as IOO from "fp-ts/IOOption";
import * as O from "fp-ts/Option";
import {Option} from "fp-ts/Option";
import * as I from "fp-ts/IO";
import {MonadIO1} from "fp-ts/lib/MonadIO";

export class DataSnapshot<T> {
/**
     * Retrieves all fields in the document as an Object. Returns 'undefined' if
     * the document doesn't exist.
     */
  readonly getOption: IOOption<T>;


  /**
   * Danger operation !!!
   * Make sure that is certian value in the class when you use it.
  */
  readonly get: <M extends URIS>(monad: MonadIO1<M>) =>
   Kind<M, O.Option<T>>;

  /**
     * state ID.
     */
  readonly stateId: number;

  /**
     * success checking.
     * @return {boolean} nonce numbers.
     */
  isSuccess(): boolean {
    return this.stateId % 10 == 0;
  }

  /**
   * success checking.
   * @return {boolean} nonce numbers.
   */
  isWarning(): boolean {
    return this.stateId % 1000 >= 500 && this.isSuccess();
  }

  /**
     * message about the data.
     */
  readonly message?: string;

  constructor(stateId: number, _data?: T, message?: string) {
    this.stateId = stateId;
    this.message = message;
    this.get = <M extends URIS>(monad: MonadIO1<M>) =>
      monad.fromIO(() =>
        O.map<NonNullable<T>, T>((a) => a)(O.fromNullable(_data)));
    this.getOption = I.map<Option<Option<T>>, Option<T>>(
        (op) => O.flatten(op) )(this.get(IOO.MonadIO));
  }
}
