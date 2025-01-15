import { setVars, getVar } from './externalStore';

class MapRouter {
  constructor() {
    this.routes = new Map();
  }

  // Add a new route
  addRoute(key, handler) {
    this.routes.set(key, handler);
  }

  // Execute a route
  async executeRoute(key, params = {}) {
    const handler = this.routes.get(key);
    if (handler) {
      try {
        const result = await handler(params);
        // Store the result in the external store
        setVars({ [key]: result });
        return result;
      } catch (error) {
        console.error(`Error executing route ${key}:`, error);
        throw error;
      }
    } else {
      throw new Error(`No handler found for key: ${key}`);
    }
  }

  // Get the result of a previously executed route
  getRouteResult(key) {
    return getVar(key);
  }

  // List all available routes
  listRoutes() {
    return Array.from(this.routes.keys());
  }
}

// Create and export a single instance of MapRouter
const mapRouter = new MapRouter();
export default mapRouter;
