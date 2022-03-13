---
tags: [template]
date: "2022-02-17 21:36"
---
# Functional Design
Date:  2022-02-17 21:36


## 1. Functional Design
```mermaid
flowchart LR

A(Universal Backend)
A --> B(User)
B --> C("getProfile()")
B --> K("setProfile()")
B --> D("getName()")

A --> F(Security)
F --> G("report()")
A --> L(Authorization)
L -->I("getNonce()")
L --> J("verifySignedMessage(address,signature)")

```

## 1.1 API Status




## 2. API
### 2.1. Authorization
	API for who connected wallet to store extra info to the server.
	Authorization for any user activity required server 

```mermaid
sequenceDiagram
	Client ->> Server: getNonce(): void
	Server -->> Client: Nonce: String
	Client ->> Server: verifySignedMessage(data encrypted by wallect)
	Server ->> Database: decrypt and match data from database
	Database -->> Server: store verified token and send back
	Server -->> Client: Authentication Response (Verified Token)
```


#### 2.1.1 getNonce
	Fetch verify data for wallet sign with the key.
* Request URI
	*  `{apiAddress}/getNonce`
*  Request Method
	* GET
* Request Parameter
	* None
*  Respond
```json
	{
		nonce: number
	}
```
#### 2.1.2 verifySignedMessage
	Submit signed message to firebase.
* Request URI
	*  `{apiAddress}/verifySignedMessage`
* Request Method
	*  POST
*  Request Parameter

| name      | required | type   | instruction         |
| --------- | -------- | ------ | ------------------- |
| address   | Yes      | String | Account address     |
| signature | Yes      | String | Signed from  wallet |

```json
	{
		address: "account address",
		signature: 
	}
```
*  Respond
```json
	{
		token: 'firebase auth token'
	}
```

### 2.2. Profile
#### 2.2.1 setProfile
	Set up user profile
* Request Function
```dart
	 
	 FirebaseDatabase.instance.ref("users/"+ address).set({"name": name,
"email": email})
	 
```
* Request Method
	*  Firebase SDK
*  Respond

#### 2.2.2 getProfile
	Fetch user profile
* Request Function (sample)
```dart

	 FirebaseDatabase.instance.ref("users/"+ address).once()
	
```
* Request Method
	* Firebase SDK
*  Respond
```json
	{
		"name": "John",
		"email": "111@gmail",
	}
```







---