import React, { JSX, PropsWithChildren, createContext, useContext, useEffect, useReducer } from 'react';
import { JsonViewProps } from './/index.js';
import { useShowTools, ShowTools } from './store/ShowTools.js';
import { useExpands, Expands } from './store/Expands.js';
import { useTypes, Types, type InitialTypesState, type TagType } from './store/Types.js';
import { useSymbols, Symbols } from './store/Symbols.js';
import { useSection, Section } from './store/Section.js';

type BlockTagType = keyof JSX.IntrinsicElements;

interface InitialState<T extends object> {
  value?: object;
  onExpand?: JsonViewProps<object>['onExpand'];
  onCopied?: JsonViewProps<object>['onCopied'];
  objectSortKeys?: JsonViewProps<T>['objectSortKeys'];
  displayObjectSize?: JsonViewProps<T>['displayObjectSize'];
  shortenTextAfterLength?: JsonViewProps<T>['shortenTextAfterLength'];
  enableClipboard?: JsonViewProps<T>['enableClipboard'];
  highlightUpdates?: JsonViewProps<T>['highlightUpdates'];
  collapsed?: JsonViewProps<T>['collapsed'];
  indentWidth?: number;
}

const initialState: InitialState<object> = {
  objectSortKeys: false,
  indentWidth: 15,
};

type Dispatch = React.Dispatch<InitialState<object>>;

const Context = createContext<InitialState<object>>(initialState);
Context.displayName = 'JVR.Context';

const DispatchContext = createContext<Dispatch>(() => {});
DispatchContext.displayName = 'JVR.DispatchContext';

function reducer(state: InitialState<object>, action: InitialState<object>): InitialState<object> {
  return {
    ...state,
    ...action,
  };
}

export const useStore = () => {
  return useContext(Context);
};

const useDispatchStore = () => {
  return useContext(DispatchContext);
};

interface ProviderProps {
  initialState?: InitialState<object>;
  initialTypes?: InitialTypesState;
}

export const Provider: React.FC<PropsWithChildren<ProviderProps>> = ({
  children,
  initialState: init,
  initialTypes,
}) => {
  const [state, dispatch] = useReducer(reducer, Object.assign({}, initialState, init));
  const [showTools, showToolsDispatch] = useShowTools();
  const [expands, expandsDispatch] = useExpands();
  const [types, typesDispatch] = useTypes();
  const [symbols, symbolsDispatch] = useSymbols();
  const [section, sectionDispatch] = useSection();
  useEffect(() => dispatch({ ...init }), [init]);
  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ShowTools initial={showTools} dispatch={showToolsDispatch}>
          <Expands initial={expands} dispatch={expandsDispatch}>
            <Types initial={{ ...types, ...initialTypes }} dispatch={typesDispatch}>
              <Symbols initial={symbols} dispatch={symbolsDispatch}>
                <Section initial={section} dispatch={sectionDispatch}>
                  {children}
                </Section>
              </Symbols>
            </Types>
          </Expands>
        </ShowTools>
      </DispatchContext.Provider>
    </Context.Provider>
  );
};

function useDispatch() {
  return useContext(DispatchContext);
}

Provider.displayName = 'JVR.Provider';
