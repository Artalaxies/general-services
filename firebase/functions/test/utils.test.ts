import {Timestamp, WriteResult} from "firebase-admin/firestore";


export const responseTemplate = ({
  setHeader: (name : string, vaule: string) =>{
    console.log("Accessed response setHeader("+ name +","+ vaule +")");
    return responseTemplate;
  },
  sendStatus: (code: number) =>{
    console.log("Accessed response sendStatus(" + code + ")");
    return responseTemplate;
  },
  json: (json: string)=>{
    console.log("Accessed response json: "+ JSON.stringify(json));
    return responseTemplate;
  },
  send: (message: string) =>{
    console.log("Accessed response  send("+message+")");
    console.log("message: " + message);
    return responseTemplate;
  },
  status: (code: number) =>{
    console.log("Accessed response status("+code + ")");
    return responseTemplate;
  },
});

export const writeResult: WriteResult = ({
  writeTime: Timestamp.now(),
  isEqual: (other: any) => true,
});
