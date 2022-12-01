import {DataSnapshot} from "./data_snapshot";


/**
 * Account Not Exist Error.
 */
export class AccountNotExistErrorDataSnashot<T> extends DataSnapshot<T> {
/**
 * Constructor.
 */
  constructor() {
    super(2004, undefined, "Account Not Exist.");
  }
}

/**
 * Unknown Account Error.
 */
export class UnknownAccountErrorDataSnashot<T> extends DataSnapshot<T> {
/**
 * Constructor.
 * @param {string} error The account name that is not defined.
 */
  constructor(error?: string) {
    super(2001, undefined, error);
  }
}
