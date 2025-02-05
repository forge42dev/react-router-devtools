import { bigIntReplacer } from "./bigint-util"
import type { RequestEvent } from "./request-event"

export const sendEvent = (event: RequestEvent) => {
	if (typeof process === "undefined") {
		return
	}
	const port = process.rdt_port

	if (port) {
		fetch(`http://localhost:${port}/react-router-devtools-request`, {
			method: "POST",
			body: JSON.stringify({ routine: "request-event", ...event }, bigIntReplacer),
		})
			.then(async (res) => {
				// avoid memory leaks
				if (res.ok) {
					await res.text()
				}
			})
			.catch(() => {})
	}
}
