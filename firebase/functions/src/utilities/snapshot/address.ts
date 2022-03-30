import {DataSnapshot} from "./data_snapshot";


/**
 * Invalid address error.
 */
export class InvalidAddressErrorDataSnapshot<T> extends DataSnapshot<T> {
  /**
     * Constructor.
     */
  constructor() {
    super(false,
        8001, undefined,
        "Not a Validated Address.");
  }
}

/**
     * Invalid wallet address error.
     */
export class InvalidWalletAddressErrorDataSnapshot<T> extends DataSnapshot<T> {
  /**
     * Constructor.
     */
  constructor() {
    super(false,
        8002, undefined,
        "Not a Validated Wallet Address.");
  }
}


