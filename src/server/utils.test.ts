import { waitFor } from "@testing-library/react"
import chalk from "chalk"
import { data } from "react-router"
import * as logger from "./logger"
import { diffInMs } from "./perf"
import {
	analyzeCache,
	analyzeClearSite,
	analyzeCookies,
	analyzeDeferred,
	analyzeServerTimings,
	errorHandler,
	extractHeadersFromResponseOrRequest,
	isDataFunctionResponse,
	logTrigger,
} from "./utils"
describe("analyzeCookies Test suite", () => {
	it("should return null if the config is set to silent", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: true,
		}
		const headers = new Headers()
		analyzeCookies("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should return null if the silent config option is set to false but cookies logs are set to false", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				cookies: false,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Set-Cookie", "test=true")
		analyzeCookies("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should log the cookie set by the server", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				cookies: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Set-Cookie", "test=true")
		analyzeCookies("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledWith(`🍪 Cookie set by ${chalk.blueBright("test")}`)
	})
})

describe("analyzeClearSite Test suite", () => {
	it("should return null if the config is set to silent", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: true,
		}
		const headers = new Headers()
		analyzeClearSite("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should return null if the silent config option is set to false but site clear logs are set to false", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				siteClear: false,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Clear-Site-Data", "test")
		analyzeClearSite("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should log the site cleared by the server", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				siteClear: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Clear-Site-Data", "something")
		analyzeClearSite("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledWith(
			`🧹 Site data cleared by ${chalk.blueBright("test")} ${chalk.green("[something]")}`
		)
	})
})

describe("analyzeCache Test suite", () => {
	it("should return null if the config is set to silent", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: true,
		}
		const headers = new Headers()
		analyzeCache("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should return null if the silent config option is set to false but cache logs are set to false", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				cache: false,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Cache-Control", "max-age=3600, s-maxage=600, private")
		analyzeCache("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should log the cache headers set by the server", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				cache: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Cache-Control", "max-age=3600, s-maxage=600, private")
		analyzeCache("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledWith(
			`📦 Route ${chalk.blueBright("test")} cached for ${chalk.green("10m")} ${chalk.green("[Shared Cache]")}`
		)
	})

	it("should log the cache headers set by the server with a custom max age", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				cache: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Cache-Control", "max-age=3600, s-maxage=600, private")
		analyzeCache("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledWith(
			`📦 Route ${chalk.blueBright("test")} cached for ${chalk.green("10m")} ${chalk.green("[Shared Cache]")}`
		)
	})

	it("should log the cache headers set by the server with a custom max age and s-maxage", () => {
		const loggerSpy = vi.spyOn(console, "log")
		const config = {
			logs: {
				cache: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Cache-Control", "max-age=3600, s-maxage=600, private")
		analyzeCache("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledTimes(2)
		expect(loggerSpy).nthCalledWith(
			1,
			`${chalk.blueBright.bold("INFO")} 📦 Route ${chalk.blueBright("test")} cached for ${chalk.green("1h")} ${chalk.green("[Private Cache]")}`
		)
		expect(loggerSpy).nthCalledWith(
			2,
			`${chalk.blueBright.bold("INFO")} 📦 Route ${chalk.blueBright("test")} cached for ${chalk.green("10m")} ${chalk.green("[Shared Cache]")}`
		)
	})

	it("should log the cache headers properly when max age is set and it's private", () => {
		const loggerSpy = vi.spyOn(console, "log")
		const config = {
			logs: {
				cache: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Cache-Control", "max-age=3600, private")
		analyzeCache("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledWith(
			`${chalk.blueBright.bold("INFO")} 📦 Route ${chalk.blueBright("test")} cached for ${chalk.green("1h")} ${chalk.green("[Private Cache]")}`
		)
	})

	it("should log the cache headers properly when max age is set and it's shared", () => {
		const loggerSpy = vi.spyOn(console, "log")
		const config = {
			logs: {
				cache: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Cache-Control", "max-age=3600, s-maxage=600")
		analyzeCache("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledWith(
			`${chalk.blueBright.bold("INFO")} 📦 Route ${chalk.blueBright("test")} cached for ${chalk.green("10m")} ${chalk.green("[Shared Cache]")}`
		)
	})

	it("should log only once when private is not set and s-maxage and max age are set", () => {
		vi.clearAllMocks()
		const loggerSpy = vi.spyOn(console, "log")

		const config = {
			logs: {
				cache: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Cache-Control", "s-maxage=600, max-age=3600")
		analyzeCache("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledTimes(1)
		expect(loggerSpy).toHaveBeenCalledWith(
			`${chalk.blueBright.bold("INFO")} 📦 Route ${chalk.blueBright("test")} cached for ${chalk.green("10m")} ${chalk.green("[Shared Cache]")}`
		)
	})
})

describe("analyzeServerTimings Test suite", () => {
	it("should return null if the config is set to silent", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: true,
		}
		const headers = new Headers()
		analyzeServerTimings("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should return null if the silent config option is set to false but server timings logs are set to false", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				serverTimings: false,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Server-Timing", "test")
		analyzeServerTimings("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should log the server timings set by the server when single entry", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				serverTimings: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Server-Timing", 'db;desc="test";dur=1000')
		analyzeServerTimings("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledWith(
			`⏰  Server timing for route ${chalk.blueBright("test")} - ${chalk.cyanBright("db")} ${chalk.green("[1000ms]")} ${chalk.yellow('["test"]')}`
		)
	})

	it("should log the server timings set by the server when multiple entries", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				serverTimings: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Server-Timing", 'db;desc="test";dur=1000, app;desc="test2";dur=2000')
		analyzeServerTimings("test", config, headers)
		expect(loggerSpy).nthCalledWith(
			1,
			`⏰  Server timing for route ${chalk.blueBright("test")} - ${chalk.cyanBright("db")} ${chalk.green("[1000ms]")} ${chalk.yellow('["test"]')}`
		)
		expect(loggerSpy).nthCalledWith(
			2,
			`⏰  Server timing for route ${chalk.blueBright("test")} - ${chalk.cyanBright("app")} ${chalk.green("[2000ms]")} ${chalk.yellow('["test2"]')}`
		)
	})

	it("should log in red each threshold that exceeds the config threshold", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				serverTimings: true,
			},
			serverTimingThreshold: 1100,
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Server-Timing", 'db;desc="test";dur=1000, app;desc="test2";dur=2000, third;desc="test";dur=1100')
		analyzeServerTimings("test", config, headers)
		expect(loggerSpy).nthCalledWith(
			1,
			`⏰  Server timing for route ${chalk.blueBright("test")} - ${chalk.cyanBright("db")} ${chalk.green("[1000ms]")} ${chalk.yellow('["test"]')}`
		)
		expect(loggerSpy).nthCalledWith(
			2,
			`⏰  Server timing for route ${chalk.blueBright("test")} - ${chalk.cyanBright("app")} ${chalk.redBright("[2000ms]")} ${chalk.yellow('["test2"]')}`
		)
		expect(loggerSpy).nthCalledWith(
			3,
			`⏰  Server timing for route ${chalk.blueBright("test")} - ${chalk.cyanBright("third")} ${chalk.redBright("[1100ms]")} ${chalk.yellow('["test"]')}`
		)
	})

	it("should not log a description if it's not set", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				serverTimings: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Server-Timing", "db;dur=1000")
		analyzeServerTimings("test", config, headers)
		expect(loggerSpy).toHaveBeenCalledWith(
			`⏰  Server timing for route ${chalk.blueBright("test")} - ${chalk.cyanBright("db")} ${chalk.green("[1000ms]")}`
		)
	})

	it("should not log anything if dur is not set", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				serverTimings: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Server-Timing", "db;desc=test")
		analyzeServerTimings("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should not log anything if name not set", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const config = {
			silent: false,
			logs: {
				serverTimings: true,
			},
		}
		process.rdt_config = config
		const headers = new Headers()
		headers.set("Server-Timing", "dur=1000")
		analyzeServerTimings("test", config, headers)
		expect(loggerSpy).not.toHaveBeenCalled()
	})
})

describe("analyzeDeferred Test suite", () => {
	it("should return null if the config is set to silent", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const start = performance.now()
		process.rdt_config = {
			silent: true,
		}
		const promise = new Promise((resolve) => {
			setTimeout(() => {
				resolve("test")
			}, 2000)
		})
		analyzeDeferred("test", start, { promise })
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should return null if the silent config option is set to false but defer logs are set to false", () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const start = performance.now()
		process.rdt_config = {
			silent: false,
			logs: {
				defer: false,
			},
		}
		const promise = new Promise((resolve) => {
			setTimeout(() => {
				resolve("test")
			}, 2000)
		})
		analyzeDeferred("test", start, { promise })
		expect(loggerSpy).not.toHaveBeenCalled()
	})

	it("should log the deferred object keys set by the server and then log when they are resolved", async () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const start = performance.now()
		process.rdt_config = {
			silent: false,
			logs: {
				defer: true,
			},
		}
		let end = 0
		const promise = new Promise((resolve) => {
			setTimeout(() => {
				end = diffInMs(start)
				resolve("test")
			}, 50)
		})
		analyzeDeferred("test", start, { promise })
		expect(loggerSpy).nthCalledWith(1, `Promises detected in ${chalk.blueBright("test")} - ${chalk.white("promise")}`)
		await waitFor(() => {
			expect(loggerSpy).toHaveBeenCalledTimes(2)
			expect(loggerSpy.mock.calls[1]?.[0]).toContain(
				`Promise ${chalk.white("promise")} resolved in ${chalk.blueBright("test")} - `
			)
		})
	})

	it("should log the deferred object keys set by the server and then log when they are rejected", async () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const errorSpy = vi.spyOn(logger, "errorLog")
		const start = performance.now()
		process.rdt_config = {
			silent: false,
			logs: {
				defer: true,
			},
		}
		let end = 0
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				end = diffInMs(start)
				reject("test")
			}, 50)
		})
		analyzeDeferred("test", start, { promise })
		expect(loggerSpy).nthCalledWith(1, `Promises detected in ${chalk.blueBright("test")} - ${chalk.white("promise")}`)
		await waitFor(() => {
			expect(errorSpy).toHaveBeenCalledTimes(2)
			expect(errorSpy.mock.calls[0]?.[0]).toContain(
				`Promise ${chalk.white("promise")} rejected in ${chalk.blueBright("test")}`
			)
			expect(errorSpy.mock.calls[1]?.[0]).toContain("test")
		})
	})

	it("should log nested deferred objects", async () => {
		const loggerSpy = vi.spyOn(logger, "infoLog")
		const start = performance.now()
		process.rdt_config = {
			silent: false,
			logs: {
				defer: true,
			},
		}
		let end = 0
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				end = diffInMs(start)
				resolve({
					test: "test",
					promise: new Promise((resolve) => {
						setTimeout(() => {
							resolve("test")
						}, 50)
					}),
				})
			}, 50)
		})
		analyzeDeferred("test", start, { promise })
		// Found promise keys in root object
		expect(loggerSpy).nthCalledWith(1, `Promises detected in ${chalk.blueBright("test")} - ${chalk.white("promise")}`)
		await waitFor(() => {
			expect(loggerSpy).toHaveBeenCalledTimes(4)
			// Resolved promise from root object
			expect(loggerSpy.mock.calls[1]?.[0]).toContain(
				`Promise ${chalk.white("promise")} resolved in ${chalk.blueBright("test")} - `
			)
			// Found promise keys in nested object
			expect(loggerSpy).nthCalledWith(
				3,
				`Promises detected in ${chalk.blueBright("test")} - ${chalk.white("promise.promise")}`
			)
			// Resolved promise from nested object
			expect(loggerSpy.mock.calls[3]?.[0]).toContain(
				`Promise ${chalk.white("promise.promise")} resolved in ${chalk.blueBright("test")} - `
			)
		})
	})
})

