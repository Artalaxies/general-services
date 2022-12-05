/* eslint-disable require-jsdoc */
import {UpdateDatabaseParameters,
  UpdatePageParameters} from "@notionhq/client/build/src/api-endpoints";
import {EntityParameters} from "../entity_parameters";


export const defaultDeletePage = (id: string):
 EntityParameters<UpdatePageParameters> =>
  defaultUpdatePage(id).update({
    page_id: id,
    archived: true,
  });


export const defaultDeleteDatabase = (id: string):
EntityParameters<UpdateDatabaseParameters> =>
  defaultUpdateDatabase(id).update({
    database_id: id,
    archived: true,
  });


export const defaultUpdatePage = (id: string):
EntityParameters<UpdatePageParameters> =>
  new EntityParameters<UpdatePageParameters>("page",
      {
        page_id: id,
      },
  );


export const defaultUpdateDatabase = (id: string):
EntityParameters<UpdateDatabaseParameters> =>
  new EntityParameters<UpdateDatabaseParameters>("database",
      {
        database_id: id,
      },
  );
