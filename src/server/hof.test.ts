import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"
import { withActionWrapper, withLoaderWrapper } from "./hof"
import { actionLog, loaderLog } from "./logger"

describe("withLoaderWrapper", () => {
	beforeAll(() => {
		process.rdt_config = {
			silent: false,
		}
	})

	afterAll(() => {
		process.rdt_config = {}
	})

	it("should return a function that returns a Promise", () => {
		const request = new Request("http://localhost:3000")
		const loader = async () => {
			return "test"
		}
		const wrapped = withLoaderWrapper(loader, "test")
		expect(wrapped({ request, params: {} }) instanceof Promise).toBe(true)
	})

	it("should return a function that resolves to the expected value", async () => {
		const request = new Request("http://localhost:3000")
		const loader = async () => {
			return "test"
		}
		const wrapped = withLoaderWrapper(loader, "test")
		const result = await wrapped({ request, params: {} })
		expect(result).toBe("test")
	})

	it("should execute in roughly the same time as the original loader [allow 10ms variance]", async () => {
		const request = new Request("http://localhost:3000")
		const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
		const start = performance.now()
		const loader = async () => {
			await sleep(100)
			return "test"
		}
		await loader()
		const end = performance.now()
		const originalTime = end - start

		const wrapped = withLoaderWrapper(loader, "test")
		const wrappedStart = performance.now()
		await wrapped({ request, params: {} })
		const wrappedEnd = performance.now()
		const wrappedTime = wrappedEnd - wrappedStart
		// Allow for some variance in execution time
		expect(wrappedTime - originalTime).toBeLessThan(30)
	})

	it("should get the params and the request object passed down properly", async () => {
		const request = new Request("http://localhost:3000/test")
		const loader = async ({ request, params }: LoaderFunctionArgs) => {
			expect(request).toBeInstanceOf(Request)
			expect(request.url).toBe("http://localhost:3000/test")
			expect(params).toEqual({ test: "test" })
			return "test"
		}
		const wrapped = withLoaderWrapper(loader, "test")
		await wrapped({ request, params: { test: "test" } })
	})

	it("should log the loader trigger and the time it took to execute", async () => {
		const request = new Request("http://localhost:3000")
		const consoleSpy = vi.spyOn(console, "log")
		const loader = async () => {
			return "test"
		}
		const wrapped = withLoaderWrapper(loader, "test")
		await wrapped({ request, params: {} })
		expect(consoleSpy).toHaveBeenCalledWith(loaderLog("test triggered -"))
	})

	it("should not log the loader trigger if the config is set to silent", async () => {
		process.rdt_config = {
			silent: true,
		}
		const request = new Request("http://localhost:3000")
		vi.clearAllMocks()
		const consoleSpy = vi.spyOn(console, "log")
		const loader = async () => {
			return "test"
		}
		const wrapped = withLoaderWrapper(loader, "test")
		await wrapped({ request, params: {} })
		expect(consoleSpy).not.toHaveBeenCalledWith(loaderLog("test triggered -"))
	})

	it("should not log the loader trigger if the silent config option is set to false but loader is set to true", async () => {
		process.rdt_config = {
			silent: false,
			logs: {
				loaders: true,
			},
		}
		const request = new Request("http://localhost:3000")
		const consoleSpy = vi.spyOn(console, "log")
		const loader = async () => {
			return "test"
		}
		const wrapped = withLoaderWrapper(loader, "test")
		await wrapped({ request, params: {} })
		expect(consoleSpy).toHaveBeenCalledWith(loaderLog("test triggered -"))
	})
})

describe("withActionWrapper", () => {
	beforeAll(() => {
		process.rdt_config = {
			silent: false,
		}
	})

	afterAll(() => {
		process.rdt_config = {}
	})

	it("should return a function that returns a Promise", () => {
		const request = new Request("http://localhost:3000")
		const action = async () => {
			return "test"
		}
		const wrapped = withActionWrapper(action, "test")
		expect(wrapped({ request, params: {} }) instanceof Promise).toBe(true)
	})

	it("should return a function that resolves to the expected value", async () => {
		const request = new Request("http://localhost:3000")
		const action = async () => {
			return "test"
		}
		const wrapped = withActionWrapper(action, "test")
		const result = await wrapped({ request, params: {} })
		expect(result).toBe("test")
	})

	it("should execute in roughly the same time as the original action [allow 10ms variance]", async () => {
		const request = new Request("http://localhost:3000")
		const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
		const start = performance.now()
		const action = async () => {
			await sleep(100)
			return "test"
		}
		await action()
		const end = performance.now()
		const originalTime = end - start

		const wrapped = withActionWrapper(action, "test")
		const wrappedStart = performance.now()
		await wrapped({ request, params: {} })
		const wrappedEnd = performance.now()
		const wrappedTime = wrappedEnd - wrappedStart
		// Allow for some variance in execution time
		expect(wrappedTime - originalTime).toBeLessThan(30)
	})

	it("should get the params and the request object passed down properly", async () => {
		const request = new Request("http://localhost:3000/test")
		const action = async ({ request, params }: ActionFunctionArgs) => {
			expect(request).toBeInstanceOf(Request)
			expect(request.url).toBe("http://localhost:3000/test")
			expect(params).toEqual({ test: "test" })
			return "test"
		}
		const wrapped = withActionWrapper(action, "test")
		await wrapped({ request, params: { test: "test" } })
	})

	it("should log the action trigger and the time it took to execute", async () => {
		const request = new Request("http://localhost:3000")
		const consoleSpy = vi.spyOn(console, "log")
		const action = async () => {
			return "test"
		}
		const wrapped = withActionWrapper(action, "test")
		await wrapped({ request, params: {} })
		expect(consoleSpy).toHaveBeenCalledWith(actionLog("test triggered -"))
	})

	it("should not log the action trigger if the config is set to silent", async () => {
		process.rdt_config = {
			silent: true,
		}
		const request = new Request("http://localhost:3000")
		vi.clearAllMocks()
		const consoleSpy = vi.spyOn(console, "log")
		const action = async () => {
			return "test"
		}
		const wrapped = withActionWrapper(action, "test")
		await wrapped({ request, params: {} })
		expect(consoleSpy).not.toHaveBeenCalledWith(actionLog("test triggered -"))
	})

	it("should not log the action trigger if the silent config option is set to false but action is set to true", async () => {
		process.rdt_config = {
			silent: false,
			logs: {
				actions: true,
			},
		}
		const request = new Request("http://localhost:3000")
		const consoleSpy = vi.spyOn(console, "log")
		const action = async () => {
			return "test"
		}
		const wrapped = withActionWrapper(action, "test")
		await wrapped({ request, params: {} })
		expect(consoleSpy).toHaveBeenCalledWith(actionLog("test triggered -"))
	})
})
