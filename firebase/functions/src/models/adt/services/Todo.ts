// import {Timestamp} from "firebase-admin/firestore";


export type Task = {
    content: string;
    finished: boolean;
    achieved: boolean;
    created_time: string | undefined;
    updated_time: string | undefined;
  };

export type TaskList = Task[];
