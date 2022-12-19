import {developmentLoggerEnv} from "../utilities/logger";
import {developmentNotionEnv} from "./notion";


export const Binding = {
  ...developmentLoggerEnv,
  ...developmentNotionEnv,
};
