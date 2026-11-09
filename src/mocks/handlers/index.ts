import { authHandlers } from "./auth";
import { poiHandlers } from "./poi";
export const handlers = [...authHandlers, ...poiHandlers];
