import React from "react";
import { Collapse } from "antd";
import ScoreUnits from "./ScoreUnits";

const { Panel } = Collapse;

const Subdomains = props => {
  const subdomains = props.subdomains;

  return (
    <Collapse accordion>
      {subdomains &&
        subdomains.map(subdomain => {
          return (
            <Panel header={subdomain.title} key={subdomain.id}>
              <ScoreUnits
                instrument={props.instrument}
                scoreSchemeId={props.scoreSchemeId}
                subdomain={subdomain}
              />
            </Panel>
          );
        })}
    </Collapse>
  );
};

export default Subdomains;
