"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const client = () => window.location.search;
/** The server has no URL query, so pages render their default, fully crawlable state. */
const server = () => "";

/**
 * The current query string, empty during server rendering.
 *
 * Next's `useSearchParams` would be the obvious hook, but on a statically rendered route
 * it bails the surrounding Suspense boundary out to client-only rendering, which strips
 * the wrapped markup from the served HTML. Reading `?tier=` and `?subject=` this way keeps
 * /quote and /contact both static and fully rendered, with the query applied on hydration.
 */
export function useSearchString() {
  return useSyncExternalStore(subscribe, client, server);
}

export const useQueryParam = (key: string) => new URLSearchParams(useSearchString()).get(key);
