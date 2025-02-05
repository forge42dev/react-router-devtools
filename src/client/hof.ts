import type { ClientActionFunctionArgs, ClientLoaderFunctionArgs, LinksFunction } from "react-router"
import { convertBigIntToString } from "../shared/bigint-util"
import type { RequestEvent } from "../shared/request-event"

const sendEventToDevServer = (req: RequestEvent) => {
	if (req.data) {
		req.data = convertBigIntToString(req.data)
	}
	import.meta.hot?.send("request-event", req)
}

const analyzeClientLoaderOrAction = (
	loaderOrAction: (args: any) => Promise<any>,
	routeId: string,
	type: "client-loader" | "client-action"
) => {
	return async (args: ClientLoaderFunctionArgs | ClientActionFunctionArgs) => {
		const startTime = Date.now()
		const headers = Object.fromEntries(args.request.headers.entries())
		sendEventToDevServer({
			type,
			url: args.request.url,
			headers,
			startTime,
			id: routeId,
			method: args.request.method,
		})
		let aborted = false
		args.request.signal.addEventListener("abort", () => {
			aborted = true
			sendEventToDevServer({
				type,
				url: args.request.url,
				headers,
				startTime,
				endTime: Date.now(),
				id: routeId,
				method: args.request.method,
				aborted: true,
			})
		})

		const data = await loaderOrAction(args)
		if (!aborted) {
			sendEventToDevServer({
				type,
				url: args.request.url,
				headers,
				startTime,
				endTime: Date.now(),
				id: routeId,
				data,
				method: args.request.method,
			})
		}

		return data
	}
}

export const withClientLoaderWrapper = (clientLoader: (args: ClientLoaderFunctionArgs) => any, routeId: string) => {
	return analyzeClientLoaderOrAction(clientLoader, routeId, "client-loader")
}

export const withLinksWrapper = (links: LinksFunction, rdtStylesheet: string): LinksFunction => {
	return () => [...links(), { rel: "stylesheet", href: rdtStylesheet }]
}

export const withClientActionWrapper = (clientAction: (args: ClientActionFunctionArgs) => any, routeId: string) => {
	return analyzeClientLoaderOrAction(clientAction, routeId, "client-action")
}
