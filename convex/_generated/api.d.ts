/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as hackathonClaims from "../hackathonClaims.js";
import type * as hackathonParticipations from "../hackathonParticipations.js";
import type * as lib_hackathonProjectCount from "../lib/hackathonProjectCount.js";
import type * as lib_projectFields from "../lib/projectFields.js";
import type * as projects from "../projects.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  hackathonClaims: typeof hackathonClaims;
  hackathonParticipations: typeof hackathonParticipations;
  "lib/hackathonProjectCount": typeof lib_hackathonProjectCount;
  "lib/projectFields": typeof lib_projectFields;
  projects: typeof projects;
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
