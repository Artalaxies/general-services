import {Client} from "@notionhq/client";


export const NOTION_TOKEN: string = process.env.NOTION_TOKEN || "";
export const USER_DATABASE_ID: string = process.env.USER_DATABASE_ID || "";
export const TODOLIST_DATABASE_ID: string =
    process.env.TODOLIST_DATABASE_ID || "";
export const TODOLIST_USER_DATABASE_ID: string =
    process.env.TODOLIST_USER_DATABASE_ID || "";
export const notion = new Client({
  auth: NOTION_TOKEN,
});
