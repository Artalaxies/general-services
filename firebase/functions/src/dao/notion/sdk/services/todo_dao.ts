import {PageObjectResponse}
  from "@notionhq/client/build/src/api-endpoints";
import {notion, NotionEnv} from "../../../../configs/notion";
import {pipe} from "fp-ts/function";
import {LoggerEnv} from "logger-fp-ts";
import * as L from "logger-fp-ts";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import {ReaderTaskEither} from "fp-ts/lib/ReaderTaskEither";
import * as RTE2 from "../../../../typed/ReaderTaskEither";
import {createEntity, updateEntity} from "../basic_dao";
import {createTaskTemplate,
  todolistDatabaseTemplate}
  from "../../../../models/notion/services/todo";
import {TaskList} from "../../../../models/adt/services/todo";
import {defaultDeletePageTemplate,
  defaultUpdatePageTemplate} from "../../../../models/notion/basic";
// import {Timestamp} from "firebase-admin/firestore";
import {Checkbox, CreatedTime,
  LastEditedTime, TimeZoneRequest,
  Title} from "../../../../models/notion/package";
import {TaskAchievedKey,
  TaskContentKey,
  TaskCreatedTimeKey,
  TaskFinishedKey,
  TaskFinishedTimeKey,
  TaskUpdatedTimeKey,
  TodoListType} from "../../../../configs/service/todo";
import {registerService} from "./general_dao";
import {errorHandler} from "../../../../typed/Error";


export const registerTodoService =
<R extends LoggerEnv & NotionEnv>(uid: string, listType: TodoListType):
ReaderTaskEither<R, Error, string> => pipe(
      RTE.ask<R, Error>(),
      RTE2.log(() => L.debug("Beginning execution of \"registerService\"")),
      RTE.chain(() =>
        (r) => createEntity(todolistDatabaseTemplate(r.SERVICE_CACHE_ID,
            listType + " - "+ uid))(r)),
      RTE.chain((serviceId) => registerService(uid, listType,
          serviceId))
  );

/**
 * get TodoList Content.
 * @param {string} databaseId database id.
 * @param {number} pageSize size of page.
 * @param {string} startCursor list page.
 * @return {ReaderTaskEither<LoggerEnv, Error, PageObjectResponse[]>}
 * Todo List Content.
 */
export const getList = (databaseId: string,
    pageSize : number = 10,
    startCursor: string | null | undefined = null):
ReaderTaskEither<LoggerEnv, Error, TaskList> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    RTE2.log(() => L.debug("Beginning execution of \"getList\"")),
    RTE2.tryCatch(
        () => notion.databases.query(
            {
              database_id: databaseId,
              sorts: [
                {
                  property: TaskFinishedKey,
                  direction: "descending",
                },
              ],
              page_size: pageSize,
              ...(startCursor ? {start_cursor: startCursor} : {}),
            }),
        errorHandler
    ),
    RTE.map((res) => <PageObjectResponse[]>res.results),
    RTE.map((results) => results.map((page)=> {
      const createdTime = (<CreatedTime | null>page
          .properties[TaskCreatedTimeKey])?.created_time;
      const updatedTime = (<LastEditedTime | null>page
          .properties[TaskUpdatedTimeKey])?.last_edited_time;
      return ({
        content: (<Title | undefined>page
            .properties[TaskContentKey])?.title
            .map((text) => text.plain_text)
            .reduce((pre, cur) => pre + "\n" + cur) || "",
        finished: (<Checkbox | undefined>page
            .properties[TaskFinishedKey])?.checkbox || false,
        achieved: (<Checkbox | undefined>page
            .properties[TaskAchievedKey])?.checkbox || false,
        created_time: createdTime,
        updated_time: updatedTime,
      });
    })),
);


/**
 * add a task to a Todo List.
 * @param {string} taskContent task Content.
 * @param {boolean} finished task status.
 * @param {string} databaseId database id.
 * @return {ReaderTaskEither<LoggerEnv,Error,string>}
 * task Id.
 */
export const addTask = (taskContent: string, finished: boolean = false):
((databaseId: string) => ReaderTaskEither<LoggerEnv, Error, string>) =>
  (databaseId: string) => pipe(
      RTE.ask<LoggerEnv, Error>(),
      RTE2.log(() => L.debug("Beginning execution of \"addTask\"")),
      RTE.chain(() =>
        createEntity(createTaskTemplate(taskContent, finished, databaseId))),
  );

/**
 * add a task to a Todo List.
 * @param {string} taskId task Content.
 * @param {boolean} finished finish check up.
 * @param {boolean} achieved achieve check up.
 * @return {ReaderTaskEither<LoggerEnv,Error,string>}
 * task Id.
 */
export const updateTaskStatus = (taskId: string,
    finished: boolean | undefined = undefined,
    achieved: boolean | undefined = undefined):
(ReaderTaskEither<LoggerEnv, Error, string>) => pipe(
    RTE.ask<LoggerEnv, Error>(),
    RTE2.log(() => L.debug("Beginning execution of \"updateTaskStatus\"")),
    RTE.chain(() =>
      updateEntity(defaultUpdatePageTemplate(taskId).update({
        properties: {

          ...(finished !== undefined ? {
            [TaskFinishedKey]: {
              checkbox: finished,
            },
            [TaskFinishedTimeKey]: {
              date: finished ? {
                start: new Date(Date.now()).toISOString(),
                // eslint-disable-next-line new-cap
                time_zone: <TimeZoneRequest>Intl.DateTimeFormat()
                    .resolvedOptions().timeZone,
              } : null,
            },
          } : {}),

          ...(achieved !== undefined ? {
            [TaskAchievedKey]: {
              checkbox: achieved,
            },
          }: {}),

        },
      }))),
);


/**
 * delete a task to a Todo List.
 * @param {string} taskId task Content.
 * @return {ReaderTaskEither<LoggerEnv,Error,string>}
 * task Id.
 */
export const deleteTask = (taskId: string):
ReaderTaskEither<LoggerEnv, Error, string> => pipe(
    RTE.ask<LoggerEnv, Error>(),
    RTE2.log(() => L.debug("Beginning execution of \"deleteTask\"")),
    RTE.chain(() => updateEntity(defaultDeletePageTemplate(taskId))),
);

