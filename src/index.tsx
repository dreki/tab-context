import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
import app from "./App";
import reportWebVitals from "./reportWebVitals";

/* 
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
    <App />
    </React.StrictMode>
    );
    */

// If we're on the main UI page, render the main UI.
const mainUIRootElement = document.getElementById(
  "main-ui-root"
) as HTMLElement;
if (mainUIRootElement) {
  // Inject CSS into the main UI page. Use process.env.PUBLIC_URL to get the
  // public URL of the app. Use that to get the path to the CSS file.
  /*   const style = document.createElement("style")
  style.innerHTML = `
  @import url('${process.env.PUBLIC_URL}/main-ui.css');
  `;
  document.head.appendChild(style); */

  const mainUIRoot = ReactDOM.createRoot(mainUIRootElement);
  mainUIRoot.render(
    <React.StrictMode>
      {/* <App /> */}
      {app}
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
