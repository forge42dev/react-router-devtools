import chalk from "chalk"
import { parse } from "es-module-lexer"
import { type Plugin, normalizePath } from "vite"
import type { RdtClientConfig } from "../client/context/RDTContext.js"
import { cutArrayToLastN } from "../client/utils/common.js"
import type { DevToolsServerConfig } from "../server/config.js"
import type { ActionEvent, LoaderEvent } from "../server/event-queue.js"

import type { RequestEvent } from "../server/utils.js"
import { DEFAULT_EDITOR_CONFIG, type EditorConfig, type OpenSourceData, handleOpenSource } from "./editor.js"
import { type WriteFileData, handleWriteFile } from "./file.js"
import { transformCode } from "./network-tracer.js"
import { handleDevToolsViteRequest, processPlugins } from "./utils.js"

// this should mirror the types in server/config.ts as well as they are bundled separately.
declare global {
	interface Window {
		RDT_MOUNTED: boolean
	}
	namespace NodeJS {
		interface Process {
			rdt_config: DevToolsServerConfig
			rdt_port: number
		}
	}
}

const routeInfo = new Map<string, { loader: LoaderEvent[]; action: ActionEvent[] }>()
const unusedEvents = new Map<string, RequestEvent>()

type ReactRouterViteConfig = {
	client?: Partial<RdtClientConfig>
	server?: DevToolsServerConfig
	pluginDir?: string
	includeInProd?: boolean
	improvedConsole?: boolean
	/** The directory where the react router app is located. Defaults to the "./app" relative to where vite.config is being defined. */
	appDir?: string
	editor?: EditorConfig
	/**
	 * If the package is marked as deprecated, a warning will be logged in the console
	 * To disable this warning, set the option to true
	 * @default false
	 */
	suppressDeprecationWarning?: boolean
}

export const defineRdtConfig = (config: ReactRouterViteConfig) => config

