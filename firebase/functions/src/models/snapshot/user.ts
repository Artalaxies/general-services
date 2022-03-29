import {DataSnapshot} from "./data_snapshot";


/**
 * Account Not Exist Error.
 */
export class AccountNotExistErrorDataSnashot<T> extends DataSnapshot<T> {
/**
 * Constructor.
 */
  constructor() {
    super(false, 2004, undefined, "Account Not Exist.");
  }
}

/**
 * Unknown Account Error.
 */
export class UnknownAccountErrorDataSnashot<T> extends DataSnapshot<T> {
/**
 * Constructor.
 */
  constructor() {
    super(false, 2001, undefined, "Unknown Account Error.");
  }
}
