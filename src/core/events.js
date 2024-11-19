// events.js
// Store event listeners in a WeakMap to avoid memory leaks
const eventListeners = new WeakMap();

// Helper function to get or create listener array for a specific event type
function getListeners(eventType) {
  if (!eventListeners.has(document)) {
    eventListeners.set(document, new Map());
  }
  const documentListeners = eventListeners.get(document);
  
  if (!documentListeners.has(eventType)) {
    documentListeners.set(eventType, new Map());
  }
  
  return documentListeners.get(eventType);
}

class EventError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EventError';
  }
}

export function on(eventType, selector, handler) {
  try {
    if (typeof eventType !== 'string') {
      throw new EventError('Event type must be a string');
    }
    if (typeof selector !== 'string') {
      throw new EventError('Selector must be a string');
    }
    if (typeof handler !== 'function') {
      throw new EventError('Handler must be a function');
    }

    const eventListeners = getListeners(eventType);
    
    // Create a wrapped handler that checks the selector
    const wrappedHandler = (event) => {
      const matchingElement = event.target.closest(selector);
      if (matchingElement) {
        handler.call(matchingElement, event);
      }
    };
    
    // Store the handler info for potential removal later
    eventListeners.set(handler, {
      selector,
      wrappedHandler
    });
    
    // Add the event listener
    document.addEventListener(eventType, wrappedHandler, true);
  } catch (error) {
    console.error('Error in on:', error);
    throw error;
  }
}

export function off(eventType, selector, handler) {
  try {
    if (typeof eventType !== 'string') {
      throw new EventError('Event type must be a string');
    }
    if (typeof selector !== 'string') {
      throw new EventError('Selector must be a string');
    }
    if (typeof handler !== 'function') {
      throw new EventError('Handler must be a function');
    }

    const eventListeners = getListeners(eventType);
    
    // Find the stored handler info
    const handlerInfo = eventListeners.get(handler);
    
    if (handlerInfo && handlerInfo.selector === selector) {
      // Remove the event listener using the stored wrapped handler
      document.removeEventListener(eventType, handlerInfo.wrappedHandler, true);
      eventListeners.delete(handler);
    }
  } catch (error) {
    console.error('Error in off:', error);
    throw error;
  }
}

export function emit(eventType, detail = {}) {
  try {
    if (typeof eventType !== 'string') {
      throw new EventError('Event type must be a string');
    }
    if (typeof detail !== 'object') {
      throw new EventError('Event detail must be an object');
    }

    const event = new CustomEvent(eventType, { detail });
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error in emit:', error);
    throw error;
  }
}