export const reactRouterDevTools: (args?: ReactRouterViteConfig) => Plugin[] = (args) => {
	const serverConfig = args?.server || {}
	const clientConfig = {
		...args?.client,
		editorName: args?.editor?.name,
	}

	const include = args?.includeInProd ?? false
	const improvedConsole = args?.improvedConsole ?? true
	const appDir = args?.appDir || "./app"

	const shouldInject = (mode: string | undefined) => mode === "development" || include

	// Set the server config on the process object so that it can be accessed by the plugin
	if (typeof process !== "undefined") {
		process.rdt_config = serverConfig
	}
	return [
		{
			enforce: "pre",
			name: "react-router-devtools-client-data-augment",
			apply(config) {
				return config.mode === "development"
			},
			transform(code, id) {
				if (id.includes("node_modules") || id.includes("dist") || id.includes("build") || id.includes("?")) {
					return
				}

				const routeId = id.replace(normalizePath(process.cwd()), "").replace("/app/", "").replace(".tsx", "")

				const finalCode = transformCode(code, routeId)
				return finalCode
				/* let modified = code
				if (code.includes("export const clientLoader")) {
					modified = `${modified.replace("export const clientLoader", "const __clientLoader")}\n\n
					export const clientLoader = async (args) => {
						const startTime = Date.now();
						const headers = Object.fromEntries(args.request.headers.entries());
						import.meta.hot.send('request-event',{ type: 'client-loader', url: args.request.url, headers, startTime, id: "${routeId}",  method: args.request.method  });
						const data = await __clientLoader(args);
						import.meta.hot.send('request-event',{ type: 'client-loader', url: args.request.url, headers, startTime, endTime: Date.now(),  id: "${routeId}",  data,  method: args.request.method });
						return data;
					};\n`
					if (modified.includes("clientLoader.hydrate = true")) {
						modified = modified.replace("clientLoader.hydrate = true", "").concat("clientLoader.hydrate = true;\n")
					}
					if (modified.includes("clientLoader.hydrate = false")) {
						modified = modified.replace("clientLoader.hydrate = false", "").concat("clientLoader.hydrate = false;\n")
					}
				}

				if (code.includes("export const clientAction")) {
					modified = `${modified.replace("export const clientAction", "const __clientAction")}\n\n
					export const clientAction = async (args) => {
						const startTime = Date.now();
						const headers = Object.fromEntries(args.request.headers.entries());
						import.meta.hot.send('request-event',{ type: 'client-action', url: args.request.url, headers, startTime, id: "${routeId}",  method: args.request.method  });
						const data = await __clientAction(args);
						import.meta.hot.send('request-event',{ type: 'client-action', url: args.request.url, headers, startTime, endTime: Date.now(),  id: "${routeId}",  data, method: args.request.method
						 });
						return data;
					};\n`
				}
				return modified */
			},
		},
		{
			enforce: "pre",
			name: "react-router-devtools-server",
			apply(config) {
				return config.mode === "development"
			},
			async configureServer(server) {
				if (server.config.appType !== "custom") {
					return
				}
				server.httpServer?.on("listening", () => {
					process.rdt_port = server.config.server.port ?? 5173
				})
				const channel = server.hot.channels.find((channel) => channel.name === "ws")
				server.middlewares.use((req, res, next) =>
					handleDevToolsViteRequest(req, res, next, (parsedData) => {
						const { type, data, routine } = parsedData
						if (routine === "request-event") {
							//	console.log("route id", parsedData.id)
							unusedEvents.set(parsedData.id + parsedData.startTime, parsedData)
							//	console.log(unusedEvents.keys())
							for (const client of server.hot.channels) {
								if (client.name === "ws") {
									client.send("request-event", JSON.stringify(parsedData))
								}
							}

							return
						}
						const id = data.id
						const existingData = routeInfo.get(id)
						if (existingData) {
							if (type === "loader") {
								existingData.loader = cutArrayToLastN([...existingData.loader, data], 30)
							}
							if (type === "action") {
								existingData.action = cutArrayToLastN([...existingData.action, data], 30)
							}
						} else {
							if (type === "loader") {
								routeInfo.set(id, { loader: [data], action: [] })
							}
							if (type === "action") {
								routeInfo.set(id, { loader: [], action: [data] })
							}
						}
						for (const client of server.hot.channels) {
							if (client.name === "ws") {
								client.send("route-info", JSON.stringify({ type, data }))
							}
						}
					})
				)

				server.hot.on("all-route-info", (data, client) => {
					client.send(
						"all-route-info",
						JSON.stringify({
							type: "all-route-info",
							data: Object.fromEntries(routeInfo.entries()),
						})
					)
				})

				if (!server.config.isProduction) {
					channel?.on("remove-event", (data, client) => {
						const parsedData = data
						const { id, startTime, fromClient } = parsedData
						//	console.log("remove event", id, fromClient)
						unusedEvents.delete(id + startTime)
					})
					channel?.on("get-events", (_, client) => {
						const events = Array.from(unusedEvents.values())
						/* 	console.log(
							"get events",
							events.map((e) => e.id)
						) */
						if (events) {
							client.send("get-events", JSON.stringify(events))
						}
					})
					channel?.on("request-event", (data, client) => {
						//	console.log("request event", data.id)
						unusedEvents.set(data.id + data.startTime, data)
						client.send(
							"request-event",
							JSON.stringify({
								type: "request-event",
								data: data,
								...data,
							})
						)
					})
					const editor = args?.editor ?? DEFAULT_EDITOR_CONFIG
					const openInEditor = (path: string | undefined, lineNum: string | undefined) => {
						if (!path) {
							return
						}
						editor.open(path, lineNum)
					}

					server.hot.on("open-source", (data: OpenSourceData) => handleOpenSource({ data, openInEditor, appDir }))
					server.hot.on("add-route", (data: WriteFileData) => handleWriteFile({ ...data, openInEditor }))
				}
			},
		},
		...(improvedConsole
			? [
					{
						name: "better-console-logs",
						enforce: "pre",
						apply(config) {
							return config.mode === "development"
						},
						async transform(code, id) {
							// Ignore anything external
							if (
								id.includes("node_modules") ||
								id.includes("?raw") ||
								id.includes("dist") ||
								id.includes("build") ||
								!id.includes("app")
							)
								return

							if (code.includes("console.")) {
								const lines = code.split("\n")
								return lines
									.map((line, lineNumber) => {
										if (line.trim().startsWith("//") || line.trim().startsWith("/**") || line.trim().startsWith("*")) {
											return line
										}
										// Do not add for arrow functions or return statements
										if (line.replaceAll(" ", "").includes("=>console.") || line.includes("return console.")) {
											return line
										}

										const column = line.indexOf("console.")
										const logMessage = `"${chalk.magenta("LOG")} ${chalk.blueBright(`${id.replace(normalizePath(process.cwd()), "")}:${lineNumber + 1}:${column + 1}`)}\\n → "`
										if (line.includes("console.log(")) {
											const newLine = `console.log(${logMessage},`
											return line.replace("console.log(", newLine)
										}
										if (line.includes("console.error(")) {
											const newLine = `console.error(${logMessage},`
											return line.replace("console.error(", newLine)
										}
										return line
									})
									.join("\n")
							}
						},
					} satisfies Plugin,
				]
			: []),
		{
			name: "react-router-devtools",
			apply(config) {
				return shouldInject(config.mode)
			},
			async configResolved(resolvedViteConfig) {
				const reactRouterIndex = resolvedViteConfig.plugins.findIndex((p) => p.name === "react-router")
				const devToolsIndex = resolvedViteConfig.plugins.findIndex((p) => p.name === "react-router-devtools")

				if (reactRouterIndex >= 0 && devToolsIndex > reactRouterIndex) {
					throw new Error("react-router-devtools plugin has to be before the react-router plugin!")
				}
			},
			async transform(code, id) {
				const pluginDir = args?.pluginDir || undefined
				const plugins = pluginDir && process.env.NODE_ENV === "development" ? await processPlugins(pluginDir) : []
				const pluginNames = plugins.map((p) => p.name)
				// Wraps loaders/actions
				if (id.includes("virtual:react-router/server-build") && process.env.NODE_ENV === "development") {
					return code
					/* 	const updatedCode = [
						`import { augmentLoadersAndActions } from "react-router-devtools/server";`,
						code.replace("export const routes =", "const routeModules ="),
						"export const routes = augmentLoadersAndActions(routeModules);",
					].join("\n")

					return updatedCode */
				}
				if (id.endsWith("/root.tsx") || id.endsWith("/root.jsx")) {
					const [, exports] = parse(code)
					const exportNames = exports.map((e) => e.n)
					const hasLinksExport = exportNames.includes("links")
					const lines = code.split("\n")

					const imports = [
						'import { withViteDevTools } from "react-router-devtools/client";',
						'import rdtStylesheet from "react-router-devtools/client.css?url";',
						plugins.map((plugin) => `import { ${plugin.name} } from "${plugin.path}";`).join("\n"),
					]

					const augmentedLinksExport = hasLinksExport
						? `export const links = () => [...linksExport(), { rel: "stylesheet", href: rdtStylesheet }];`
						: `export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];`

					const augmentedDefaultExport = `export default withViteDevTools(AppExport, { config: ${JSON.stringify(clientConfig)}, plugins: [${pluginNames.join(
						","
					)}] })();`

					const updatedCode = lines.map((line) => {
						// Handles default export augmentation
						if (line.includes("export default function")) {
							const exportName = line.split("export default function ")[1].split("(")[0].trim()
							const newLine = line.replace(`export default function ${exportName}`, "function AppExport")
							return newLine
						}
						if (line.includes("export default")) {
							const newline = line.replace("export default", "const AppExport =")
							return newline
						}
						// Handles links export augmentation
						if (line.includes("export const links")) {
							return line.replace("export const links", "const linksExport")
						}
						if (line.includes("export let links")) {
							return line.replace("export let links", "const linksExport")
						}
						if (line.includes("export function links")) {
							return line.replace("export function links", "function linksExport")
						}
						// export { links } from "/app/root.tsx" variant
						if (line.includes("export {") && line.includes("links") && line.includes("/app/root")) {
							return line.replace("links", "links as linksExport")
						}
						return line
					})
					// Returns the new code
					return [...imports, ...updatedCode, augmentedLinksExport, augmentedDefaultExport].join("\n")
				}
			},
		},
	]
}
