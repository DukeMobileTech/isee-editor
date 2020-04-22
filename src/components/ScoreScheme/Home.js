import { Icon, Tabs } from "antd";
import React, { Fragment } from "react";
import { ProjectHeader, InstrumentHeader } from "../Headers";
import ScoreScheme from "./ScoreScheme";
import Units from "./Units";
import { CenteredH4 } from "../../utils/Styles";

const Home = props => {
  const project = props.location.state.project;
  const instrument = props.location.state.instrument;
  const scoreScheme = props.location.state.scoreScheme;

  return (
    <Fragment>
      <ProjectHeader project={project} />
      <InstrumentHeader instrument={instrument} />
      <CenteredH4>{scoreScheme.title}</CenteredH4>

      <Tabs>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="ordered-list" />
              Domains
            </span>
          }
          key="1"
        >
          <ScoreScheme instrument={instrument} scoreScheme={scoreScheme} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="project" />
              Units
            </span>
          }
          key="2"
        >
          <Units
            project={project}
            instrument={instrument}
            scoreScheme={scoreScheme}
          />
        </Tabs.TabPane>
      </Tabs>
    </Fragment>
  );
};

export default Home;
