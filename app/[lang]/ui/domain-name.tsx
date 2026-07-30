"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function DomainName() {
  const domain = useSyncExternalStore(
    subscribe,
    () => window.location.hostname.replace(/^www\./, ""),
    () => "this domain",
  );

  return <span>{domain}</span>;
}
