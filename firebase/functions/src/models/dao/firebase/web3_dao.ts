import {DataSnapshot} from "../../../utilities/snapshot/data_snapshot";
import {admin} from "./setting";
import {
  validateAddress} from "../../../utilities/address";
import {InvalidWalletAddressErrorDataSnapshot}
  from "../../../utilities/snapshot/address";
import {AccountNotExistErrorDataSnashot,
  UnknownAccountErrorDataSnashot} from "../../../utilities/snapshot/user";

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
  const doc = await admin.firestore().collection("web3_addresses")
      .doc(address)
      .get();
  if (doc.exists) {
    return new DataSnapshot<string>(true, 2010, () => doc.data()?.latest_nonce);
  } else {
    return new AccountNotExistErrorDataSnashot<string>();
  }
}

/**
 * Adds two numbers together.
 * @param {string} address The first number.
 * @param {string} nonce The first number.
 * @return {DataSnapshot} The sum of the two numbers.
 */
export async function setLatestNonce(address: string, nonce: string):
Promise<DataSnapshot<string>> {
  if (!validateAddress(address)) {
    return new InvalidWalletAddressErrorDataSnapshot<string>();
  }

  return await admin.firestore().collection("web3_addresses")
      .doc(address).create({latest_nonce: nonce}).then((writeResult) =>{
        return new DataSnapshot<string>(true, 2000, () => nonce);
      }).catch(async (err)=>{
        return await admin.firestore().collection("web3_addresses")
            .doc(address)
            .update({latest_nonce: nonce}).then((writeResult) => {
              return new DataSnapshot<string>(true, 2000, () => nonce);
            }).catch((err) => {
              return new UnknownAccountErrorDataSnashot<string>();
            });
      });
}
