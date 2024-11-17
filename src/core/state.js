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
    if (typeof initialState !== 'object') {
      throw new StateError('Initial state must be an object');
    }
    this.state = initialState;
    this.listeners = new Map();
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    try {
      if (typeof newState !== 'object') {
        throw new StateError('New state must be an object');
      }
      
      const prevState = this.state;
      this.state = { ...this.state, ...newState };
      
      if (!deepEqual(prevState, this.state)) {
        this.notify(prevState);
      }
    } catch (error) {
      console.error('Error in setState:', error);
      throw error;
    }
  }

  subscribe(listener, path = null) {
    try {
      if (typeof listener !== 'function') {
        throw new StateError('Listener must be a function');
      }
      if (path !== null && typeof path !== 'string') {
        throw new StateError('Path must be a string or null');
      }
      
      const id = Symbol();
      this.listeners.set(id, { listener, path });
      return () => this.listeners.delete(id);
    } catch (error) {
      console.error('Error in subscribe:', error);
      throw error;
    }
  }

  notify(prevState) {
    this.listeners.forEach(({ listener, path }) => {
      if (path) {
        const oldValue = getByPath(prevState, path);
        const newValue = getByPath(this.state, path);
        
        if (!deepEqual(oldValue, newValue)) {
          listener(this.getState(), path);
        }
      } else {
        listener(this.getState());
      }
    });
  }
}
