---
tags: [Database Design]
date: "2022-02-16 01:07"
---
# Database Design
Date:  2022-02-16 01:07



## 1.Database Introduction



## 2.Data Schemas
### 2.1. users
	user basic information
| parameter    | type               | example       |
| ------------ | ------------------ | ------------- |
| ID           | unique number      | 1             |
| username     | text               | "Cullen"      |
| email        | text               | "a@gmail.com" |
| latest_event | ID FROM event_logs | 100           |
|              |                    |               |


### 2.2. event_logs
	the records of the user avtivity
| parameter   | type                  | example                                     |
| ----------- | --------------------- | ------------------------------------------- |
| ID          | unique number         | 1                                           |
| event       | text                  | "login","update"                            |
| address     | address               | 0xdsadsadsa511                              |
| nonce       | text                  | "945120"                                    |
| device_info | device_info structure | {"type":"mobile","ip_address": "127.0.0.1"} |
| timestamp   | date                  | 100000000000                                |
| last_event  | number                | 1 or empty == 0                             |
|             |                       |                                             |




## 3. Data Structure

### 3.1 device_info
	data type: json

| parameter     | type | example             |
| ------------- | ---- | ------------------- |
| type          | text | "mobile"            |
| ip_address    | text | "127.0.0.1"         |
| device_detail | text | "Android 8.0.7"     |
| mac_address   | text | "00-00-00-00-00-00" |
| geo           | text |                     |
|               |      |                     |

