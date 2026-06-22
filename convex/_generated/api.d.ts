/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as badges from "../badges.js";
import type * as hackathonClaims from "../hackathonClaims.js";
import type * as hackathonParticipations from "../hackathonParticipations.js";
import type * as lib_hackathonProjectCount from "../lib/hackathonProjectCount.js";
import type * as lib_projectFields from "../lib/projectFields.js";
import type * as lib_projectJoinCode from "../lib/projectJoinCode.js";
import type * as lib_projectUrls from "../lib/projectUrls.js";
import type * as lib_seedHackathonDirectory from "../lib/seedHackathonDirectory.js";
import type * as projects from "../projects.js";
import type * as seedHackathonProjects from "../seedHackathonProjects.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  badges: typeof badges;
  hackathonClaims: typeof hackathonClaims;
  hackathonParticipations: typeof hackathonParticipations;
  "lib/hackathonProjectCount": typeof lib_hackathonProjectCount;
  "lib/projectFields": typeof lib_projectFields;
  "lib/projectJoinCode": typeof lib_projectJoinCode;
  "lib/projectUrls": typeof lib_projectUrls;
  "lib/seedHackathonDirectory": typeof lib_seedHackathonDirectory;
  projects: typeof projects;
  seedHackathonProjects: typeof seedHackathonProjects;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
