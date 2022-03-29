import {DataSnapshot} from "../../entities/dataSnapshot";
import * as database from "./setting";
import {generatedNonce} from "../../../utilities/nonce";
import {InvalidWalletAddressErrorDataSnapshot,
  validateAddress} from "../../../utilities/address";


/**
 * Adds two numbers together.
 * @param {string} address The first number.
 * @return {DataSnapshot} The sum of the two numbers.
 */
export async function getLatestNonce(address: string):
Promise<DataSnapshot<string>> {
  if (!validateAddress(address)) {
    return new InvalidWalletAddressErrorDataSnapshot<string>();
  }
  const doc = await database.admin.firestore().collection("web3_addresses")
      .doc(address)
      .get();
  if (doc.exists) {
    return new DataSnapshot(true, 3000, () => doc.data()?.latest_nonce);
  } else {
    await setLatestNonce(address);
    return await getLatestNonce(address);
  }
}

/**
 * Adds two numbers together.
 * @param {string} address The first number.
 */
export async function setLatestNonce(address: string): Promise<void> {
  const newNonce = generatedNonce().toString();
  await database.admin.firestore().collection("web3_addresses")
      .doc(address)
      .update({latest_nonce: newNonce});
}
