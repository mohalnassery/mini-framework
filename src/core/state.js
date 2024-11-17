// state.js
export class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    const prevState = this.state;
    this.state = { ...this.state, ...newState };
    
    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      this.notify();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}
