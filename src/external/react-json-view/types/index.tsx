import { FC, Fragment, PropsWithChildren, useState } from "react";
import { useTypesStore } from "../store/Types.js";
import { useStore } from "../store.js";
import { ValueQuote } from "../symbol/index.js";
import { Copied } from "../comps/Copied.js";


export const SetComp: FC<PropsWithChildren<{ value: unknown }>> = ({ value }) => {
  const { Set: Comp = {}, displayDataTypes } = useTypesStore();
  const isSet = value instanceof Set;
  if (!isSet || !displayDataTypes) return null;
  const { as, render, ...reset } = Comp;
  const isRender = render && typeof render === "function";
  const type = isRender && render(reset, { type: "type", value });
  if (type) return type;

  const Elm = as || "span";
  return <Elm {...reset} />;
};

SetComp.displayName = "JVR.SetComp";

export const MapComp: FC<PropsWithChildren<{ value: unknown }>> = ({ value }) => {
  const { Map: Comp = {}, displayDataTypes } = useTypesStore();
  const isMap = value instanceof Map;
  if (!isMap || !displayDataTypes) return null;
  const { as, render, ...reset } = Comp;
  const isRender = render && typeof render === "function";
  const type = isRender && render(reset, { type: "type", value });
  if (type) return type;

  const Elm = as || "span";
  return <Elm {...reset} />;
};

MapComp.displayName = "JVR.MapComp";

const defalutStyle: React.CSSProperties = {
  opacity: 0.75,
  paddingRight: 4,
};

type TypeProps = PropsWithChildren<{
  expandKey: string;
  keyName: string | number;
}>;

export const TypeString: FC<TypeProps> = ({ children = "", expandKey, keyName }) => {
  const { Str = {}, displayDataTypes } = useTypesStore();
  const { shortenTextAfterLength: length = 30 } = useStore();
  const { as, render, ...reset } = Str;
  const childrenStr = children as string;
  const [shorten, setShorten] = useState(length && childrenStr.length >= length);
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Str.style || {}),
  };

  if (length > 0) {
    reset.style = {
      ...reset.style,
      cursor: childrenStr.length <= length ? "initial" : "pointer",
    };
    if (childrenStr.length > length) {
      reset.onClick = () => {
        setShorten(!shorten);
      };
    }
  }
  const text = shorten ? `${childrenStr.slice(0, length)}...` : childrenStr;

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender && render({ ...reset, children: text, className: "w-rjv-value" }, { type: "value", value: children });
  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Fragment>
          <ValueQuote />
          <Comp {...reset} className="w-rjv-value">
            {text}
          </Comp>
          <ValueQuote />
        </Fragment>
      )}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeString.displayName = "JVR.TypeString";

export const TypeTrue: FC<TypeProps> = ({ children, expandKey, keyName }) => {
  const { True = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = True;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(True.style || {}),
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender && render({ ...reset, children, className: "w-rjv-value" }, { type: "value", value: children });
  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {children?.toString()}
        </Comp>
      )}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeTrue.displayName = "JVR.TypeTrue";

export const TypeFalse: FC<TypeProps> = ({ children, expandKey, keyName }) => {
  const { False = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = False;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(False.style || {}),
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender && render({ ...reset, children, className: "w-rjv-value" }, { type: "value", value: children });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {children?.toString()}
        </Comp>
      )}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeFalse.displayName = "JVR.TypeFalse";

export const TypeFloat: FC<TypeProps> = ({ children, expandKey, keyName }) => {
  const { Float = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Float;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Float.style || {}),
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender && render({ ...reset, children, className: "w-rjv-value" }, { type: "value", value: children });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {children?.toString()}
        </Comp>
      )}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeFloat.displayName = "JVR.TypeFloat";

export const TypeInt: FC<TypeProps> = ({ children, expandKey, keyName }) => {
  const { Int = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Int;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Int.style || {}),
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender && render({ ...reset, children, className: "w-rjv-value" }, { type: "value", value: children });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {children?.toString()}
        </Comp>
      )}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeInt.displayName = "JVR.TypeInt";

export const TypeBigint: FC<{ children?: bigint } & Omit<TypeProps, "children">> = ({
  children,
  expandKey,
  keyName,
}) => {
  const { Bigint: CompBigint = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = CompBigint;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(CompBigint.style || {}),
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender && render({ ...reset, children, className: "w-rjv-value" }, { type: "value", value: children });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {children?.toString() + "n"}
        </Comp>
      )}
      <Copied keyName={keyName} value={children as any} expandKey={expandKey} />
    </Fragment>
  );
};

TypeBigint.displayName = "JVR.TypeFloat";

export const TypeUrl: FC<{ children?: URL } & Omit<TypeProps, "children">> = ({ children, expandKey, keyName }) => {
  const { Url = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Url;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...Url.style,
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender &&
    render({ ...reset, children: children?.href, className: "w-rjv-value" }, { type: "value", value: children });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <a href={children?.href} target="_blank" {...reset} className="w-rjv-value">
          <ValueQuote />
          {children?.href}
          <ValueQuote />
        </a>
      )}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeUrl.displayName = "JVR.TypeUrl";

export const TypeDate: FC<{ children?: Date } & Omit<TypeProps, "children">> = ({ children, expandKey, keyName }) => {
  const { Date: CompData = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = CompData;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(CompData.style || {}),
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const childStr = children?.toString();
  const child =
    isRender && render({ ...reset, children: childStr, className: "w-rjv-value" }, { type: "value", value: children });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child || (
        <Comp {...reset} className="w-rjv-value">
          {childStr}
        </Comp>
      )}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeDate.displayName = "JVR.TypeDate";

export const TypeUndefined: FC<TypeProps> = ({ children, expandKey, keyName }) => {
  const { Undefined = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Undefined;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Undefined.style || {}),
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender && render({ ...reset, children, className: "w-rjv-value" }, { type: "value", value: children });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeUndefined.displayName = "JVR.TypeUndefined";

export const TypeNull: FC<TypeProps> = ({ children, expandKey, keyName }) => {
  const { Null = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Null;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Null.style || {}),
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender && render({ ...reset, children, className: "w-rjv-value" }, { type: "value", value: children });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeNull.displayName = "JVR.TypeNull";

export const TypeNan: FC<TypeProps> = ({ children, expandKey, keyName }) => {
  const { Nan = {}, displayDataTypes } = useTypesStore();
  const { as, render, ...reset } = Nan;
  const Comp = as || "span";
  const style: React.CSSProperties = {
    ...defalutStyle,
    ...(Nan.style || {}),
  };

  const isRender = render && typeof render === "function";
  const type = isRender && render({ ...reset, style }, { type: "type", value: children });
  const child =
    isRender &&
    render({ ...reset, children: children?.toString(), className: "w-rjv-value" }, { type: "value", value: children });

  return (
    <Fragment>
      {displayDataTypes && (type || <Comp {...reset} style={style} />)}
      {child}
      <Copied keyName={keyName} value={children as object} expandKey={expandKey} />
    </Fragment>
  );
};

TypeNan.displayName = "JVR.TypeNan";
