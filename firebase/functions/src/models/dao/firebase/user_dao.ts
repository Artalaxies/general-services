import {admin} from "./setting";
import {DataSnapshot} from "../../snapshot/data_snapshot";
import {Profile} from "../../entities/profile";
import {getLatestNonce} from "./web3_dao";
import {isValidatedMessage} from "../../../utilities/nonce";
import {validateAddress} from "../../../utilities/address";
import {InvalidWalletAddressErrorDataSnapshot} from "../../snapshot/address";

/**
 * Adds two numbers together.
 * @param {string} id The first number.
 * @return {Promise<DataSnapshot<Profile>>} The sum of the two numbers.
 */
export async function getProfile(id: string): Promise<DataSnapshot<Profile>> {
  const doc = await admin.firestore().collection("users")
      .doc(id)
      .get();
  if (doc.exists) {
    const data = doc.data();
    const pro: Profile = {
      id: id,
      username: data?.username,
      email: data?.email,
      latest_event: data?.latest_event,
    };
    return new DataSnapshot(true, 2000, () => pro);
  } else {
    return new DataSnapshot(false, 2004, undefined);
  }
}


/**
 * set profile.
 * @param {Profile} profile The first number.
 * @return {Promise<void>} The sum of the two numbers.
 */
export async function setProfile(profile: Profile): Promise<void> {
  if (profile.username !== undefined) {
    await admin.firestore().collection("users")
        .doc(profile.id)
        .set({username: profile.username})
        .catch((reason: unknown) => {
          throw (reason);
        });
  }
  if (profile.email !== undefined) {
    await admin.firestore().collection("users")
        .doc(profile.id)
        .set({email: profile.email})
        .catch((reason: unknown) => {
          throw (reason);
        });
  }
}

/**
 * get name.
 * @param {string} id The first number.
 * @return {Promise<DataSnapshot<string>>} The sum of the two numbers.
 */
export async function getName(id: string): Promise<DataSnapshot<string>> {
  const doc = await admin.firestore().collection("users")
      .doc(id)
      .get();
  if (doc.exists) {
    return new DataSnapshot(true, 2000, ()=> doc.data()?.username);
  } else {
    return new DataSnapshot(false, 2004, undefined);
  }
}


/**
 * get name.
 * @param {string} address The first number.
 * @param {string} signature The first number.
 * @param {string} username The first number.
 * @param {string} email The first number.
 * @return {Promise<DataSnapshot<string>>} The sum of the two numbers.
 */
export async function registerAccount(
    address: string,
    signature: string,
    username?: string,
    email?: string): Promise<DataSnapshot<string>> {
  if (!validateAddress(address)) {
    return new InvalidWalletAddressErrorDataSnapshot<string>();
  }
  const nonce = await getLatestNonce(address);
  if (!nonce.isSuccess() ) {
    return nonce;
  }
  if (isValidatedMessage(address, nonce.data?.() || "", signature)) {
    return await admin.auth().createUser({
      displayName: username || "",
      email: email || "",
    }).then((userRecord)=> {
      return new DataSnapshot( true, 2000, ()=> userRecord.uid);
    }).catch((err)=> {
      return new DataSnapshot(false, 2007, undefined, err);
    });
  } else {
    return new DataSnapshot(false, 2005,
        undefined, "Signature incorrect Error");
  }
}


/**
 * getCustomToken.
 * @param {string} address The first number.
 * @return {string} The sum of the two numbers.
 */
export async function getCustomToken(address: string):
 Promise<DataSnapshot<string>> {
  if (!validateAddress(address)) {
    return new InvalidWalletAddressErrorDataSnapshot<string>();
  }
  const token = await admin.auth().createCustomToken(address);
  if (!token) {
    console.log("Genreate token failed");
    return new DataSnapshot(false, 2001, undefined);
  }
  return new DataSnapshot(true, 2000, () => token);
}
