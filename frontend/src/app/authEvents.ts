type Listener = () => void;

const listeners = new Set<Listener>();

export const authEvents = {
  onUnauthorized(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emitUnauthorized() {
    for (const fn of listeners) fn();
  },
};
