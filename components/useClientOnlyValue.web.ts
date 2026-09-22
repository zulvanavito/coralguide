import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

// `useSyncExternalStore` getServerSnapshot returns server value during SSR,
// and getSnapshot returns client value after hydration without effect cascading.
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  return useSyncExternalStore<S | C>(
    emptySubscribe,
    () => client,
    () => server
  );
}
