import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Error from "./Error";
import Instrument from "./Instrument";
import Login from "./Login";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Footer from "./Footer";
import "../App.css";
import Display from "./Display";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container id="content">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Home} exact />
          <Route
            path="/projects/:project_id/instruments/:id"
            component={Instrument}
            exact
          />
          <Route
            path="/projects/:project_id/instruments/:instrument_id/displays/:id"
            component={Display}
            exact
          />
          <Route component={Error} />
        </Switch>
      </Container>
      <Footer />
    </BrowserRouter>
  );
};

export default AppRoutes;
