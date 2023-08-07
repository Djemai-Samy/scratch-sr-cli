// Import necessary functions from the "scratch" library
import { renderApp } from "scratch-ssr";

// Import the main application component and other page components
// import App from "./app/App";
// import Home from "./app/components/pagesComponents/Home";
// import Random from "./app/components/pagesComponents/Random";

/** OPTIONAL: Enable File System Routing
 * By enabling file system routing, we can use the pages folder for routing.
 * It will also enable '/pages/_app.js' to be used as the main component.
 */
const context = require.context("./pages", true, /\.jsx$/);

/** OPTIONAL: Choose your Main Component.
 * @module Main
 * @description The main application component that acts as the base component.
 *              If `Main` is set to `null`, the default base component with a Navbar will be used.
 *              When `Main` is set to `App`, the `App` component will be used as the base component.
 */
const Main = null;
// const Main = App;

/** OPTIONAL: Add Components Routing.
 * @type {Object[]}
 * @description Custom routes and components that take priority in case of conflicts with page routing.
 *              If you want to define custom routes, uncomment the lines below and add your routes.
 * @example
 * const routes = [
 *   {
 *     path: "/",
 *     component: Home,
 *   },
 *   {
 *     path: "/random",
 *     component: Random,
 *   },
 *   {
 *     path: "/todos/{id}",
 *     component: Todo,
 *   },
 * ];
 */
const routes = [];

/**
 * Render the App.
 * Call the renderApp function to render the application.
 */
renderApp(
	{
		context, // Provide the context for file system routing
		App: Main, // Specify the main component to be used (null for default behavior)
		routes, // Pass the custom routes if defined
	},
	{
		print: true, // Will console.log the rendered App (Used by PHP to make SSR)
	}
);
