import {CreateDatabaseParameters, CreatePageParameters}
  from "@notionhq/client/build/src/api-endpoints";
import {TaskAchievedKey,
  TaskContentKey,
  TaskCreatedByKey,
  TaskCreatedTimeKey,
  TaskFinishedKey,
  TaskFinishedTimeKey,
  TaskUpdatedTimeKey} from "../../../configs/service/todo";
import {defaultCreatePageTemplate} from "../basic";
import {EntityParameters} from "../entity_parameters";
import {serviceDatabaseTemplate} from "./general";


export const todolistDatabaseTemplate = (pageId: string, name: string):
(EntityParameters<CreateDatabaseParameters>) =>
  serviceDatabaseTemplate(pageId, name).update(
      {
        // is_inline: true,
        properties: {
          [TaskContentKey]: {
            title: {},
          },
          [TaskFinishedKey]: {
            checkbox: {},
          },
          [TaskAchievedKey]: {
            checkbox: {},
          },
          [TaskFinishedTimeKey]: {
            date: {},
          },
          [TaskUpdatedTimeKey]: {
            last_edited_time: {},
          },
          [TaskCreatedTimeKey]: {
            created_time: {},
          },
          [TaskCreatedByKey]: {
            created_by: {},
          },
        },
      },
  );

// formula: {
//   expression: "end(prop(\"Finished\") ? prop(\"Updated At\") : " +
//  "fromTimestamp(toNumber(\"\")))",
// },

export const createTaskTemplate = (taskName: string,
    finished: boolean, databaseId: string):
( EntityParameters<CreatePageParameters>) =>
  defaultCreatePageTemplate(databaseId).update(
      {
        // is_inline: true,
        properties: {
          ...(
              finished ? {[TaskFinishedKey]: {
                checkbox: finished,
              }} : {}
          ),
          [TaskContentKey]: {
            title: [
              {text: {
                content: taskName,
              }},
            ],
          },
        },
      },
  );
