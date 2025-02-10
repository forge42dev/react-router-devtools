import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { Trigger } from "./components/Trigger.js"
import { RDTContextProvider, type RdtClientConfig } from "./context/RDTContext.js"
import { useDetachedWindowControls, usePersistOpen, useSettingsContext } from "./context/useRDTContext.js"
import { useResetDetachmentCheck } from "./hooks/detached/useResetDetachmentCheck.js"
import { useSyncStateWhenDetached } from "./hooks/detached/useSyncStateWhenDetached.js"
import { useReactTreeListeners } from "./hooks/useReactTreeListeners.js"
import { useSetRouteBoundaries } from "./hooks/useSetRouteBoundaries.js"
import { useTimelineHandler } from "./hooks/useTimelineHandler.js"
import { ContentPanel } from "./layout/ContentPanel.js"
import { MainPanel } from "./layout/MainPanel.js"
import { Tabs } from "./layout/Tabs.js"
import type { Tab } from "./tabs/index.js"
import {
	REACT_ROUTER_DEV_TOOLS,
	REACT_ROUTER_DEV_TOOLS_DETACHED_OWNER,
	REACT_ROUTER_DEV_TOOLS_IS_DETACHED,
	setSessionItem,
	setStorageItem,
} from "./utils/storage.js"
import "../input.css"
import Inspector from "bippy/experiments/inspect"
import { useHotkeys } from "react-hotkeys-hook"
import type { RdtPlugin } from "../index.js"
import { Breakpoints } from "./components/Breakpoints.js"
import { LiveUrls } from "./components/LiveUrls.js"
import { useListenToRouteChange } from "./hooks/detached/useListenToRouteChange.js"
import { useDebounce } from "./hooks/useDebounce.js"
import { useDevServerConnection } from "./hooks/useDevServerConnection.js"
import { useOpenElementSource } from "./hooks/useOpenElementSource.js"
const recursivelyChangeTabIndex = (node: Element | HTMLElement, remove = true) => {
	if (remove) {
		node.setAttribute("tabIndex", "-1")
	} else {
		node.removeAttribute("tabIndex")
	}
	for (const child of node.children) {
		recursivelyChangeTabIndex(child, remove)
	}
}

const DevTools = ({ plugins: pluginArray }: ReactRouterDevtoolsProps) => {
	useTimelineHandler()
	useResetDetachmentCheck()
	useReactTreeListeners()
	useSetRouteBoundaries()
	useSyncStateWhenDetached()
	useDevServerConnection()
	useOpenElementSource()
	useListenToRouteChange()

	const { setPersistOpen } = usePersistOpen()
	const url = useLocation().search
	const { detachedWindowOwner, isDetached, setDetachedWindowOwner } = useDetachedWindowControls()
	const { settings } = useSettingsContext()
	const { persistOpen } = usePersistOpen()
	const { position } = settings
	const [isOpen, setIsOpen] = useState(isDetached || settings.defaultOpen || persistOpen)
	const leftSideOriented = position.includes("left")
	const plugins = pluginArray?.map((plugin) => (typeof plugin === "function" ? plugin() : plugin))
	const debounceSetOpen = useDebounce(() => {
		setIsOpen(!isOpen)
		setPersistOpen(!isOpen)
	}, 100)
	useHotkeys(settings.openHotkey, () => debounceSetOpen())
	useHotkeys("esc", () => (isOpen ? debounceSetOpen() : null))

	useEffect(() => {
		const el = document.getElementById(REACT_ROUTER_DEV_TOOLS)
		if (!el) return
		recursivelyChangeTabIndex(el, !isOpen)
	}, [isOpen])

	if (settings.requireUrlFlag && !url.includes(settings.urlFlag)) return null
	// If the dev tools are detached, we don't want to render the main panel
	if (detachedWindowOwner) {
		return (
			<div
				data-testid="react-router-devtools"
				id={REACT_ROUTER_DEV_TOOLS}
				className="react-router-dev-tools react-router-dev-tools-reset"
			>
				<Trigger
					isOpen={false}
					setIsOpen={() => {
						setDetachedWindowOwner(false)
						setStorageItem(REACT_ROUTER_DEV_TOOLS_IS_DETACHED, "false")
						setSessionItem(REACT_ROUTER_DEV_TOOLS_DETACHED_OWNER, "false")
					}}
				/>
			</div>
		)
	}

	return (
		<div
			data-testid="react-router-devtools"
			id={REACT_ROUTER_DEV_TOOLS}
			className="react-router-dev-tools react-router-dev-tools-reset"
		>
			<Trigger isOpen={isOpen} setIsOpen={setIsOpen} />
			<LiveUrls />
			<Breakpoints />
			<Inspector enabled={settings.enableInspector} />
			<MainPanel isOpen={isOpen}>
				<div className="flex h-full">
					<Tabs plugins={plugins} setIsOpen={setIsOpen} />
					<ContentPanel leftSideOriented={leftSideOriented} plugins={plugins} />
				</div>
			</MainPanel>
		</div>
	)
}

export interface ReactRouterDevtoolsProps {
	// Additional tabs to add to the dev tools
	plugins?: (Tab | RdtPlugin)[]
	config?: RdtClientConfig
}

const ReactRouterDevTools = ({ plugins, config }: ReactRouterDevtoolsProps) => {
	return (
		<RDTContextProvider config={config}>
			<DevTools plugins={plugins} />
		</RDTContextProvider>
	)
}

export { ReactRouterDevTools }
