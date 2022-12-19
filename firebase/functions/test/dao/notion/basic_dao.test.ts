import "mocha";
import {expect} from "chai";
import {checkDatabaseProperties, checkPageProperties, createEntity,
  deleteEntity,
  updateEntity} from "../../../src/dao/notion/sdk/basic_dao";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
// import * as TE from "fp-ts/lib/TaskEither";
// import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/function";
import {developmentEnv} from "../../../src/utilities/logger";
import {LoggerEnv} from "logger-fp-ts";
import {defaultCreateDatabaseTemplate,
  defaultCreatePageTemplate,
  defaultDeleteDatabaseTemplate,
  defaultDeletePageTemplate,
  defaultUpdateDatabaseTemplate,
  defaultUpdatePageTemplate}
  from "../../../src/models/notion/basic";

describe("Basic Notion API Operation", () =>{
  describe("Database Operation", () => {
    let databaseId = "";
    let pageId = "";

    it("Create a Database", (done) =>{
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>createEntity(
              defaultCreateDatabaseTemplate(process.env.TESTING_AREA_ID || "")
                  .update({
                    title: [
                      {text:
                  {
                    content: "Testing Database",
                  }},
                    ],
                  }),
          )),
          RTE.map((id) => {
            databaseId = id;
            expect(databaseId).to.contain("-");
            done();
          })
      )(developmentEnv)().catch(done);
    });

    it("Update a column to a Database", (done) => {
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() => updateEntity(
              defaultUpdateDatabaseTemplate(databaseId)
                  .update(
                      {
                        properties: {
                          "Name": {
                            title: {},
                          },
                          "Column2": {
                            rich_text: {},
                          },
                          "Column3": {
                            number: {},
                          },
                          "Column4": {
                            select: {},
                          },
                        },
                      }
                  )),
          ),
          RTE.map((id) => {
            done();
          })
      )(developmentEnv)().catch(done);
    });


    it("Check columns in a Database", (done) =>{
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>checkDatabaseProperties(databaseId)),
          RTE.map((response)=>response.properties),
          RTE.map((pro)=>{
            console.log(pro);
            expect(pro).to.have.property("Column2");
            expect(pro).to.have.property("Column3");
            expect(pro).to.have.property("Column4");
            done();
          }),
      )(developmentEnv)().catch(done);
    });

    it("Add a page to a Database", (done) => {
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>
            createEntity(defaultCreatePageTemplate(databaseId))),
          RTE.map((id)=>{
            pageId = id;
            expect(pageId).to.contain("-");
            done();
          }),
      )(developmentEnv)().catch(done);
    });

    it("query database", (done)=>{
      pipe(
          RTE.ask<LoggerEnv>(),
      )(developmentEnv)().catch(done);
    });

    it("Edit a page in a Database", (done) => {
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>
            updateEntity(defaultUpdatePageTemplate(pageId).update({
              properties: {
                "Name": {
                  title: [
                    {
                      text: {
                        content: "Test Title",
                      },
                    },
                  ],
                },
                "Column2": {
                  rich_text: [
                    {
                      text: {
                        content: "Test RichText",

                      },
                    },
                  ],
                },
                "Column3": {
                  number: 1,
                },
                "Column4": {
                  select: {
                    name: "Test1",
                  },
                },
              },
            }))),
          RTE.chain(() =>checkPageProperties(pageId)),
          RTE.map((response)=>response.properties),
          RTE.map((pro)=>{
            console.log(pro);

            expect((<{
              type: "rich_text",
              id: string,
              rich_text: Array<any>
          }>pro["Column2"]).rich_text[0].text.content)
                .to.eq("Test RichText");
            expect((<{
              type: "number",
              id: string,
              number?: number
            }>pro["Column3"]).number).to.eq(1);
            done();
          }),
      )(developmentEnv)().catch(done);
    });

    it("Delete a page in a Database", (done) =>{
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>deleteEntity(defaultDeletePageTemplate(pageId))),
          RTE.map((response)=> {
            done();
          }),
      )(developmentEnv)().catch(done);
    });

    it("Delete a Database", (done) => {
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>
            deleteEntity(defaultDeleteDatabaseTemplate(databaseId))),
          RTE.map((response)=> {
            done();
          }),
      )(developmentEnv)().catch(done);
    });
  });
});
