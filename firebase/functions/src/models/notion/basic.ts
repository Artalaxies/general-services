import {CreateDatabaseParameters,
  CreatePageParameters,
  UpdateDatabaseParameters,
  UpdatePageParameters}
  from "@notionhq/client/build/src/api-endpoints";
import {EntityParameters} from "./entity_parameters";


export const defaultCreateDatabaseTemplate =
(pageId: string):
EntityParameters<CreateDatabaseParameters> =>
  new EntityParameters<CreateDatabaseParameters>( "database", {
    parent: {
      page_id: pageId,
    },
    properties: {
      "Name": {
        title: {},
      },
    },
  });

export const defaultCreatePageTemplate =
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

export const defaultDeletePageTemplate = (id: string):
   EntityParameters<UpdatePageParameters> =>
  defaultUpdatePageTemplate(id).update({
    page_id: id,
    archived: true,
  });


export const defaultDeleteDatabaseTemplate = (id: string):
  EntityParameters<UpdateDatabaseParameters> =>
  defaultUpdateDatabaseTemplate(id).update({
    database_id: id,
    archived: true,
  });


export const defaultUpdatePageTemplate = (pageId: string):
  EntityParameters<UpdatePageParameters> =>
  new EntityParameters<UpdatePageParameters>("page",
      {
        page_id: pageId,
      },
  );


export const defaultUpdateDatabaseTemplate = (databaseId: string):
  EntityParameters<UpdateDatabaseParameters> =>
  new EntityParameters<UpdateDatabaseParameters>("database",
      {
        database_id: databaseId,
      },
  );

