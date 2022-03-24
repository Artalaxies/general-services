import {DataSnapshot} from "../../entities/dataSnapshot";
import * as database from "./database";
import {generatedNonce} from "../../../utilities/nonce";


/**
 * Adds two numbers together.
 * @param {string} address The first number.
 * @return {DataSnapshot} The sum of the two numbers.
 */
export async function getLatestNonce(address: string):
Promise<DataSnapshot<string>> {
  const doc = await database.admin.firestore().collection("web3_addresses")
      .doc(address)
      .get();
  if (doc.exists) {
    return new DataSnapshot(() => doc.data()?.latest_nonce, true, 3000);
  } else {
    await setLatestNonce(address);
    return await getLatestNonce(address);
  }
}

/**
 * Adds two numbers together.
 * @param {string} address The first number.
 */
export async function setLatestNonce(address: string) {
  const newNonce = generatedNonce().toString();
  await database.admin.firestore().collection("web3_addresses")
      .doc(address)
      .update({latest_nonce: newNonce});
}
