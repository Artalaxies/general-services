import * as database from "./database";
import {DataSnapshot} from "../../entities/dataSnapshot";
import {Profile} from "../../entities/profile";


/**
 * Adds two numbers together.
 * @param {string} id The first number.
 * @return {DataSnapshot} The sum of the two numbers.
 */
export async function getProfile(id: string): Promise<DataSnapshot<Profile>> {
  const doc = await database.admin.firestore().collection("users")
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
    return new DataSnapshot(
        () => pro
    );
  } else {
    // eslint-disable-next-line no-throw-literal
    throw ("user not exists.");
  }
}

/**
 * Adds two numbers together.
 * @param {Profile} profile The first number.
 * @return {Promise} The sum of the two numbers.
 */
export async function setProfile(profile: Profile): Promise<void> {
  if (profile.username !== undefined) {
    await database.admin.firestore().collection("users")
        .doc(profile.id).set({username: profile.username})
        .catch((reason: any) => {
          throw (reason);
        });
  }
  if (profile.email !== undefined) {
    await database.admin.firestore().collection("users")
        .doc(profile.id).set({email: profile.email}).catch((reason: any) => {
          throw (reason);
        });
  }
}

/**
 * Adds two numbers together.
 * @param {string} id The first number.
 * @return {Promise} The sum of the two numbers.
 */
export async function getName(id: string): Promise<DataSnapshot<string>> {
  const doc = await database.admin.firestore().collection("users")
      .doc(id)
      .get();
  if (doc.exists) {
    return new DataSnapshot( ()=> doc.data()?.username );
  } else {
    // eslint-disable-next-line no-throw-literal
    throw ("user not exists.");
  }
}

/**
 * Adds two numbers together.
 * @param {string} address The first number.
 * @return {string} The sum of the two numbers.
 */
export async function getCustomToken(address: string):
Promise<DataSnapshot<string>> {
  const token = await database.admin.auth().createCustomToken(address);
  if (!token) {
    console.log("Genreate token failed");
    return new DataSnapshot(undefined, false, 2001);
  }
  return new DataSnapshot(() => token, true, 2000);
}