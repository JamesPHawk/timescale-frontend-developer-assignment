import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App";
import { Provider } from "./components/ui/provider";
import recipientsData from "./assets/recipientsData.json";

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(
  <React.StrictMode>
    <Provider>
      <App users={recipientsData}/>
    </Provider>
  </React.StrictMode>
);
