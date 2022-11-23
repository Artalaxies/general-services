import {admin} from "./config";
import {DataSnapshot} from "../../../utilities/snapshot/data_snapshot";
import {validateAddress} from "../../../utilities/address";
import {InvalidWalletAddressErrorDataSnapshot}
  from "../../../utilities/snapshot/address";


/**
 * getCustomToken.
 * @param {string} address input a web3 wallet address.
 * @return {string} return a custom token.
 */
export async function getCustomToken(address: string):
 Promise<DataSnapshot<string>> {
  if (!validateAddress(address)) {
    return new InvalidWalletAddressErrorDataSnapshot<string>();
  }
  return admin.auth().createCustomToken(address).then((token) =>{
    return new DataSnapshot(true, 2000, () => token);
  },
  (error) =>{
    console.log("Genreate token failed");
    return new DataSnapshot(false, 2001, undefined, error);
  });
}


/**
 * verifySessionCookie.
 * @param {string} sessionCookie input a id token.
 * @return {Promise<DataSnapshot<boolean>>} return a custom token.
 */
export async function verifySessionCookie(sessionCookie:string):
 Promise<DataSnapshot<boolean>> {
  return admin.auth().verifySessionCookie(sessionCookie, true)
      .then((decodedClaims) =>{
        return new DataSnapshot(true, 4000, () => true);
      },
      (error) =>{
        return new DataSnapshot(false, 4001, () => false, error);
      });
}
