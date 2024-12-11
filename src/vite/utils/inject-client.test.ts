import { injectRdtClient } from "./inject-client"

const removeWhitespace = (str: string) => str.replace(/\s/g, "")

describe("transform", () => {
	it("should transform the default export and inject the rdtStylesheet if there is no links export", () => {
		const result = injectRdtClient(
			`
			export default function App() {}`,
			'{ "config": { "defaultOpen":false,"position":"top-right","requireUrlFlag":false,"liveUrls":[{"url":"https://forge42.dev","name":"Production"},{"url":"https://forge42.dev/staging","name":"Staging"}]}, "plugins": "[tailwindPalettePlugin]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			export default _withViteDevTools(function App() {}, {
			config: {
				 defaultOpen: false,
				 position: "top-right",
				 requireUrlFlag: false,
				 liveUrls: [{
					 url: "https://forge42.dev",
					 name: "Production"
				 }, {
					 url: "https://forge42.dev/staging",
					 name: "Staging"
				 }]
		},
				plugins: [tailwindPalettePlugin]
			});
			export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should inject the client config correctly", () => {
		const result = injectRdtClient(
			`
			export default function App() {}`,
			'{ "config": { "defaultOpen":false,"position":"top-right","requireUrlFlag":false,"liveUrls":[{"url":"https://forge42.dev","name":"Production"},{"url":"https://forge42.dev/staging","name":"Staging"}]}, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			export default _withViteDevTools(function App() {}, {
			config: {
				 defaultOpen: false,
				 position: "top-right",
				 requireUrlFlag: false,
				 liveUrls: [{
					 url: "https://forge42.dev",
					 name: "Production"
				 }, {
					 url: "https://forge42.dev/staging",
					 name: "Staging"
				 }]
		},
				plugins: []
			});
			export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should inject multiple plugins correctly", () => {
		const result = injectRdtClient(
			`
			export default function App() {}`,
			'{ "config": { }, "plugins": "[tailwindPalettePlugin,coolPlugin]" }',
			'import tailwindPalettePlugin from "somewhere";import coolPlugin from "somewhere-else";'
		)
		const expected = removeWhitespace(`
			import tailwindPalettePlugin from "somewhere";
			import coolPlugin from "somewhere-else";
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			export default _withViteDevTools(function App() {}, {
			config: { },
				plugins: [tailwindPalettePlugin, coolPlugin]
			});
			export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly, even if it's wrapped with a higher order function", () => {
		const result = injectRdtClient(
			`
			export default hoc(function App() {});
			function hoc(app) {
				return app;
			}
			`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			export default _withViteDevTools(hoc(function App() {}), {
			config: { },
				plugins: []
			});
			function hoc(app) {
				return app;
			}
			export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's declared as a variable and then exported", () => {
		const result = injectRdtClient(
			`
			const App = () => {};
			export default App;
			`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			const App = () => {};
			export default _withViteDevTools(App, {
			config: { },
				plugins: []
			});
			export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's declared as a function and then exported", () => {
		const result = injectRdtClient(
			`
			function App() {};
			export default App;
			`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			function App() {};
			export default _withViteDevTools(App, {
			config: { },
				plugins: []
			});
			export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's declared as a function and wrapped with a higher order function", () => {
		const result = injectRdtClient(
			`
			function App() {};
			export default hoc(App);
			function hoc(app) {
				return app;
			}
			`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			function App() {};
			export default _withViteDevTools(hoc(App), {
			config: { },
				plugins: []
			});
			function hoc(app) {
				return app;
			}
			export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's rexported from another file", () => {
		const result = injectRdtClient(
			`
			import { default as App } from "./app.js";
			export default App;
			`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			import { default as App } from "./app.js";
			export default _withViteDevTools(App, {
			config: { },
				plugins: []
			});
			export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the links export with the rdtStylesheet import when it's an empty array", () => {
		const result = injectRdtClient(
			`
			export const links = () => [];
			export default function App() {}`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withLinksWrapper as _withLinksWrapper, withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			export const links = _withLinksWrapper(() => [], rdtStylesheet);
			export default _withViteDevTools(function App() {}, {
			config: { },
				plugins: []
			});
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the links export with the rdtStylesheet import when it's not an empty array", () => {
		const result = injectRdtClient(
			`
			export const links = () => [{ rel: "stylesheet", href: "rdtStylesheet.css" }];
			export default function App() {}`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withLinksWrapper as _withLinksWrapper, withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			export const links = _withLinksWrapper(() => [{ rel: "stylesheet", href: "rdtStylesheet.css" }], rdtStylesheet);
			export default _withViteDevTools(function App() {}, {
			config: { },
				plugins: []
			});
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the links export with the rdtStylesheet when it's a function export", () => {
		const result = injectRdtClient(
			`
			export function links() { return [{ rel: "stylesheet", href: "rdtStylesheet.css" }] };
			export default function App() {}`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withLinksWrapper as _withLinksWrapper, withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			export const links = _withLinksWrapper(function links() { return [{ rel: "stylesheet", href: "rdtStylesheet.css" }]; }, rdtStylesheet);;
			export default _withViteDevTools(function App() {}, {
			config: { },
				plugins: []
			});
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the links export with the rdtStylesheet if it's a function export and it's an empty array", () => {
		const result = injectRdtClient(
			`
			export function links() { return [] };
			export default function App() {}`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withLinksWrapper as _withLinksWrapper, withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			export const links = _withLinksWrapper(function links() { return []; }, rdtStylesheet);;
			export default _withViteDevTools(function App() {}, {
			config: { },
				plugins: []
			});
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the links export with the rdtStylesheet if it's wrapped with a higher order function", () => {
		const result = injectRdtClient(
			`
			export const links = hoc(() => [{ rel: "stylesheet", href: "rdtStylesheet.css" }]);
			function hoc(links) {
				return links;
			}
			export default function App() {}`,
			'{ "config": { }, "plugins": "[]" }',
			""
		)
		const expected = removeWhitespace(`
			import { withLinksWrapper as _withLinksWrapper, withViteDevTools as _withViteDevTools } from "react-router-devtools/client";
			import rdtStylesheet from "react-router-devtools/client.css?url";
			export const links = _withLinksWrapper(hoc(() => [{ rel: "stylesheet", href: "rdtStylesheet.css" }]), rdtStylesheet);
			function hoc(links) {
				return links;
			}
			export default _withViteDevTools(function App() {}, {
			config: { },
				plugins: []
			});
	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})
})
