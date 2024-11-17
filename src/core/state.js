// state.js
// Deep equality comparison utility
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  if (obj1 === null || obj2 === null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => {
    if (!obj2.hasOwnProperty(key)) return false;
    return deepEqual(obj1[key], obj2[key]);
  });
}

// Get nested object value by path
function getByPath(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

class StateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StateError';
  }
}

export class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    const prevState = this.state;
    this.state = { ...this.state, ...newState };
    
    // Immediately notify all listeners of the state change
    this.listeners.forEach(listener => {
      listener(this.state, prevState);
    });
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new StateError('Listener must be a function');
    }
    
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }
}
