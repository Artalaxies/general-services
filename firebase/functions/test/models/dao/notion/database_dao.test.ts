import "mocha";
import {expect} from "chai";
import {checkDatabase, checkPage, createEntity,
  deleteEntity,
  updateEntity} from "../../../../src/dao/notion/database_dao";
import {defaultCreateDatabase, defaultCreatePage}
  from "../../../../src/models/notion/templates/create";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
// import * as TE from "fp-ts/lib/TaskEither";
// import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/function";
import {developmentEnv} from "../../../../src/utilities/logger";
import {LoggerEnv} from "logger-fp-ts";
import {defaultDeleteDatabase,
  defaultDeletePage, defaultUpdateDatabase, defaultUpdatePage}
  from "../../../../src/models/notion/templates/update";


describe("Notion API", () =>{
  describe("Database Operation", () => {
    let databaseId = "";
    let pageId = "";

    it("Create a Database", (done) =>{
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>createEntity(
              defaultCreateDatabase("4c2b2362-2576-4f8f-8f64-d7b0b25a11fe",
                  "Testing Database"))),
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
              defaultUpdateDatabase(databaseId)
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
          RTE.chain(() =>checkDatabase(databaseId)),
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
            createEntity(defaultCreatePage(databaseId))),
          RTE.map((id)=>{
            pageId = id;
            expect(pageId).to.contain("-");
            done();
          }),
      )(developmentEnv)().catch(done);
    });


    it("Edit a page in a Database", (done) => {
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>
            updateEntity(defaultUpdatePage(pageId).update({
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
          RTE.chain(() =>checkPage(pageId)),
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
          RTE.chain(() =>deleteEntity(defaultDeletePage(pageId))),
          RTE.map((response)=> {
            done();
          }),
      )(developmentEnv)().catch(done);
    });

    it("Delete a Database", (done) => {
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>deleteEntity(defaultDeleteDatabase(databaseId))),
          RTE.map((response)=> {
            done();
          }),
      )(developmentEnv)().catch(done);
    });
  });
});
