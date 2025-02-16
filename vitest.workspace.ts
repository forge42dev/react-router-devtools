/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="vitest/config" />
/// <reference types="vitest/globals" />

import { defineWorkspace } from "vitest/config"

export default defineWorkspace([
	{
		test: {
			globals: true,
			environment: "happy-dom",
			exclude: ["**/node_modules/**", "**/dist/**", "**/docs/**", "**/public/**", "**/test-apps/**"],
			setupFiles: ["../../test/setup.tsx"],
			css: true,
			root: "./src/client",
			name: "react-router-devtools/client",
			// @ts-expect-error
			coverage: {
				provider: "v8",
				include: ["src/**/*"],
				reporter: ["text", "json-summary", "json", "html"],
				reportOnFailure: true,
				all: false,
				thresholds: {
					statements: 70,
					branches: 75,
					functions: 70,
					lines: 70,
				},
			},
		},
	},
	{
		test: {
			globals: true,
			exclude: ["**/node_modules/**", "**/dist/**", "**/docs/**", "**/public/**", "**/test-apps/**"],
			environment: "happy-dom",
			root: "./src/server",
			name: "react-router-devtools/server",
			// @ts-expect-error
			coverage: {
				provider: "v8",
				include: ["src/**/*"],
				reporter: ["text", "json-summary", "json", "html"],
				reportOnFailure: true,
				all: false,
				thresholds: {
					statements: 70,
					branches: 75,
					functions: 70,
					lines: 70,
				},
			},
		},
	},
	{
		test: {
			globals: true,
			exclude: ["**/node_modules/**", "**/dist/**", "**/docs/**", "**/public/**", "**/test-apps/**"],
			environment: "happy-dom",
			root: "./src/vite",
			name: "react-router-devtools/vite",
			// @ts-expect-error
			coverage: {
				provider: "v8",
				include: ["src/**/*"],
				reporter: ["text", "json-summary", "json", "html"],
				reportOnFailure: true,
				all: false,
				thresholds: {
					statements: 70,
					branches: 75,
					functions: 70,
					lines: 70,
				},
			},
		},
	},
	{
		test: {
			globals: true,
			exclude: ["**/node_modules/**", "**/dist/**", "**/docs/**", "**/public/**", "**/test-apps/**"],
			environment: "node",
			root: "./src/shared",
			name: "react-router-devtools/shared",
			// @ts-expect-error
			coverage: {
				provider: "v8",
				include: ["src/**/*"],
				reporter: ["text", "json-summary", "json", "html"],
				reportOnFailure: true,
				all: false,
				thresholds: {
					statements: 70,
					branches: 75,
					functions: 70,
					lines: 70,
				},
			},
		},
	},
])
