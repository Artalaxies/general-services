import "mocha";
import {expect} from "chai";
import {createEntity} from "../../../../src/models/dao/notion/database_dao";
import {defaultDatabaseTemplate}
  from "../../../../src/models/entities/notion/template";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as RT from "fp-ts/lib/ReaderTask";
// import * as TE from "fp-ts/lib/TaskEither";
// import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/function";
import {developmentEnv, loggingRT,
  loggingRTE} from "../../../../src/utilities/logger";
import {LoggerEnv} from "logger-fp-ts";
import * as L from "logger-fp-ts";


describe("Notion API", () =>{
  describe("Database Operation", () => {
    let entityId = "";
    before(()=>{

    });


    it("Create a Database", (done) => {
      pipe(
          RTE.ask<LoggerEnv>(),
          loggingRTE((() => L.debug("Create a Database"))),
          RTE.chain(() =>createEntity(
              defaultDatabaseTemplate("4c2b2362-2576-4f8f-8f64-d7b0b25a11fe",
                  [{
                    type: "text",
                    text: {
                      content: "Testing Database",
                    },
                  }]))),
          loggingRTE((() => L.debug("Created a Database"))),
          RTE.match(
              () => "",
              (s) => s
          ),
          loggingRT((s) => L.debugP("Database ID")({
            database_id: s,
          })),
          RT.chainFirst((id:string) => RT.of((() => {
            entityId = id;
            console.log("entityId: " + entityId);
          })())),
      )(developmentEnv)().then((id)=>{
        expect(entityId).to.contain("-");
        done();
      }).catch(done);
    }).timeout(5000);
  });
});


// .then((id)=>{
//   expect(entityId).to.not("");
//   entityId = id;
//   console.log("entityId:" + entityId);
//   done();
// })
