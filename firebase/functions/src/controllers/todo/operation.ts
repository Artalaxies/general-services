import {onCall} from "../../utilities/https";
import * as functions from "firebase-functions";
import {pipe} from "fp-ts/function";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as O from "fp-ts/lib/Option";
import * as L from "logger-fp-ts";
import {LoggerEnv} from "logger-fp-ts";
import * as Todo from "../../dao/notion/sdk/services/todo_dao";
import * as Service from "../../dao/notion/sdk/services/general_dao";
import * as RTE2 from "../../typed/ReaderTaskEither";
import {authCheck, readParameter, readParameterOption} from "../untils";
import {throwError} from "../../typed/Error";
import {PersonalTodoList} from "../../configs/service/todo";
import {Binding} from "../../configs/binding";


exports.getMyTasks = onCall(async (data, context) => await pipe(
    RTE.ask<LoggerEnv, functions.https.HttpsError>(),
    RTE2.log(() => L.debug("Accessing Endpoint \"getMyTasks\"")),
    authCheck(context),
    readParameter("serviceId", () => data["service_id"]),
    readParameterOption("startCursor", () => data["start_cursor"]),
    readParameterOption("pageSize", () => data["page_size"]),
    RTE.chain(({serviceId, startCursor, pageSize})=>
      Todo.getList(serviceId,
          O.match(()=> 10, (a) => Number(a))(pageSize),
          O.toNullable(O.map((a) => <string>(a))(startCursor)))),
    RTE.bimap((e) => e instanceof functions.https.HttpsError ? e :
    new functions.https
        .HttpsError("internal", "Impacted an internal issue."),
    (taskList) => taskList),
)(Binding)());

exports.register = onCall(async (_, context) => await pipe(
    RTE.asks<typeof Binding, void, functions.https.HttpsError>(()=>{}),
    RTE.chain(() => RTE.of({})),
    RTE2.log(() => L.debug("Accessing Endpoint \"register\"")),
    authCheck(context),
    RTE.chain(() =>Service.getServiceList(context.auth!.uid)),
    RTE.map((serviceList) =>
    serviceList.find((value) => value.name == "Personal Todo-List") ?
    throwError(new functions.https
        .HttpsError("unavailable", "Already registered.")) :
    serviceList),
    RTE.chainW(() =>
      Todo.registerTodoService(context.auth!.uid, PersonalTodoList)),
    RTE.bimap((e) => throwError(e instanceof functions.https.HttpsError ? e :
    new functions.https
        .HttpsError("internal", "Impacted an internal issue.")),
    (entityId) => ({entity_id: entityId})),
)(Binding)());

exports.addTask = onCall(async (data, context) => await pipe(
    RTE.ask<LoggerEnv, functions.https.HttpsError>(),
    RTE2.log(() => L.debug("Accessing Endpoint \"addTask\"")),
    authCheck(context),
    readParameter("content", () => data["content"]),
    readParameter("finished", () => data["finished"]),
    readParameter("serviceId", () => data["service_id"]),
    RTE.chainW(({content, finished, serviceId}) =>
      Todo.addTask(content, Boolean(finished))(serviceId)),
    RTE.bimap((e) => throwError(e instanceof functions.https.HttpsError ? e :
    new functions.https
        .HttpsError("unavailable", e.message)),
    (taskId) => ({task_id: taskId})),
)(Binding)());

exports.finishedTask = onCall(async (data, context) => await pipe(
    RTE.ask<LoggerEnv, functions.https.HttpsError>(),
    RTE2.log(() => L.debug("Accessing Endpoint \"finishedTask\"")),
    authCheck(context),
    readParameter("taskId", () => data["task_id"]),
    RTE.chainW(({taskId}) => Todo.updateTaskStatus(taskId, true)),
    RTE.bimap((e) => throwError(e instanceof functions.https.HttpsError ? e :
    new functions.https
        .HttpsError("unavailable", e.message)),
    (taskId) => ({task_id: taskId})),
)(Binding)());

exports.unfinishedTask = onCall(async (data, context) => await pipe(
    RTE.ask<LoggerEnv, functions.https.HttpsError>(),
    RTE2.log(() => L.debug("Accessing Endpoint \"unfinishedTask\"")),
    authCheck(context),
    readParameter("taskId", () => data["task_id"]),
    RTE.chainW(({taskId}) => Todo.updateTaskStatus(
        taskId, false)),
    RTE.bimap((e) => throwError(e instanceof functions.https.HttpsError ? e :
     new functions.https
         .HttpsError("unavailable", e.message)),
    (taskId) => ({task_id: taskId})),
)(Binding)());

exports.achieveTask = onCall(async (data, context) => await pipe(
    RTE.ask<LoggerEnv, functions.https.HttpsError>(),
    RTE2.log(() => L.debug("Accessing Endpoint \"unfinishedTask\"")),
    authCheck(context),
    readParameter("taskId", () => data["task_id"]),
    RTE.chainW(({taskId}) => Todo.updateTaskStatus(
        taskId, undefined, true)),
    RTE.bimap((e) => throwError(e instanceof functions.https.HttpsError ? e :
        new functions.https
            .HttpsError("unavailable", e.message)),
    (taskId) => ({task_id: taskId})),
)(Binding)());

exports.unachieveTask = onCall(async (data, context) => await pipe(
    RTE.ask<LoggerEnv, functions.https.HttpsError>(),
    RTE2.log(() => L.debug("Accessing Endpoint \"unfinishedTask\"")),
    authCheck(context),
    readParameter("taskId", () => data["task_id"]),
    RTE.chainW(({taskId}) => Todo.updateTaskStatus(
        taskId, undefined, false)),
    RTE.bimap((e) => throwError(e instanceof functions.https.HttpsError ? e :
        new functions.https
            .HttpsError("unavailable", e.message)),
    (taskId) => ({task_id: taskId})),
)(Binding)());

exports.deleteTask = onCall(async (data, context) => await pipe(
    RTE.ask<LoggerEnv, functions.https.HttpsError>(),
    RTE2.log(() => L.debug("Accessing Endpoint \"deleteTask\"")),
    authCheck(context),
    readParameter("taskId", () => data["task_id"]),
    RTE.chainW(({taskId}) => Todo.deleteTask(taskId)),
    RTE.bimap((e) => throwError(e instanceof functions.https.HttpsError ? e :
        new functions.https
            .HttpsError("unavailable", e.message)),
    (taskId) => ({task_id: taskId})),
)(Binding)());

