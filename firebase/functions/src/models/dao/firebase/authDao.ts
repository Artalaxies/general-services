import { DataSnapshot } from "../../entities/dataSnapshot";
import * as database from "./database";
import {generatedNonce} from "../../../utilities/nonce";


export async function getLatestNonce (address: string): Promise<DataSnapshot<string>> {
	let doc = await database.admin.firestore().collection('wallets')
		.doc(address)
		.get()
	if (doc.exists) {
		return new DataSnapshot(() => doc.data()?.latest_nonce);
	} else {

        return new DataSnapshot();
    }
}




export async function setLatestNonce(address: string) {
	let newNonce = generatedNonce().toString()
	database.admin.firestore().collection('wallets')
	.doc(address)
	.set({latest_nonce: newNonce})
}