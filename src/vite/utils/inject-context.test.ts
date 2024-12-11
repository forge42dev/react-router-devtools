import { injectContext } from "./inject-context"

const removeWhitespace = (str: string) => str.replace(/\s/g, "")

describe("transform", () => {
	it("should transform the loader export when it's a function", () => {
		const result = injectContext(
			`
			export function loader() {}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderContextWrapper as _withLoaderContextWrapper   } from "react-router-devtools/context";
			export const loader = _withLoaderContextWrapper(function loader() {}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the loader export when it's a const variable", () => {
		const result = injectContext(
			`
			export const loader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderContextWrapper as _withLoaderContextWrapper   } from "react-router-devtools/context";
			export const loader = _withLoaderContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the loader export when it's a let variable", () => {
		const result = injectContext(
			`
			export let loader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderContextWrapper as _withLoaderContextWrapper   } from "react-router-devtools/context";
			export let loader = _withLoaderContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the loader export when it's a var variable", () => {
		const result = injectContext(
			`
			export var loader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderContextWrapper as _withLoaderContextWrapper   } from "react-router-devtools/context";
			export var loader = _withLoaderContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the loader export when it's re-exported from another file", () => {
		const result = injectContext(
			`
			export { loader } from "./loader.js";
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderContextWrapper as _withLoaderContextWrapper   } from "react-router-devtools/context";
      export { loader as _loader } from "./loader.js";
			export const loader = _withLoaderContextWrapper(_loader, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the loader export when it's imported from another file and exported", () => {
		const result = injectContext(
			`
			import {  loader } from "./loader.js";
			export { loader };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderContextWrapper as _withLoaderContextWrapper   } from "react-router-devtools/context";
      import { loader  } from "./loader.js";
			export { loader as _loader };
			export const loader = _withLoaderContextWrapper(_loader, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's a function", () => {
		const result = injectContext(
			`
			export function clientLoader() {}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderContextWrapper as _withClientLoaderContextWrapper   } from "react-router-devtools/context";
			export const clientLoader = _withClientLoaderContextWrapper(function clientLoader() {}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's a const variable", () => {
		const result = injectContext(
			`
			export const clientLoader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderContextWrapper as _withClientLoaderContextWrapper   } from "react-router-devtools/context";
			export const clientLoader = _withClientLoaderContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's a let variable", () => {
		const result = injectContext(
			`
			export let clientLoader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderContextWrapper as _withClientLoaderContextWrapper   } from "react-router-devtools/context";
			export let clientLoader = _withClientLoaderContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's a var variable", () => {
		const result = injectContext(
			`
			export var clientLoader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderContextWrapper as _withClientLoaderContextWrapper   } from "react-router-devtools/context";
			export var clientLoader = _withClientLoaderContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's re-exported from another file", () => {
		const result = injectContext(
			`
			import { clientLoader } from "./client-loader.js";
			export { clientLoader };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderContextWrapper as _withClientLoaderContextWrapper   } from "react-router-devtools/context";
			import { clientLoader  } from "./client-loader.js";
			export { clientLoader as _clientLoader };
			export const clientLoader = _withClientLoaderContextWrapper(_clientLoader, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's imported from another file and exported", () => {
		const result = injectContext(
			`
			import { clientLoader } from "./client-loader.js";
			export { clientLoader };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderContextWrapper as _withClientLoaderContextWrapper   } from "react-router-devtools/context";
      import { clientLoader  } from "./client-loader.js";
			export { clientLoader as _clientLoader };
			export const clientLoader = _withClientLoaderContextWrapper(_clientLoader, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's a function", () => {
		const result = injectContext(
			`
			export function action() {}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionContextWrapper as _withActionContextWrapper   } from "react-router-devtools/context";
			export const action = _withActionContextWrapper(function action() {}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's a const variable", () => {
		const result = injectContext(
			`
			export const action = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionContextWrapper as _withActionContextWrapper   } from "react-router-devtools/context";
			export const action = _withActionContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's a let variable", () => {
		const result = injectContext(
			`
			export let action = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionContextWrapper as _withActionContextWrapper   } from "react-router-devtools/context";
			export let action = _withActionContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's a var variable", () => {
		const result = injectContext(
			`
			export var action = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionContextWrapper as _withActionContextWrapper   } from "react-router-devtools/context";
			export var action = _withActionContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's re-exported from another file", () => {
		const result = injectContext(
			`
			export { action } from "./action.js";
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionContextWrapper as _withActionContextWrapper   } from "react-router-devtools/context";
      export { action as _action } from "./action.js";
			export const action = _withActionContextWrapper(_action, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the action export when it's imported from another file and exported", () => {
		const result = injectContext(
			`
			import {  action } from "./action.js";
			export { action };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionContextWrapper as _withActionContextWrapper   } from "react-router-devtools/context";
      import { action  } from "./action.js";
			export { action as _action };
			export const action = _withActionContextWrapper(_action, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's a function", () => {
		const result = injectContext(
			`
			export function clientAction() {}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionContextWrapper as _withClientActionContextWrapper   } from "react-router-devtools/context";
			export const clientAction = _withClientActionContextWrapper(function clientAction() {}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's a const variable", () => {
		const result = injectContext(
			`
			export const clientAction = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionContextWrapper as _withClientActionContextWrapper   } from "react-router-devtools/context";
			export const clientAction = _withClientActionContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's a let variable", () => {
		const result = injectContext(
			`
			export let clientAction = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionContextWrapper as _withClientActionContextWrapper   } from "react-router-devtools/context";
			export let clientAction = _withClientActionContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's a var variable", () => {
		const result = injectContext(
			`
			export var clientAction = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionContextWrapper as _withClientActionContextWrapper   } from "react-router-devtools/context";
			export var clientAction = _withClientActionContextWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's re-exported from another file", () => {
		const result = injectContext(
			`
			import { clientAction } from "./client-action.js";
			export { clientAction };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionContextWrapper as _withClientActionContextWrapper   } from "react-router-devtools/context";
			import { clientAction  } from "./client-action.js";
			export { clientAction as _clientAction };
			export const clientAction = _withClientActionContextWrapper(_clientAction, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's imported from another file and exported", () => {
		const result = injectContext(
			`
			import { clientAction } from "./client-action.js";
			export { clientAction };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionContextWrapper as _withClientActionContextWrapper   } from "react-router-devtools/context";
      import { clientAction  } from "./client-action.js";
			export { clientAction as _clientAction };
			export const clientAction = _withClientActionContextWrapper(_clientAction, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})
})
