
import {ServiceKey, UIDKey, ServiceIdKey}
  from "../../../configs/service/general";
import {defaultCreateDatabaseTemplate,
  defaultCreatePageTemplate} from "../basic";


export const serviceDatabaseTemplate =
(pageId: string, serviceName: string) =>
  defaultCreateDatabaseTemplate(pageId).update({
    title: [
      {
        text: {
          content: serviceName,
        },
      },
    ],
  });


export const serviceEntityPageTemplate =
(uid : string,
    serviceName: string,
    serviceId: string) => (databaseId: string) =>
  defaultCreatePageTemplate(databaseId).update({
    properties: {
      [UIDKey]: {
        title: [
          {
            text: {
              content: uid,
            },
          },
        ],
      },
      [ServiceKey]: {
        select: {
          name: serviceName,
        },
      },
      [ServiceIdKey]: {
        rich_text: [
          {
            text: {
              content: serviceId,
            },
          },
        ],
      },
    },
  });