describe("logTrigger Test suite", () => {
	it("should log the loader log and the time it took to execute", () => {
		const loggerSpy = vi.spyOn(logger, "loaderLog")
		const start = performance.now()
		logTrigger("test", "loader", start)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} triggered - ${chalk.white(`${start}ms`)}`)
	})

	it("should log the action log and the time it took to execute", () => {
		const loggerSpy = vi.spyOn(logger, "actionLog")
		const start = performance.now()
		logTrigger("test", "action", start)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} triggered - ${chalk.white(`${start}ms`)}`)
	})
})

describe("errorHandler Test suite", () => {
	it("should log the error that happened and the error message from the error object", () => {
		const loggerSpy = vi.spyOn(logger, "errorLog")

		errorHandler("test", new Error("test"), false)
		expect(loggerSpy).nthCalledWith(1, `${chalk.blueBright("test")} threw an error!`)
		expect(loggerSpy).nthCalledWith(2, "test")
	})

	it("should also log if the error thrown was a string", () => {
		const loggerSpy = vi.spyOn(logger, "errorLog")
		errorHandler("test", "test", false)
		expect(loggerSpy).nthCalledWith(1, `${chalk.blueBright("test")} threw an error!`)
		expect(loggerSpy).nthCalledWith(2, "test")
	})

	it("should log the redirect location if it's set", () => {
		const loggerSpy = vi.spyOn(logger, "redirectLog")
		const headers = new Headers()
		headers.set("Location", "test")
		errorHandler("test", new Response("test", { status: 302, headers }), false)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} threw a response!`)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} redirected to ${chalk.green("test")}`)
	})

	it("should log the status code if it's set", () => {
		const loggerSpy = vi.spyOn(logger, "errorLog")
		const headers = new Headers()
		errorHandler("test", new Response("test", { status: 302, headers }), false)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} threw a response!`)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} responded with ${chalk.white("302")}`)
	})

	it("should log the redirect log if it's created with the data function", () => {
		const response = data({}, { status: 302, headers: { Location: "test" } })
		const loggerSpy = vi.spyOn(logger, "redirectLog")
		errorHandler("test", response, false)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} threw a response!`)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} redirected to ${chalk.green("test")}`)
	})

	it("should log the error log if it's created with the data function", () => {
		const response = data({}, { status: 500, headers: {} })
		const loggerSpy = vi.spyOn(logger, "errorLog")
		errorHandler("test", response, false)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} threw a response!`)
		expect(loggerSpy).toHaveBeenCalledWith(`${chalk.blueBright("test")} responded with ${chalk.white("500")}`)
	})
})

describe("extractHeadersFromResponseOrRequest Test suite", () => {
	it("should return null if the response is not a Response or Request", () => {
		expect(extractHeadersFromResponseOrRequest(null)).toBeNull()
	})

	it("should return null if the response is undefined", () => {
		expect(extractHeadersFromResponseOrRequest(undefined)).toBeNull()
	})

	it("should return null if response is a number", () => {
		expect(extractHeadersFromResponseOrRequest(123)).toBeNull()
	})

	it("should return the headers of the response if it's a Response", () => {
		const headers = new Headers()
		headers.set("test", "test")
		headers.set("Content-Type", "application/json")
		const response = new Response("test", { headers })
		expect(extractHeadersFromResponseOrRequest(response)).toEqual(Object.fromEntries(headers))
	})

	it("should return the headers of the request if it's a Request", () => {
		const headers = new Headers()
		headers.set("test", "test")
		const request = new Request("test", { headers })
		expect(extractHeadersFromResponseOrRequest(request)).toEqual(Object.fromEntries(headers))
	})

	it("should return the headers of the request if it's a data function response", () => {
		const headers = new Headers()
		headers.set("test", "test")
		const request = data({}, { headers })
		expect(extractHeadersFromResponseOrRequest(request)).toEqual(Object.fromEntries(headers))
	})
})

describe("isDataFunctionResponse Test suite", () => {
	it("should return true if the response is a data function response", () => {
		const response = data({}, { status: 200 })
		expect(isDataFunctionResponse(response)).toBeTruthy()
	})

	it("should return false if the response is not a data function response", () => {
		const response = {}
		expect(isDataFunctionResponse(response)).toBeFalsy()
	})
})
