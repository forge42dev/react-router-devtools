import { useLocation } from "@remix-run/react";
import { useContext, useEffect } from "react";
import { RDTContext, getExistingStateFromStorage } from "../../context/RDTContext";
import { REMIX_DEV_TOOLS_SETTINGS, REMIX_DEV_TOOLS_STATE } from "../../utils/storage";
import { useAttachListener } from "../useAttachListener";
import { useCheckIfStillDetached } from "./useCheckIfStillDetached";
import { getRouteFromLocalStorage, setRouteInLocalStorage } from "./useListenToRouteChange";

const refreshRequiredKeys = [REMIX_DEV_TOOLS_SETTINGS, REMIX_DEV_TOOLS_STATE];

export const useRefreshDetachedPanel = () => {
  const { dispatch, state } = useContext(RDTContext);
  const location = useLocation();
  const route = getRouteFromLocalStorage();

  useEffect(() => {
    if (route !== location.pathname && state.detachedWindowOwner) {
      setRouteInLocalStorage(location.pathname);
    }
  }, [location.pathname, state.detachedWindowOwner, route]);

  useAttachListener("storage", "window", (e: any) => {
    // Not caused by the dev tools
    if (!refreshRequiredKeys.includes(e.key)) {
      return;
    }
    // Check if the settings have not changed and early return
    if (e.key === REMIX_DEV_TOOLS_SETTINGS) {
      const oldSettings = JSON.stringify(state.settings);
      if (oldSettings === e.newValue) {
        return;
      }
    }
    // Check if the state has not changed and early return
    if (e.key === REMIX_DEV_TOOLS_STATE) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { settings, ...rest } = state;
      const oldState = JSON.stringify(rest);
      if (oldState === e.newValue) {
        return;
      }
    }

    // store new state
    const newState = getExistingStateFromStorage();
    dispatch({ type: "SET_WHOLE_STATE", payload: newState });
  });
  useCheckIfStillDetached();
};
