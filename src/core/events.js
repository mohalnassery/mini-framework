// events.js
export function on(eventType, selector, handler) {
  document.addEventListener(eventType, function(event) {
    const target = event.target;
    const matchingElement = target.matches(selector) ? target : target.closest(selector);
    
    if (matchingElement) {
      handler.call(matchingElement, event);
    }
  }, true);
}

export function off(eventType, selector, handler) {
  // For simplicity, this function is left unimplemented
}

export function emit(eventType, detail = {}) {
  const event = new CustomEvent(eventType, { detail });
  document.dispatchEvent(event);
}
