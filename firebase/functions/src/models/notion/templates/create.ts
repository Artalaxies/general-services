import {CreateDatabaseParameters, CreatePageParameters}
  from "@notionhq/client/build/src/api-endpoints";
import {EntityParameters} from "../entity_parameters";


export const todolistDatabaseTemplate = (pageId: string,
    title: string):
EntityParameters<CreateDatabaseParameters> =>
  defaultCreateDatabase(pageId, title).update(
      {
        parent: {
          page_id: pageId,
        },
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
              expression: "end(prop(\"Finished\") ? prop(\"Updated At\") : " +
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
      },
  );


export const defaultCreateDatabase =
(pageId: string, title: string):
EntityParameters<CreateDatabaseParameters> =>
  new EntityParameters<CreateDatabaseParameters>( "database", {
    parent: {
      page_id: pageId,
    },
    title: [{
      type: "text",
      text: {
        content: title,
      },
    }],
    properties: {
      "Name": {
        title: {},
      },
    },
  });

export const defaultCreatePage =
(databaseId: string):
EntityParameters<CreatePageParameters> =>
  new EntityParameters<CreatePageParameters>("page", {
    "parent": {
      database_id: databaseId,
    },
    "properties": {
      "Name": {
        title: [],
      },
    },
  });

