import ReactDOM from "react-dom";
import React from "react";

import { configureSeedHosts } from "./generator/configs";

import "antd/dist/antd.min.css";

configureSeedHosts({
  apiHost: "http://fe.jimu.io:11022",
});

import "main.css";

import { parseRoutePath } from "@jimengio/ruled-router";

import { routerRules } from "./models/router-rules";

import Container from "./pages/container";
import { GenRouterTypeMain } from "controller/generated-router";

const renderApp = () => {
  let routerTree = parseRoutePath(window.location.hash.slice(1), routerRules);

  ReactDOM.render(<Container router={routerTree as any} />, document.querySelector(".app"));
};

window.onload = renderApp;

window.addEventListener("hashchange", () => {
  renderApp();
});

declare var module: any;

if (module.hot) {
  module.hot.accept(["./pages/container"], () => {
    renderApp();
  });
}
