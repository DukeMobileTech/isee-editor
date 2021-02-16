import { Button, Divider, Icon, Drawer, Table, Typography, Row } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { DeleteButton, EditButton } from "../../utils/Buttons";
import { getDomains, deleteDomain } from "../../utils/api/domain";
import DomainForm from "./DomainForm";
import Subdomains from "../Subdomain/Subdomains";
import Translations from "../DomainTranslation/Translations";

const Domains = props => {
  const projectId = props.projectId;
  const instrumentId = props.instrumentId;
  const scoreScheme = props.scoreScheme;
  const [domains, setDomains] = useState([]);
  const [visible, setVisible] = useState(false);
  const [domain, setDomain] = useState(null);
  const [showDomain, setShowDomain] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);

  useEffect(() => {
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDomains = async () => {
    handleCancel();
    const result = await getDomains(projectId, instrumentId, scoreScheme.id);
    setDomains(result.data);
  };

  const handleCancel = () => {
    setVisible(false);
    setShowDomain(false);
    setDomain(null);
  };

  const onNewDomain = () => {
    setVisible(true);
  };

  const handleEditDomain = domain => {
    setVisible(true);
    setDomain(domain);
  };

  const handleDeleteDomain = domain => {
    deleteDomain(projectId, instrumentId, domain).then(res => fetchDomains());
  };

  const handleShowDomain = domain => {
    setDomain(domain);
    setShowDomain(true);
  };

  const handleDomainTranslations = () => {
    setShowTranslations(!showTranslations);
  };

  if (showTranslations) {
    return (
      <Translations
        projectId={projectId}
        scoreScheme={scoreScheme}
        domains={domains}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
      />
    );
  } else if (showDomain) {
    return (
      <Subdomains
        domain={domain}
        domains={domains}
        projectId={projectId}
        instrumentId={instrumentId}
        scoreScheme={scoreScheme}
        fetchDomains={fetchDomains}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Fragment>
        <Row>
          <Button
            title="Show Translations"
            type="primary"
            onClick={handleDomainTranslations}
            style={{ marginRight: "2px" }}
          >
            <Icon type="global" />
          </Button>
          <Button
            title="New Domain"
            style={{ float: "right", margin: "5px" }}
            type="primary"
            onClick={onNewDomain}
          >
            <Icon type="plus" />
          </Button>
        </Row>
        <Table
          size="small"
          bordered
          dataSource={domains}
          rowKey={domain => domain.id}
          pagination={{ defaultPageSize: 25 }}
        >
          <Table.Column
            title="Title"
            dataIndex="title"
            render={(text, domain) => (
              <Typography.Text>{domain.title}</Typography.Text>
            )}
          />
          <Table.Column
            title="Name"
            dataIndex="name"
            render={(text, domain) => (
              <Button type="link" onClick={() => handleShowDomain(domain)}>
                {domain.name}
              </Button>
            )}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(text, domain) => (
              <Fragment>
                <EditButton handleClick={() => handleEditDomain(domain)} />
                <Divider type="vertical" />
                <DeleteButton
                  handleClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${domain.title}?`
                      )
                    )
                      handleDeleteDomain(domain);
                  }}
                />
              </Fragment>
            )}
          />
        </Table>
        <Drawer
          title={domain === null ? "New Domain" : domain.name}
          placement={"right"}
          width={720}
          closable={false}
          onClose={handleCancel}
          visible={visible}
          key={"right"}
          destroyOnClose={true}
        >
          <DomainForm
            visible={visible}
            setVisible={setVisible}
            scoreSchemeId={scoreScheme.id}
            projectId={projectId}
            instrumentId={instrumentId}
            fetchDomains={fetchDomains}
            domain={domain}
          />
        </Drawer>
      </Fragment>
    );
  }
};

export default Domains;
