import "mocha";
import {expect} from "chai";
import {defaultCreateDatabaseTemplate,
  defaultCreatePageTemplate,
  defaultDeleteDatabaseTemplate,
  defaultDeletePageTemplate,
  defaultUpdateDatabaseTemplate,
  defaultUpdatePageTemplate}
  from "../../../src/models/notion/basic";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
// import * as TE from "fp-ts/lib/TaskEither";
// import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/function";
import {developmentEnv} from "../../../src/utilities/logger";
import {LoggerEnv} from "logger-fp-ts";

describe("Todo Service Operation", () =>{
  describe("Basic Operation", () => {
    it("should create a page for user in todo database", (done) => {
    });
    it("should check if the page exists", (done) => {

    });
    it("should create a database in the account page", (done) => {

    });
    it("should check if the database exists and structure corrects", (done) => {

    });
    it("should add a task to the user Todo database", (done) => {

    });
    it("should update a task to finished status", (done) => {
    });
    it("should achive a task from the user Todo database", (done) => {

    });
    it("should achive a task from the user Todo database", (done) => {

    });
  });
});
