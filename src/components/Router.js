import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Project from "./Project/Project";
import Error from "./Error";
import Instrument from "./Instrument/Instrument";
import ScoreScheme from "./ScoreScheme/ScoreScheme";
import Bank from "./Bank";
import Survey from "./Survey";
import Responses from "./Survey/Responses";
import Projects from "./Project/Projects";

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
          path="/projects/:project_id/instruments/:instrument_id/score_schemes/:id"
          component={ScoreScheme}
          exact
        />
        <Route path="/banks/:tab?" component={Bank} exact />
        <Route path="/surveys" component={Survey} exact />
        <Route
          path="/surveys/:survey_id/responses"
          component={Responses}
          exact
        />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
