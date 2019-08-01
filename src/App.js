import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Error from "./components/Error";
import Instrument from "./components/Instrument";
import Display from "./components/Display";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/instruments/:id" component={Instrument} exact />
          <Route
            path="/instruments/:instrument_id/displays/:id"
            component={Display}
            exact
          />
          <Route component={Error} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

export default App;
