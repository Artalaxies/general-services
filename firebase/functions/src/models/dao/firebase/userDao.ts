import * as database from "./database";
import { DataSnapshot } from "../../entities/dataSnapshot";
import { Profile } from "../../entities/profile";




export async function getProfile(id: string): Promise<DataSnapshot<Profile>> {
	let doc = await database.admin.firestore().collection('users')
		.doc(id)
		.get()
	if (doc.exists) {
		let data = doc.data();
		let pro: Profile = {
			id: id,
			username: data?.username,
			email: data?.email,
			latest_event: data?.latest_event
		};
		return new DataSnapshot(
			() => pro
		);
	} else {
		throw ("user not exists.");
	}
}

export async function setProfile(profile: Profile): Promise<void> {

	if(profile.username !== undefined){
		await database.admin.firestore().collection('users')
		.doc(profile.id).set({username: profile.username}).catch((reason: any) => {
			throw (reason);
		});
	}
	if(profile.email !== undefined){
		await database.admin.firestore().collection('users')
		.doc(profile.id).set({email: profile.email}).catch((reason: any) => {
			throw (reason);
		});
	}	
}

export async function getName(id: string): Promise<DataSnapshot<string>> {
	let doc = await database.admin.firestore().collection('users')
		.doc(id)
		.get()
	if (doc.exists) {
		return new DataSnapshot( ()=> doc.data()?.username );
	} else {
		throw ("user not exists.");
	}
}
