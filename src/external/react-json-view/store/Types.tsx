import { FC, PropsWithChildren, ComponentPropsWithoutRef, createContext, useContext, useReducer } from 'react';
import type { JSX } from 'react';
export type TagType = React.ElementType | keyof JSX.IntrinsicElements;

type TypesElementProps<T extends TagType> = {
  as?: T;
  render?: (props: TypesElement<T>, result: { type: 'type' | 'value'; value?: unknown }) => React.ReactNode;
  'data-type'?: string;
};

export type TypesElement<T extends TagType> = TypesElementProps<T> & ComponentPropsWithoutRef<T>;
export type InitialTypesState = {
  displayDataTypes?: boolean;
  Url?: TypesElement<TagType>;
  Str?: TypesElement<TagType>;
  Undefined?: TypesElement<TagType>;
  Null?: TypesElement<TagType>;
  True?: TypesElement<TagType>;
  False?: TypesElement<TagType>;
  Date?: TypesElement<TagType>;
  Float?: TypesElement<TagType>;
  Set?: TypesElement<TagType>;
  Int?: TypesElement<TagType>;
  Map?: TypesElement<TagType>;
  Nan?: TypesElement<TagType>;
  Bigint?: TypesElement<TagType>;
};
type Dispatch = React.Dispatch<InitialTypesState>;

const initialState: InitialTypesState = {
  Str: {
    as: 'span',
    'data-type': 'string',
    style: {
      color: 'var(--w-rjv-type-string-color, #cb4b16)',
    },
    className: 'w-rjv-type',
    children: 'string',
  },
  Url: {
    as: 'a',
    style: {
      color: 'var(--w-rjv-type-url-color, #0969da)',
    },
    'data-type': 'url',
    className: 'w-rjv-type',
    children: 'url',
  },
  Undefined: {
    style: {
      color: 'var(--w-rjv-type-undefined-color, #586e75)',
    },
    as: 'span',
    'data-type': 'undefined',
    className: 'w-rjv-type',
    children: 'undefined',
  },
  Null: {
    style: {
      color: 'var(--w-rjv-type-null-color, #d33682)',
    },
    as: 'span',
    'data-type': 'null',
    className: 'w-rjv-type',
    children: 'null',
  },
  Map: {
    style: {
      color: 'var(--w-rjv-type-map-color, #268bd2)',
    },
    as: 'span',
    'data-type': 'map',
    className: 'w-rjv-type',
    children: 'Map',
  },
  Nan: {
    style: {
      color: 'var(--w-rjv-type-nan-color, #859900)',
    },
    as: 'span',
    'data-type': 'nan',
    className: 'w-rjv-type',
    children: 'NaN',
  },
  Bigint: {
    style: {
      color: 'var(--w-rjv-type-bigint-color, #268bd2)',
    },
    as: 'span',
    'data-type': 'bigint',
    className: 'w-rjv-type',
    children: 'bigint',
  },
  Int: {
    style: {
      color: 'var(--w-rjv-type-int-color, #268bd2)',
    },
    as: 'span',
    'data-type': 'int',
    className: 'w-rjv-type',
    children: 'int',
  },
  Set: {
    style: {
      color: 'var(--w-rjv-type-set-color, #268bd2)',
    },
    as: 'span',
    'data-type': 'set',
    className: 'w-rjv-type',
    children: 'Set',
  },
  Float: {
    style: {
      color: 'var(--w-rjv-type-float-color, #859900)',
    },
    as: 'span',
    'data-type': 'float',
    className: 'w-rjv-type',
    children: 'float',
  },
  True: {
    style: {
      color: 'var(--w-rjv-type-boolean-color, #2aa198)',
    },
    as: 'span',
    'data-type': 'bool',
    className: 'w-rjv-type',
    children: 'bool',
  },
  False: {
    style: {
      color: 'var(--w-rjv-type-boolean-color, #2aa198)',
    },
    as: 'span',
    'data-type': 'bool',
    className: 'w-rjv-type',
    children: 'bool',
  },
  Date: {
    style: {
      color: 'var(--w-rjv-type-date-color, #268bd2)',
    },
    as: 'span',
    'data-type': 'date',
    className: 'w-rjv-type',
    children: 'date',
  },
};
const Context = createContext<InitialTypesState>(initialState);

const reducer = (state: InitialTypesState, action: InitialTypesState) => ({
  ...state,
  ...action,
});

export const useTypesStore = () => {
  return useContext(Context);
};

const DispatchTypes = createContext<Dispatch>(() => {});
DispatchTypes.displayName = 'JVR.DispatchTypes';

export function useTypes() {
  return useReducer(reducer, initialState);
}

export function useTypesDispatch() {
  return useContext(DispatchTypes);
}

interface TypesProps {
  initial: InitialTypesState;
  dispatch: Dispatch;
}

export const Types: FC<PropsWithChildren<TypesProps>> = ({ initial, dispatch, children }) => {
  return (
    <Context.Provider value={initial}>
      <DispatchTypes.Provider value={dispatch}>{children}</DispatchTypes.Provider>
    </Context.Provider>
  );
};

Types.displayName = 'JVR.Types';
