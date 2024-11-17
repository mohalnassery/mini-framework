// router.js
export class Router {
  constructor() {
    this.routes = {};
    window.addEventListener('hashchange', () => {
      this.loadRoute(location.hash.slice(1));
    });
  }

  addRoute(path, action) {
    this.routes[path] = action;
  }

  navigate(path) {
    location.hash = path;
    this.loadRoute(path);
  }

  loadRoute(path) {
    const action = this.routes[path] || this.routes[''];
    if (action) {
      action();
    }
  }
}
