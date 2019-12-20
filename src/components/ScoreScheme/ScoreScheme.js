import { CenteredH1, CenteredH3 } from "../../utils/Styles";
import { Collapse, Divider } from "antd";
import { DeleteButton, EditButton, FolderAddButton } from "../../utils/Buttons";
import React, { Fragment, useEffect, useState } from "react";
import { deleteDomain, getDomains } from "../../utils/api/domain";

import Domain from "./Domain/Domain";
import Subdomains from "./Subdomains";

const { Panel } = Collapse;

const ScoreScheme = props => {
  const instrument = props.location.state.instrument;
  const scoreScheme = props.location.state.scheme;
  const [domains, setDomains] = useState([]);
  const [visible, setVisible] = useState(false);
  const [domain, setDomain] = useState(null);

  useEffect(() => {
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDomains = async () => {
    setVisible(false);
    setDomain(null);
    const result = await getDomains(
      instrument.project_id,
      instrument.id,
      scoreScheme.id
    );
    setDomains(result.data);
  };

  const onNewDomain = () => {
    setVisible(true);
  };

  const handleEditDomain = domain => {
    setVisible(true);
    setDomain(domain);
  };

  const handleDeleteDomain = domain => {
    deleteDomain(instrument, domain).then(res => fetchDomains());
  };

  const genExtra = domain => (
    <Fragment>
      <EditButton
        handleClick={event => {
          event.stopPropagation();
          handleEditDomain(domain);
        }}
      />
      <Divider type="vertical" />
      <DeleteButton
        handleClick={event => {
          event.stopPropagation();
          if (
            window.confirm(`Are you sure you want to delete ${domain.title}?`)
          )
            handleDeleteDomain(domain);
        }}
      />
    </Fragment>
  );

  const DomainView = () => {
    return (
      <Fragment>
        <Collapse accordion>
          {domains &&
            domains.map(domain => {
              return (
                <Panel
                  header={domain.title}
                  key={domain.id}
                  extra={genExtra(domain)}
                >
                  <Subdomains
                    domain={domain}
                    subdomains={domain.subdomains}
                    instrument={instrument}
                    fetchDomains={fetchDomains}
                  />
                </Panel>
              );
            })}
        </Collapse>
        <br />
        <FolderAddButton handleClick={onNewDomain} />
        <Domain
          visible={visible}
          setVisible={setVisible}
          scoreSchemeId={scoreScheme.id}
          instrument={instrument}
          fetchDomains={fetchDomains}
          domain={domain}
        />
      </Fragment>
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
