import {admin} from "./config";
import {DataSnapshot} from "../../utilities/type/data_snapshot";
import {Profile} from "../../models/profile";
import {getLatestNonce} from "./web3_dao";
import {isValidatedMessage} from "../../utilities/nonce";
import {isValidateAddress} from "../../utilities/address";
import {InvalidWalletAddressErrorDataSnapshot}
  from "../../utilities/type/address";
import {pipe} from "fp-ts/function";
import * as B from "fp-ts/boolean";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import * as RT from "fp-ts/lib/ReaderTask";
import * as R from "fp-ts/lib/Reader";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import {ReaderTask} from "fp-ts/lib/ReaderTask";
import {LoggerEnv} from "logger-fp-ts";
import * as L from "logger-fp-ts";
import {loggingRTE} from "../../utilities/logger";

/**
 * @todo refactor to fp
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
    return new DataSnapshot(2000, pro);
  } else {
    return new DataSnapshot<Profile>(2004, undefined);
  }
}


/**
 * @todo refactor to fp
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
 * @return {ReaderTask<LoggerEnv, DataSnapshot<string>>}
 *  The sum of the two numbers.
 */
export const getName = (id: string):
ReaderTask<LoggerEnv, DataSnapshot<string>> => pipe(
    RTE.ask<LoggerEnv>(),
    loggingRTE(() => L.debug("executed function getName.")),
    R.map((_) =>
      TE.tryCatch(
          () => admin.firestore().collection("users")
              .doc(id)
              .get(),
          (message) => new Error(<string>message)),
    ),
    RTE.map((doc) => O.fromNullable(doc.data()?.username)),
    RTE.map(
        O.match(
            () => new DataSnapshot<string>(2004, undefined),
            (username) => new DataSnapshot<string>(2000, username)
        )
    ),
    RTE.getOrElse(
        (error) => RT.of(new DataSnapshot<string>(2004, undefined)))
);


/**
 * get name.
 * @param {string} address The first number.
 * @param {string} signature The first number.
 * @param {string} username The first number.
 * @param {string} email The first number.
 * @return {ReaderTask<LoggerEnv, DataSnapshot<string>>}
 * The sum of the two numbers.
 */
export const registerAccount = (
    address: string,
    signature: string,
    username?: string,
    email?: string) => pipe(
    RTE.ask<LoggerEnv, Error>(),
    loggingRTE(() =>
      L.debug("executed function registerAccount.")),
    RTE.map((_)=> isValidateAddress(address)),
    RTE.getOrElse((error)=> RT.of(false)),
    RT.chain(B.match(
        () => pipe(
            RT.ask<LoggerEnv>(),
            RT.map((_) => new InvalidWalletAddressErrorDataSnapshot<string>())
        ),
        () => pipe(
            RT.ask<LoggerEnv>(),
            RT.chain((_) => getLatestNonce(address)),
            RT.map((res) => res.getOption()),
            RT.chain(O.match(
                () => pipe(
                    RT.ask<LoggerEnv>(),
                    RT.map((_) => new DataSnapshot<string>(2001,
                        undefined,
                        "Unable to get latest nonce for address"))
                ),
                (nonce) => pipe(
                    RT.ask<LoggerEnv>(),
                    RT.map((_) =>
                      isValidatedMessage(
                          address,
                          nonce,
                          signature)),
                    RT.chain(B.match(
                        () =>
                          RT.of( new DataSnapshot<string>(2001,
                              undefined,
                              "Signature incorrect Error")),
                        () => pipe(
                            TE.tryCatch(
                                () => admin.auth().createUser({
                                  displayName: username || "",
                                  email: email || "",
                                }).then((userRecord)=>
                                  new DataSnapshot(2000, userRecord.uid)
                                ),
                                (message) => <Error>message
                            ),
                            RTE.fromTaskEither,
                            RTE.getOrElse((error)=>
                              RT.of( new DataSnapshot<string>(2001,
                                  undefined,
                                  error.message)))
                        ),
                    )),
                ))
            ),
        ),

    ))
);


