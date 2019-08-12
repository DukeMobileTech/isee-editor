import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Error from "./Error";
import Instrument from "./Instrument/Instrument";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Footer from "./Footer";
import "../App.css";
import Display from "./Display";
import InstrumentForm from "./Instrument/InstrumentForm";
import SectionForm from "./Section/SectionForm";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container id="content">
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/instruments/new" component={InstrumentForm} exact />
          <Route
            path="/projects/:project_id/instruments/:id/edit"
            component={InstrumentForm}
            exact
          />
          <Route
            path="/projects/:project_id/instruments/:id"
            component={Instrument}
            exact
          />
          <Route
            path="/projects/:project_id/instruments/:instrument_id/sections/new"
            component={SectionForm}
            exact
          />
          <Route
            path="/projects/:project_id/instruments/:instrument_id/sections/:id/edit"
            component={SectionForm}
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
