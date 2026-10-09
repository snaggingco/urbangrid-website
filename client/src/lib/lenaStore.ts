type Handler = (message: string) => void;
let _handler: Handler | null = null;

export function registerLenaOpenHandler(handler: Handler): () => void {
  _handler = handler;
  return () => {
    if (_handler === handler) _handler = null;
  };
}

export function openLenaWithMessage(message: string) {
  _handler?.(message);
}
