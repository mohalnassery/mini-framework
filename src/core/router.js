// router.js
class RouterError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RouterError';
  }
}

export class Router {
  constructor() {
    this.routes = {};
    window.addEventListener('hashchange', () => {
      try {
        this.loadRoute(location.hash.slice(1));
      } catch (error) {
        console.error('Error in route change:', error);
        // Fallback to default route
        this.loadRoute('');
      }
    });
  }

  addRoute(path, action) {
    try {
      if (typeof path !== 'string') {
        throw new RouterError('Route path must be a string');
      }
      if (typeof action !== 'function') {
        throw new RouterError('Route action must be a function');
      }
      
      this.routes[path] = action;
    } catch (error) {
      console.error('Error in addRoute:', error);
      throw error;
    }
  }

  navigate(path) {
    location.hash = path;
    this.loadRoute(path);
  }

  loadRoute(path) {
    try {
      const action = this.routes[path] || this.routes[''];
      if (action) {
        action();
      } else {
        console.warn(`No route found for path: ${path}`);
      }
    } catch (error) {
      console.error('Error in loadRoute:', error);
      // Attempt to load default route
      if (this.routes['']) {
        this.routes['']();
      }
    }
  }
}
