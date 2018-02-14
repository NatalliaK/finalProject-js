export default class Router {
  constructor(options) {
    this.routes = options.routes || [];
		this.eventBus = options.eventBus;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => {
      this.handleUrl(window.location.hash);
    });
    this.handleUrl(window.location.hash);
  }

  handleUrl(url) {
    url = url.slice(1);

    const previosRoute = this.findPreviosActiveRoute();
    const nextRoute = this.findNextActiveRoute(url);
    const routeParams = this.getRouteParams(nextRoute, url);

    return Promise.resolve()

      .then(() => {
        previosRoute
				&& previosRoute.leave
				&& previosRoute.leave(...this.currentRouteParams);
      })

      .then(() => {
        nextRoute
				&& nextRoute.onBeforeEnter
				&& nextRoute(...routeParams);
      })

      .then(() => {
        nextRoute
				&& nextRoute.onEnter
				&& nextRoute.onEnter(...routeParams);
      })

      .then(() => {
        this.currentRoute = nextRoute;
        this.currentRouteParams = routeParams;
      });
  }

  findPreviosActiveRoute() {
    return this.currentRoute;
  }

  findNextActiveRoute(url) {
    const route = this.routes.find((routeItem) => {
      if (typeof routeItem.match === 'string') {
        return url === routeItem.match;
      } else if (typeof routeItem.match === 'function') {
        return routeItem.match(url);
      } else if (routeItem.match instanceof RegExp) {
        return url.match(routeItem.match);
      }
    });
    return route;
  }

  getRouteParams(route, url) {
    const params = url.match(route.match) || [];
    params.shift();
    return params;
  }
}
