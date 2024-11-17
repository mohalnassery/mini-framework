// router.js
class RouterError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RouterError';
  }
}

export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes[hash] || this.routes['*'];
    this.currentRoute = route;
    route();
  }
}
