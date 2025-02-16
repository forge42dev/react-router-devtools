
import type { MetaFunction , LoaderFunctionArgs, ClientLoaderFunctionArgs} from "react-router";
import { Link, useFetcher, useSubmit } from "react-router";
import { Button } from "../components/Button";
import * as ss from "~/utils/example";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export const loader = async ({ request, context,devTools, params  }: LoaderFunctionArgs) => {
  const d = await ss?.loader( );
  const trace =  devTools?.tracing.trace
  const data = await  trace?.("Loader call - GET users", async () => {

     const also = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("test");
      }, 2000);
    });
     return {
      custom: "data",
      also
     }
   })
  const test = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("test");
    }, 2000);
  });
  const test1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("test1");
    }, 3500);
  });
  return  { message: "Hello World!", test, test1, data, bigInt: BigInt(10) };
};

export const clientLoader =  async ({ request, serverLoader,  devTools }: ClientLoaderFunctionArgs) => {
  const headers = Object.fromEntries(request.headers.entries());
  const serverLoaderResults = await serverLoader();

  const trace = devTools?.tracing.trace
  const data = await trace?.("CLIENT LOADER API call",async () => {
    const also = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("test");
      }, 1000);
    });
    return {
      custom: "data",
      also
    }
  })
  const promise =await  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("test");
    }, 2000);
  });
  return serverLoaderResults
};
clientLoader.hydrate = true;

export default function Index() {
  const lFetcher = useFetcher({ key: "lfetcher"});
  const pFetcher = useFetcher({ key: "test"});
  const submit = useSubmit();
  const data = new FormData();
  data.append("test", "test");
  data.append("array", "test");
  data.append("array", "test1");
  data.append("person.name", "test1");
  data.append("person.surname", "test1");
  data.append("obj", JSON.stringify({ test: "test" }));
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <Button
        onClick={(e) => {
          console.log(e);
          lFetcher.submit(null, { method: "get", action: "/" })
        }}
      >
        FETCHER Loader
      </Button>
      <button
        onClick={() => pFetcher.submit(data, { method: "POST", action: "/" })}
      >
        FETCHER Action
      </button>
      <button onClick={() => submit(null, { method: "POST", action: "/" })}>
        SUBMIT Action
      </button>
      <button onClick={() => submit(data, { method: "PATCH", action: "/" })}>
        SUBMIT Action PATCH
      </button>
      <button onClick={() => submit(null, { method: "DELETE", action: "/" })}>
        SUBMIT Action DELETE
      </button>
      <button onClick={() => submit(null, { method: "PUT", action: "/" })}>
        SUBMIT Action PUT
      </button>

      <h2>Test Links</h2>

      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/file">File Route (file.tsx)</Link>
        </li>
        <li>
          <Link to="/folder">Folder Route (folder/route.tsx)</Link>
        </li>
      </ul>

      <h2>Resources</h2>

      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
