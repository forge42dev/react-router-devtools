import clsx from "clsx";
import { InjectedStyles, RemixDevToolsProps } from "./RemixDevTools";
import { useSettingsContext } from "./context/useRDTContext";
import { useOutletAugment } from "./hooks/useOutletAugment";
import { useSetRouteBoundaries } from "./hooks/useSetRouteBoundaries";
import { useTimelineHandler } from "./hooks/useTimelineHandler";
import { ContentPanel } from "./layout/ContentPanel";
import { MainPanel } from "./layout/MainPanel";
import { Tabs } from "./layout/Tabs";
import { REMIX_DEV_TOOLS } from "./utils/storage";
import { useLocation } from "@remix-run/react";
import { RDTContextProvider } from "./context/RDTContext";
import { useState, useEffect } from "react";

export interface EmbeddedDevToolsProps extends RemixDevToolsProps {
  mainPanelClassName?: string;
  className?: string;
}
const Embedded = ({ plugins, mainPanelClassName, className }: EmbeddedDevToolsProps) => {
  useTimelineHandler();
  useOutletAugment();
  useSetRouteBoundaries();
  const { settings } = useSettingsContext();
  const { position } = settings;
  const leftSideOriented = position.includes("left");
  return (
    <div id={REMIX_DEV_TOOLS} className={clsx("remix-dev-tools", className)}>
      <MainPanel className={mainPanelClassName} isEmbedded isOpen={true}>
        <Tabs plugins={plugins} />
        <ContentPanel leftSideOriented={leftSideOriented} plugins={plugins} />
      </MainPanel>
    </div>
  );
};

let hydrating = true;

function useHydrated() {
  const [hydrated, setHydrated] = useState(() => !hydrating);

  useEffect(function hydrate() {
    hydrating = false;
    setHydrated(true);
  }, []);

  return hydrated;
}

const EmbeddedDevTools = ({ requireUrlFlag, plugins, mainPanelClassName, className }: EmbeddedDevToolsProps) => {
  const hydrated = useHydrated();
  const url = useLocation().search;

  if (!hydrated) return null;
  if (requireUrlFlag && !url.includes("rdt=true")) return null;

  return (
    <RDTContextProvider>
      <InjectedStyles />
      <Embedded mainPanelClassName={mainPanelClassName} className={className} plugins={plugins} />
    </RDTContextProvider>
  );
};

export { EmbeddedDevTools };
