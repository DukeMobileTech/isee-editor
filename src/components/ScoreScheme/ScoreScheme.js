import { Icon, Tabs, Row } from "antd";
import React, { Fragment } from "react";
import ScoreUnits from "./ScoreUnits";
import { CenteredH3 } from "../../utils/Styles";
import Domains from "../Domain/Domains";
import { LeftCancelButton } from "../../utils/Buttons";

const ScoreScheme = props => {
  const project = props.project;
  const instrument = props.instrument;
  const scoreScheme = props.scoreScheme;

  return (
    <Fragment>
      <Row style={{ margin: "5px" }}>
        <LeftCancelButton handleClick={props.handleCancel} />
        <CenteredH3>{scoreScheme.title}</CenteredH3>
      </Row>
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
          <Domains
            project={project}
            instrument={instrument}
            scoreScheme={scoreScheme}
            handleCancel={props.handleCancel}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="project" />
              Score Units
            </span>
          }
          key="2"
        >
          <ScoreUnits
            project={project}
            instrument={instrument}
            scoreScheme={scoreScheme}
          />
        </Tabs.TabPane>
      </Tabs>
    </Fragment>
  );
};

export default ScoreScheme;
