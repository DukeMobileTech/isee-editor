import { Collapse, Divider, Row, Button, Typography } from "antd";
import { DeleteButton, EditButton } from "../../utils/Buttons";
import React, { Fragment, useEffect, useState } from "react";
import { deleteDomain, getDomains } from "../../utils/api/domain";

import Domain from "../Domain/Domain";
import Subdomains from "../Subdomain/Subdomains";

const { Panel } = Collapse;

const ScoreScheme = props => {
  const instrument = props.instrument;
  const scoreScheme = props.scoreScheme;
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
    setDomain({});
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

  if (visible) {
    return (
      <Domain
        visible={visible}
        setVisible={setVisible}
        scoreSchemeId={scoreScheme.id}
        instrument={instrument}
        fetchDomains={fetchDomains}
        domain={domain}
      />
    );
  } else {
    return (
      <Fragment>
        <Row style={{ margin: "3px" }}>
          <Typography.Text strong>{scoreScheme.title}</Typography.Text>
          <Button
            style={{ float: "right" }}
            type="primary"
            onClick={onNewDomain}
          >
            Add Domain
          </Button>
        </Row>
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
      </Fragment>
    );
  }
};

export default ScoreScheme;
