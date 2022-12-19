import {Client} from "@notionhq/client";


const NOTION_TOKEN: string = process.env.NOTION_TOKEN || "";
const USER_DATABASE_ID: string = process.env.USER_DATABASE_ID || "";
const SERVICE_CACHE_ID: string = process.env.SERVICE_CACHE_ID || "";
const SERVICE_DATABASE_ID: string =
    process.env.SERVICE_DATABASE_ID || "";
const BLOG_DATABASE_ID: string = process.env.BLOG_DATABASE_ID || "";

export const notion = new Client({
  auth: NOTION_TOKEN,
});


// eslint-disable-next-line require-jsdoc
export interface NotionEnv {
  readonly NOTION_TOKEN: string;
  readonly USER_DATABASE_ID: string;
  readonly SERVICE_CACHE_ID: string;
  readonly SERVICE_DATABASE_ID: string;
  readonly BLOG_DATABASE_ID: string;
  readonly notion: Client;

}


export const developmentNotionEnv: NotionEnv = ({
  NOTION_TOKEN,
  USER_DATABASE_ID,
  SERVICE_CACHE_ID,
  SERVICE_DATABASE_ID,
  BLOG_DATABASE_ID,
  notion,
});
