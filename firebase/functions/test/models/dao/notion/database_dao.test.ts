import "mocha";
import {expect} from "chai";
import {createEntity} from "../../../../src/models/dao/notion/database_dao";
import {defaultDatabaseTemplate}
  from "../../../../src/models/entities/notion/template";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
// import * as TE from "fp-ts/lib/TaskEither";
// import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/function";
import {developmentEnv} from "../../../../src/utilities/logger";
import {LoggerEnv} from "logger-fp-ts";


describe("Notion API", () =>{
  describe("Database Operation", () => {
    let entityId = "";
    before(()=>{

    });


    it("Create a Database", (done) => {
      pipe(
          RTE.ask<LoggerEnv>(),
          RTE.chain(() =>createEntity(
              defaultDatabaseTemplate("4c2b2362-2576-4f8f-8f64-d7b0b25a11fe",
                  "Testing Database"))),
          RTE.match(
              () => "",
              (s) => s
          ),
      )(developmentEnv)().then((id)=>{
        entityId = id;
        expect(entityId).to.contain("-");
        done();
      }).catch(done);
    });

    it("Check Column in a Database", (done) => {});
    it("Add Data to a Database", (done) => {});
    it("Edit Data to a Database", (done) => {});
    it("Delete Data in a Database", (done) => {});
    it("Delete a Database", (done) => {});
  });
});


// .then((id)=>{
//   expect(entityId).to.not("");
//   entityId = id;
//   console.log("entityId:" + entityId);
//   done();
// })
