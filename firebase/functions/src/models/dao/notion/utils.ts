import {UpdatePageResponse} from "@notionhq/client/build/src/api-endpoints";
import {notion, TODOLIST_DATABASE_ID} from "./config";


/**
 * Adds two numbers together.
 * @param {string} userId user id.
 * @return {string} The sum of the two numbers.
 */
export function createUserTodoDatabase(userId: string):
  Promise<UpdatePageResponse> {
  return notion.pages.create({
    parent: {
      database_id: TODOLIST_DATABASE_ID,
    },
    properties: {
      "Name": {
        title: [
          {
            text: {
              content: userId,
            },
          },
        ],
      },
    },
  }).then(async (response) => await notion.databases.create({
    parent: {
      page_id: response.id,
    },
    title: [],
    is_inline: true,
    properties: {
      "Name": {
        title: {},
      },
      "Finished": {
        checkbox: {},
      },
      "Finshed At": {
        formula: {
          expression:
            "end(prop(\"Finished\") ? prop(\"Updated At\") : "+
            "fromTimestamp(toNumber(\"\")))",
        },
      },
      "Updated At": {
        last_edited_time: {},
      },
      "Created At": {
        created_time: {},
      },
      "Created By": {
        created_by: {},
      },
    },
  }).then( async (response2)=> await notion.pages.update({
    page_id: response.id,
    properties: {
      "database": {
        rich_text: [
          {
            text: {
              content: response2.id,
            },
          },
        ],
      },
    },
  })));
}
