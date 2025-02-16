import {
  ActionFunctionArgs,
  data,
  Form,
  Links,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { userSomething } from "./modules/user.server";


export const links = () => [];

export const loader = ({context, devTools }: LoaderFunctionArgs) => {
  userSomething();
  const mainPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const subPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("test");
        }, 2000);
      });
      resolve({ test: "test", subPromise});
    }, 2000);
  });
  const start =devTools?.tracing.start("test")!;
  devTools?.tracing.end("test", start);
  return  data({ message: "Hello World", mainPromise, bigInt: BigInt(10) }, { headers: { "Cache-Control": "max-age=3600, private" } });
}

export const action =async  ({devTools}: ActionFunctionArgs) => {
  const start = devTools?.tracing.start("action submission")
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("test");
    }, 2000);
  });
  devTools?.tracing.end("action submission", start!)
  return  ({ message: "Hello World", bigInt: BigInt(10) });
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
       <Form method="post">
        <input readOnly type="text" name="name" value={"name"} />
       <button type="submit">
          Submit
        </button>
       </Form>
        <Outlet />
        <ScrollRestoration />
        <Scripts />

      </body>
    </html>
  );
}
