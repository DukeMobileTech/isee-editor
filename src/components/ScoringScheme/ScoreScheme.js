import React, { useEffect, useState, Fragment } from "react";
import { Layout, Tabs, Icon, Collapse } from "antd";
import { CenteredH1, CenteredH3 } from "../../utils/Styles";
import { getDomains } from "../../utils/API";
import Subdomains from "./Subdomains";
import ScoreUnit from "./ScoreUnits";

const { Panel } = Collapse;

const ScoreScheme = props => {
  const instrument = props.location.state.instrument;
  const scoreScheme = props.location.state.scheme;
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    const fetchDomains = async () => {
      const result = await getDomains(
        instrument.project_id,
        instrument.id,
        scoreScheme.id
      );
      setDomains(result.data);
    };
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DomainView = () => {
    return (
      <Collapse accordion>
        {domains &&
          domains.map(domain => {
            return (
              <Panel header={domain.title} key={domain.id}>
                <Subdomains
                  subdomains={domain.subdomains}
                  scoreSchemeId={scoreScheme.id}
                  instrument={instrument}
                />
              </Panel>
            );
          })}
      </Collapse>
    );
  };

  return (
    <Fragment>
      <CenteredH1>{instrument.title}</CenteredH1>
      <CenteredH3>{scoreScheme.title}</CenteredH3>
      <DomainView />
    </Fragment>
  );
};

export default ScoreScheme;
