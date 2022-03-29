import * as metaUtil from "@metamask/eth-sig-util";


/**
 * Generated nonce.
 * @return {number} nonce numbers.
 */
export function generatedNonce():number {
  return Math.floor(Math.random() * 1000000);
}


/**
 * Verify signed message.
 * @param {string} address The first number.
 * @param {string} message The first number.
 * @param {string} sigature The first number.
 * @return {boolean} nonce numbers.
 */
export function isValidatedMessage(
    address:string,
    message: string,
    sigature: string): boolean {
  const recoveredAddress = metaUtil.recoverPersonalSignature({
    data: `0x${stringToHex(message)}`,
    signature: sigature,
  });

  return recoveredAddress.toLocaleLowerCase() === address.toLocaleLowerCase();
}

/**
 * String to Heximal.
 * @param {string} stringToConvert The first number.
 * @return {boolean} nonce numbers.
 */function stringToHex(stringToConvert:string):string {
  return stringToConvert
      .split("")
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
}
