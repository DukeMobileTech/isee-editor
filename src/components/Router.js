import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Project from "./Project/Project";
import Error from "./Error";
import Instrument from "./Instrument/Instrument";
import Bank from "./Bank";
import Projects from "./Project/Projects";
import ScoreSchemes from "./ScoreScheme/ScoreSchemes";
import Home from "./ScoreScheme/Home";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Projects} exact />
        <Route path="/projects/:project_id" component={Project} exact />
        <Route
          path="/projects/:project_id/instruments/:id"
          component={Instrument}
          exact
        />
        <Route
          path="/projects/:project_id/instruments/:instrument_id/score_schemes"
          component={ScoreSchemes}
          exact
        />
        <Route
          path="/projects/:project_id/instruments/:instrument_id/score_schemes/:id"
          component={Home}
          exact
        />
        <Route path="/banks/:tab?" component={Bank} exact />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
