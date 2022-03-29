import {DataSnapshot} from "../models/entities/dataSnapshot";


/**
 * Validate Wallet Address.
 * @param {string} address The first number.
 * @return {number} nonce numbers.
 */
export function validateAddress(address: string):boolean {
// TODO: implement the validation for wallet address.
  return true;
}


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

