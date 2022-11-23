import {PageObjectResponse,
  RichTextItemResponse} from "@notionhq/client/build/src/api-endpoints";
import {DataSnapshot} from "../../../utilities/snapshot/data_snapshot";
import {notion} from "./config";
import {createUserTodoDatabase} from "./utils";


/**
 * getTodoListDatabaseIdbyUserId.
 * @param {string} rootDatabaseId user id.
 * @param {string} userId user id.
 * @return {string} The sum of the two numbers.
 */
export function getDatabaseIdbyUserId(
    rootDatabaseId: string,
    userId: string):
 Promise<DataSnapshot<string>> {
  return notion.databases.query({
    database_id: rootDatabaseId,
    filter: {
      property: "Name",
      rich_text: {
        equals: userId,
      },
    },
  }).then(async (res) => {
    const data = <PageObjectResponse>res.results[0];

    if (!data) {
      const databaseId = await createUserTodoDatabase(userId);
      return new DataSnapshot(true, 2000, ()=> databaseId);
    } else {
      type rich_text = {
        type: "rich_text";
        rich_text: Array<RichTextItemResponse>;
        id: string;
      };
      const pageId = (<rich_text>data.properties["database"])
          .rich_text[0].plain_text;
      if (pageId) {
        return new DataSnapshot(true, 2000, () => pageId);
      } else {
        return new DataSnapshot(false, 2001, undefined);
      }
    }
  });
}


/**
 * getTodoListDatabaseIdbyUserId.
 * @param {string} blockId user id.
 * @return {string} The sum of the two numbers.
 */
export function getDatabaseIdbyBlockId(blockId: string):
 Promise<DataSnapshot<string>> {
  return notion.blocks.children.list({
    block_id: blockId,
  }).then((res) =>{
    const pageId = res.results[0]?.id;
    if (pageId) {
      return new DataSnapshot(true, 2000, () => pageId);
    } else {
      return new DataSnapshot(false, 2001, undefined, "Database Not Found");
    }
  });
}


// /**
//  * Adds two numbers together.
//  * @param {string} _id user id.
//  * @return {string} The sum of the two numbers.
//  */
// export async function generateTodoList(_id: string):
//  Promise<DataSnapshot<string>> {
//   const pageResponse = await notion.pages.create({
//     auth: NOTION_TOKEN,
//     parent: {
//       database_id: TODOLIST_DATABASE_ID,
//     },
//     properties: {
//       "identity": {
//         title: [
//           {
//             text: {
//               content: _id,
//             },
//           },
//         ],
//       },
//     },
//   });
//   const response = await notion.databases.create({
//     parent: {
//       page_id: pageResponse.id,
//     },
//     title: [{
//       type: "text",
//       text: {
//         content: "Todo List",
//       },
//     }],
//     properties: {
//       "Name": {
//         title: {},
//       },
//       "Finished": {
//         checkbox: {},
//       },
//       "Created At": {
//         created_time: {},
//       },
//       "Created By": {
//         created_by: {},
//       },
//     },
//   });
// }
