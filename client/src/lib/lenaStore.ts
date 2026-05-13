type Handler = (message: string) => void;
let _handler: Handler | null = null;

export function registerLenaOpenHandler(handler: Handler) {
  _handler = handler;
}

export function openLenaWithMessage(message: string) {
  _handler?.(message);
}
