import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Project from "./Project";
import Error from "./Error";
import Instrument from "./Instrument/Instrument";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Project} exact />
        <Route
          path="/projects/:project_id/instruments/:id"
          component={Instrument}
          exact
        />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
