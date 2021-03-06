import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Projects from "../containers/Project";
import Instruments from "../containers/Project/show";
import { history } from "../redux/store";
import Bank from "./Bank";
import Error from "./Error";
import Instrument from "./Instrument/Instrument";
import ScoreScheme from "./ScoreScheme/ScoreScheme";

const Router = () => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={Projects} exact />
        <Route path="/projects/:project_id" component={Instruments} exact />
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
        <Route component={Error} />
      </Switch>
    </ConnectedRouter>
  );
};

export default Router;
