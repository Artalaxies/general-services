import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { getProvider } from './provider';
import {
	getAuth,
	signInWithCustomToken,
	connectAuthEmulator,
} from 'firebase/auth';
import { jsonEval } from '@firebase/util';
import axios from 'axios';

import './App.css';

// const { ethers } = require('ethers');

const firebaseConfig = {
	apiKey: 'AIzaSyDCDvN3g953Hx9TIOXkM7LV2y5YDFvq3UI',
	authDomain: 'art-planet.firebaseapp.com',
	databaseURL: 'https://art-planet-default-rtdb.firebaseio.com',
	projectId: 'art-planet',
	storageBucket: 'art-planet.appspot.com',
	messagingSenderId: '815771921245',
	appId: '1:815771921245:web:a6a81c4082e03647d416b4',
	measurementId: 'G-QZ3EF08TCS',
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();
const functions = getFunctions();

connectAuthEmulator(auth, 'http://localhost:9099');
connectFunctionsEmulator(functions, 'localhost',5001);



function App() {
	const [buttonText, setButtonText] = useState('connect to wallet');

	async function getNounceToSign(address) {
		const respond = await axios.get(
			// 'https://us-central1-art-planet.cloudfunctions.net/getNonce',
			'http://localhost:5001/art-planet/us-central1/web3auth-getNonce?address=' + address, // for local development
		);
		console.log('respond is: ', respond);
		return respond.data.nonce;
	}

	async function verifySignedMessage(address, signature) {
		const respond = await axios.post(
			// 'https://us-central1-art-planet.cloudfunctions.net/verifySignedMessage',
			'http://localhost:5001/art-planet/us-central1/web3auth-verifySignedMessage',  // for local development
			{
				address: address,
				signature: signature,
			}
		);
		console.log('respond is: ', respond);
		return respond.data.token;
	}

	async function connectWallet() {
		try {
			console.log('connecting to wallet');
			// window.eth
			const provider = getProvider();
			await provider.send('eth_requestAccounts', []);
			const signer = provider.getSigner();
			const address = await signer.getAddress();
			console.log('address is: ', address);
			setButtonText(address);
			const nonce = await getNounceToSign(address);
			const signature = await signer.signMessage(nonce);
			console.log('signature is: ', signature);
			const token = await verifySignedMessage(address, signature);
			console.log('token is: ', token);
			const userCredential = await signInWithCustomToken(auth, token); 
			console.log(userCredential.user);

		} catch (err) {
			console.log(err);
		}
	}

	async function finishedTask() {
		try {

			// httpsCallable(functions, 'todo-register')({});
			// httpsCallable(functions, 'todo-addTask')({
			// 	content: "yooo",
			// 	finished: false,
			// 	service_id: "b3e46ff9-78d1-4728-9cd8-fc179288aeb7"
			// });
			httpsCallable(functions, 'todo-finishedTask')({
				task_id: "d2cb9e5f-549d-4488-96e4-7509b15d14f2",
			});
			// httpsCallable(functions, 'todo-deleteTask')({
			// 	task_id: "d2cb9e5f-549d-4488-96e4-7509b15d14f2",
			// });
			// httpsCallable(functions, 'todo-getMyTasks')({
			// 	service_id: "b3e46ff9-78d1-4728-9cd8-fc179288aeb7",
			// });
			// httpsCallable(functions, 'blog-getRecentPost')({});
		} catch (err) {
			console.log(err);
		}
	}
	async function unfinishedTask() {
		try {

			// httpsCallable(functions, 'todo-register')({});
			// httpsCallable(functions, 'todo-addTask')({
			// 	content: "yooo",
			// 	finished: false,
			// 	service_id: "b3e46ff9-78d1-4728-9cd8-fc179288aeb7"
			// });
			httpsCallable(functions, 'todo-unfinishedTask')({
				task_id: "d2cb9e5f-549d-4488-96e4-7509b15d14f2",
			});
			// httpsCallable(functions, 'todo-deleteTask')({
			// 	task_id: "d2cb9e5f-549d-4488-96e4-7509b15d14f2",
			// });
			// httpsCallable(functions, 'todo-getMyTasks')({
			// 	service_id: "b3e46ff9-78d1-4728-9cd8-fc179288aeb7",
			// });
			// httpsCallable(functions, 'blog-getRecentPost')({});
		} catch (err) {
			console.log(err);
		}
	}

	// async function signSig() {
	// 	await provider.call('eth_requestAccounts');
	// 	const result = await signer.signMessage('181627');
	// 	console.log(await signer.getAddress());
	// 	console.log(result);
	// }

	// const provider = new ethers.providers.Web3Provider(window.ethereum);
	// const signer = provider.getSigner();
	// signer.signMessage('181627').then(result => console.log(result));

	return (
		<div>
			<div><button onClick={connectWallet}>{buttonText}</button></div>
			<div><button onClick={finishedTask}>finishedTask</button></div>
			<div><button onClick={unfinishedTask}>unfinishedTask</button></div>
		</div>
	);
}

export default App;
