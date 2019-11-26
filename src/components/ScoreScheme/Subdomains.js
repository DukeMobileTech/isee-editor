import { Collapse, Divider } from "antd";
import { DeleteButton, EditButton, FolderAddButton } from "../../utils/Utils";
import React, { Fragment, useState } from "react";

import ScoreUnits from "./ScoreUnits";
import Subdomain from "./Domain/Subdomain";
import { deleteSubdomain } from "../../utils/api/subdomain";

const { Panel } = Collapse;

const Subdomains = props => {
  const subdomains = props.subdomains;
  const domain = props.domain;
  const [visible, setVisible] = useState(false);
  const [subdomain, setSubdomain] = useState(null);

  const onNewSubdomain = () => {
    setVisible(true);
  };

  const handleEditSubdomain = subdomain => {
    setVisible(true);
    setSubdomain(subdomain);
  };

  const handleDeleteSubdomain = subdomain => {
    deleteSubdomain(props.instrument, domain.score_scheme_id, subdomain).then(
      res => props.fetchDomains()
    );
  };

  const genExtra = subdomain => (
    <Fragment>
      <EditButton
        handleClick={event => {
          event.stopPropagation();
          handleEditSubdomain(subdomain);
        }}
      />
      <Divider type="vertical" />
      <DeleteButton
        handleClick={event => {
          event.stopPropagation();
          if (
            window.confirm(
              `Are you sure you want to delete ${subdomain.title}?`
            )
          )
            handleDeleteSubdomain(subdomain);
        }}
      />
    </Fragment>
  );

  return (
    <Fragment>
      <Collapse accordion>
        {subdomains &&
          subdomains.map(subdomain => {
            return (
              <Panel
                header={subdomain.title}
                key={subdomain.id}
                extra={genExtra(subdomain)}
              >
                <ScoreUnits
                  instrument={props.instrument}
                  scoreSchemeId={domain.score_scheme_id}
                  subdomain={subdomain}
                />
              </Panel>
            );
          })}
      </Collapse>
      <br />
      <FolderAddButton handleClick={onNewSubdomain} />
      <Subdomain
        domain={domain}
        subdomain={subdomain}
        visible={visible}
        setVisible={setVisible}
        instrument={props.instrument}
        fetchDomains={props.fetchDomains}
      />
    </Fragment>
  );
};

export default Subdomains;
