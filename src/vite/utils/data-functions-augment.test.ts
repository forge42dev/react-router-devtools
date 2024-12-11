import { augmentDataFetchingFunctions } from "./data-functions-augment"

const removeWhitespace = (str: string) => str.replace(/\s/g, "")

describe("transform", () => {
	it("should transform the loader export when it's a function", () => {
		const result = augmentDataFetchingFunctions(
			`
			export function loader() {}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
			export const loader = _withLoaderWrapper(function loader() {}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the loader export when it's a const variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export const loader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
			export const loader = _withLoaderWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the loader export when it's a let variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export let loader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
			export let loader = _withLoaderWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the loader export when it's a var variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export var loader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
			export var loader = _withLoaderWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the loader export when it's re-exported from another file", () => {
		const result = augmentDataFetchingFunctions(
			`
			export { loader } from "./loader.js";
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
      export { loader as _loader } from "./loader.js";
			export const loader = _withLoaderWrapper(_loader, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the loader export when it's imported from another file and exported", () => {
		const result = augmentDataFetchingFunctions(
			`
			import {  loader } from "./loader.js";
			export { loader };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
      import { loader  } from "./loader.js";
			export { loader as _loader };
			export const loader = _withLoaderWrapper(_loader, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's a function", () => {
		const result = augmentDataFetchingFunctions(
			`
			export function clientLoader() {}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
			export const clientLoader = _withClientLoaderWrapper(function clientLoader() {}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's a const variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export const clientLoader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
			export const clientLoader = _withClientLoaderWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's a let variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export let clientLoader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
			export let clientLoader = _withClientLoaderWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's a var variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export var clientLoader = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
			export var clientLoader = _withClientLoaderWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's re-exported from another file", () => {
		const result = augmentDataFetchingFunctions(
			`
			import { clientLoader } from "./client-loader.js";
			export { clientLoader };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
			import { clientLoader  } from "./client-loader.js";
			export { clientLoader as _clientLoader };
			export const clientLoader = _withClientLoaderWrapper(_clientLoader, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the client loader export when it's imported from another file and exported", () => {
		const result = augmentDataFetchingFunctions(
			`
			import { clientLoader } from "./client-loader.js";
			export { clientLoader };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
      import { clientLoader  } from "./client-loader.js";
			export { clientLoader as _clientLoader };
			export const clientLoader = _withClientLoaderWrapper(_clientLoader, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's a function", () => {
		const result = augmentDataFetchingFunctions(
			`
			export function action() {}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
			export const action = _withActionWrapper(function action() {}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's a const variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export const action = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
			export const action = _withActionWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's a let variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export let action = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
			export let action = _withActionWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's a var variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export var action = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
			export var action = _withActionWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the action export when it's re-exported from another file", () => {
		const result = augmentDataFetchingFunctions(
			`
			export { action } from "./action.js";
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
      export { action as _action } from "./action.js";
			export const action = _withActionWrapper(_action, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the action export when it's imported from another file and exported", () => {
		const result = augmentDataFetchingFunctions(
			`
			import {  action } from "./action.js";
			export { action };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
      import { action  } from "./action.js";
			export { action as _action };
			export const action = _withActionWrapper(_action, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's a function", () => {
		const result = augmentDataFetchingFunctions(
			`
			export function clientAction() {}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			export const clientAction = _withClientActionWrapper(function clientAction() {}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's a const variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export const clientAction = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			export const clientAction = _withClientActionWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's a let variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export let clientAction = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			export let clientAction = _withClientActionWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's a var variable", () => {
		const result = augmentDataFetchingFunctions(
			`
			export var clientAction = async ({ request }) => { return {};}
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			export var clientAction = _withClientActionWrapper(async ({ request }) => { return {};}, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's re-exported from another file", () => {
		const result = augmentDataFetchingFunctions(
			`
			import { clientAction } from "./client-action.js";
			export { clientAction };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			import { clientAction  } from "./client-action.js";
			export { clientAction as _clientAction };
			export const clientAction = _withClientActionWrapper(_clientAction, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should transform the client action export when it's imported from another file and exported", () => {
		const result = augmentDataFetchingFunctions(
			`
			import { clientAction } from "./client-action.js";
			export { clientAction };
			`,
			"test"
		)
		const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
      import { clientAction  } from "./client-action.js";
			export { clientAction as _clientAction };
			export const clientAction = _withClientActionWrapper(_clientAction, "test");
		`)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})
})
