import { Button, Divider, Icon, Drawer, Table, Typography } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { DeleteButton, EditButton } from "../../utils/Buttons";
import { getDomains, deleteDomain } from "../../utils/api/domain";
import DomainForm from "./DomainForm";
import Subdomains from "../Subdomain/Subdomains";

const Domains = props => {
  const project = props.project;
  const instrument = props.instrument;
  const scoreScheme = props.scoreScheme;
  const [domains, setDomains] = useState([]);
  const [visible, setVisible] = useState(false);
  const [domain, setDomain] = useState(null);
  const [showDomain, setShowDomain] = useState(false);

  useEffect(() => {
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDomains = async () => {
    handleCancel();
    const result = await getDomains(project.id, instrument.id, scoreScheme.id);
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
    deleteDomain(instrument, domain).then(res => fetchDomains());
  };

  const handleShowDomain = domain => {
    setDomain(domain);
    setShowDomain(true);
  };

  if (showDomain) {
    return (
      <Subdomains
        domain={domain}
        domains={domains}
        instrument={instrument}
        scoreScheme={scoreScheme}
        fetchDomains={fetchDomains}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Fragment>
        <Button
          title="New Domain"
          style={{ float: "right", margin: "5px" }}
          type="primary"
          onClick={onNewDomain}
        >
          <Icon type="plus" />
        </Button>
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
            instrument={instrument}
            fetchDomains={fetchDomains}
            domain={domain}
          />
        </Drawer>
      </Fragment>
    );
  }
};

export default Domains;
