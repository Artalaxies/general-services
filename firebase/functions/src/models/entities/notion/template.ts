import {CreateDatabaseParameters, CreatePageParameters}
  from "@notionhq/client/build/src/api-endpoints";


export type EntityParameter<A> = {_tag: string, parameters: A}

export const todolistDatabaseTemplate = (pageId: string,
    title: CreateDatabaseParameters["title"]):
EntityParameter<CreateDatabaseParameters> => {
  const defaultParam = defaultDatabaseTemplate(pageId, title);
  return {
    ...defaultParam,
    parameters: {
      ...defaultParam.parameters,
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
    },
  };
};


export const defaultDatabaseTemplate =
(pageId: string, title: CreateDatabaseParameters["title"]):
EntityParameter<CreateDatabaseParameters> => ({
  _tag: "database",
  parameters: {
    parent: {
      page_id: pageId,
    },
    title: title,
    properties: {
      "Name": {
        title: {},
      },
    },
  },
});

export const defaultPageTemplate =
(databaseId: string, title: string): EntityParameter<CreatePageParameters> => ({
  _tag: "page",
  parameters: {
    "parent": {
      database_id: databaseId,
    },
    "properties": {
      "Name": {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
    },
  },
});

