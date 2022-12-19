import {DataSnapshot} from "../../../models/data_snapshot/data_snapshot";
import {admin} from "../../../configs/firebase";
import {
  isValidateAddress} from "../../../utilities/address";
import {InvalidWalletAddressErrorDataSnapshot}
  from "../../../models/data_snapshot/address";
import {AccountNotExistErrorDataSnashot,
  UnknownAccountErrorDataSnashot} from "../../../models/data_snapshot/user";
import {pipe} from "fp-ts/function";
import * as B from "fp-ts/boolean";
import * as TE from "fp-ts/TaskEither";
import * as RT from "fp-ts/ReaderTask";
import * as RTE from "fp-ts/ReaderTaskEither";
import {ReaderTask} from "fp-ts/ReaderTask";
import {LoggerEnv} from "logger-fp-ts";
import * as L from "logger-fp-ts";
import * as RT2 from "../../../typed/ReaderTask";
import * as RTE2 from "../../../typed/ReaderTaskEither";
import * as O from "fp-ts/Option";

/**
 * Adds two numbers together.
 * @param {string} address The first number.
 * @return {ReaderTask<LoggerEnv, DataSnapshot<string>>}
 * The sum of the two numbers.
 */
export const getLatestNonce =
  (address: string): ReaderTask<LoggerEnv, DataSnapshot<string>> =>{
    address = address.toLocaleLowerCase();
    return pipe(
        RT.ask<LoggerEnv>(),
        RT2.log(() => L.debug("Beginning execution of \"getLatestNonce\"")),
        RT.map(() => isValidateAddress(address)),
        RT2.log((b) => L.debug("Address Validated: " + b)),
        RT.chain(
            B.match( () => RT.of(
                new InvalidWalletAddressErrorDataSnapshot<string>()),
            () => pipe(
                RTE.ask<LoggerEnv, Error>(),
                RTE2.log(() =>
                  L.debug("Fetch nonce number from Firestore")),
                RTE.chain(
                    () => RTE.fromTaskEither(
                        TE.tryCatch(() => admin.firestore()
                            .collection("web3_addresses")
                            .doc(address).get()
                            .then((res) =>
                              O.fromNullable<string>(
                                  res.data()?.latest_nonce)),
                        (message) => <Error>message))),
                RTE.matchE( (error) => pipe( RT.of(
                    new UnknownAccountErrorDataSnashot
                                      <string>(error.message)),
                RT2.log(() => L.errorP("Unknown Error")(
                    {error: error.message}))),
                O.match(() => pipe(RT.of(
                    new AccountNotExistErrorDataSnashot<string>()),
                RT2.log(() => L.info("Account Dose Not Exist"))),
                (latestNonce)=> pipe(
                    RT.of(new DataSnapshot<string>(2010, latestNonce)),
                    RT2.log(() => L.debugP("Fetched Data")(
                        {nonce: latestNonce}))),
                )
                ),
            )),
        ),
        RT2.log((b) => L.debugP("state id")({stateId: b.stateId})),
    );
  };

/**
 * Adds two numbers together.
 * @param {string} address The first number.
 * @param {string} nonce The first number.
 * @return {ReaderTask<LoggerEnv, DataSnapshot<string>>}
 *  The sum of the two numbers.
 */
export const setLatestNonce =
  (address: string, nonce: string):
  ReaderTask<LoggerEnv, DataSnapshot<string>>=> {
    address = address.toLocaleLowerCase();
    return pipe(
        RT.ask<LoggerEnv>(),
        RT2.log((_) => L.debug("Beginning execution of  \"setLatestNonce\"")),
        RT.map((l) => isValidateAddress(address)),
        RT2.log((b) => L.debug("Address Validated: " + b)),
        RT.chain(
            B.match(
                () =>
                  RT.of(new InvalidWalletAddressErrorDataSnapshot<string>()),
                () => pipe(
                    RTE.ask<LoggerEnv>(),
                    RTE2.log(() => L.debugP("Updating Nonce")({
                      new_nonce: nonce})),
                    RTE.chain(() =>
                      RTE.fromTaskEither(TE.tryCatch(
                          () => admin.firestore()
                              .collection("web3_addresses")
                              .doc(address)
                              .create({latest_nonce: nonce})
                              .then((_) => nonce),
                          (message) => <Error>message),
                      ),
                    ),
                    RTE.map((nonce) => new DataSnapshot<string>(2000, nonce)),
                    RTE.orElse(
                        (error) => pipe(
                            RTE.ask<LoggerEnv>(),
                            RTE2.log(() =>
                              L.debugP("Unable to create a key: latest_nonce")({
                                message: error.message})),
                            RTE.chain(() => RTE.fromTaskEither(TE.tryCatch(
                                () => admin.firestore()
                                    .collection("web3_addresses")
                                    .doc(address)
                                    .update({latest_nonce: nonce})
                                    .then((_) =>
                                      new DataSnapshot<string>(2000, nonce)),
                                (message) => <Error>message,
                            ))),
                        )
                    ),
                    RTE.getOrElse((error) => pipe(
                        RT.ask<LoggerEnv>(),
                        RT2.log(() =>
                          L.errorP("Unknown Error")({
                            error: error.message,
                            stack: error.stack || ""})),
                        RT.map(
                            () => new UnknownAccountErrorDataSnashot<string>())
                    )),
                    RT2.log((b) =>
                      L.debugP("state id")({stateId: b.stateId})),

                )
            )
        )
    );
  };

