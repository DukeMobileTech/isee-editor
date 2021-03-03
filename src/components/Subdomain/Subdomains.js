import React, { Fragment, useState } from "react";
import {
  Divider,
  Button,
  Row,
  Layout,
  Menu,
  Drawer,
  Table,
  Typography
} from "antd";
import { PlusOutlined, GlobalOutlined } from "@ant-design/icons";

import ScoreUnits from "../ScoreUnit/ScoreUnits";
import SubdomainForm from "./SubdomainForm";
import { deleteSubdomain } from "../../utils/api/subdomain";
import { CenteredH4, CenteredH3 } from "../../utils/Styles";
import { getDomain } from "../../utils/api/domain";
import Translations from "../SubdomainTranslation/Translations";
import {
  DeleteButton,
  EditButton,
  LeftCancelButton
} from "../../utils/Buttons";

const Subdomains = props => {
  const projectId = props.projectId;
  const instrumentId = props.instrumentId;
  const scoreScheme = props.scoreScheme;
  const [domain, setDomain] = useState(props.domain);
  const [subdomains, setSubdomains] = useState(props.domain.subdomains);
  const [visible, setVisible] = useState(false);
  const [subdomain, setSubdomain] = useState(null);
  const [show, setShow] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);

  const fetchDomain = async () => {
    handleCancel();
    const result = await getDomain(
      projectId,
      instrumentId,
      scoreScheme.id,
      domain.id
    );
    setDomain(result.data);
    setSubdomains(result.data.subdomains);
  };

  const handleCancel = () => {
    setVisible(false);
    setShow(false);
    setSubdomain(null);
  };

  const handleDomainClick = item => {
    const clicked = props.domains.find(dom => dom.id === Number(item.key));
    setDomain(clicked);
    setSubdomains(clicked.subdomains);
  };

  const handleEditSubdomain = (subdomain = null) => {
    setSubdomain(subdomain);
    setVisible(true);
  };

  const handleShowSubdomain = subdomain => {
    setSubdomain(subdomain);
    setShow(true);
  };

  const handleDeleteSubdomain = subdomain => {
    deleteSubdomain(
      projectId,
      instrumentId,
      scoreScheme.id,
      subdomain
    ).then(res => fetchDomain());
  };

  const handleTranslations = () => {
    setShowTranslations(!showTranslations);
  };

  if (showTranslations) {
    return (
      <Fragment>
        <CenteredH3>{`${domain.title} ${domain.name}`}</CenteredH3>
        <Translations
          instrumentId={instrumentId}
          projectId={projectId}
          domain={domain}
          subdomains={subdomains}
          setShowTranslations={setShowTranslations}
          showTranslations={showTranslations}
        />
      </Fragment>
    );
  } else if (show) {
    return (
      <ScoreUnits
        projectId={projectId}
        instrumentId={instrumentId}
        scoreScheme={scoreScheme}
        domain={domain}
        subdomain={subdomain}
        subdomains={subdomains}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Layout>
        <Layout.Sider width={250} style={{ background: "#ffffff" }}>
          <CenteredH4>Domains</CenteredH4>
          <Menu
            key={domain.title}
            defaultSelectedKeys={[`${domain.id}`]}
            defaultOpenKeys={[`${domain.id}`]}
            onClick={handleDomainClick}
          >
            {props.domains.map(domainItem => {
              return (
                <Menu.Item key={`${domainItem.id}`}>
                  {`${domainItem.title} ${domainItem.name}`}
                </Menu.Item>
              );
            })}
          </Menu>
        </Layout.Sider>
        <Layout.Content>
          <CenteredH3>{`${domain.title} ${domain.name}`}</CenteredH3>
          <CenteredH4>Subdomains</CenteredH4>
          <Row
            gutter={8}
            type="flex"
            justify="space-between"
            align="middle"
            style={{ margin: "5px" }}
          >
            <LeftCancelButton handleClick={props.handleCancel} />
            <Button
              title="Show Translations"
              type="primary"
              onClick={handleTranslations}
            >
              <GlobalOutlined />
            </Button>
            <Button
              title="New Subdomain"
              type="primary"
              onClick={() => handleEditSubdomain()}
            >
              <PlusOutlined />
            </Button>
          </Row>
          <Table
            size="small"
            bordered
            dataSource={subdomains}
            rowKey={sd => sd.id}
            pagination={{ defaultPageSize: 25 }}
          >
            <Table.Column
              title="Title"
              dataIndex="title"
              render={(text, sd) => (
                <Typography.Text>{sd.title}</Typography.Text>
              )}
            />
            <Table.Column
              title="Name"
              dataIndex="name"
              render={(text, sd) => (
                <Button type="link" onClick={() => handleShowSubdomain(sd)}>
                  {sd.name}
                </Button>
              )}
            />
            <Table.Column
              title="Actions"
              dataIndex="actions"
              render={(text, sd) => (
                <Fragment>
                  <EditButton handleClick={() => handleEditSubdomain(sd)} />
                  <Divider type="vertical" />
                  <DeleteButton
                    handleClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${sd.title}?`
                        )
                      )
                        handleDeleteSubdomain(sd);
                    }}
                  />
                </Fragment>
              )}
            />
          </Table>
          <Drawer
            title={subdomain === null ? "New Subdomain" : subdomain.name}
            placement={"right"}
            width={720}
            closable={false}
            onClose={handleCancel}
            visible={visible}
            key={"right"}
            destroyOnClose={true}
          >
            <SubdomainForm
              domain={domain}
              subdomain={subdomain}
              visible={visible}
              setVisible={setVisible}
              instrumentId={instrumentId}
              projectId={projectId}
              scoreScheme={scoreScheme}
              fetchDomain={fetchDomain}
            />
          </Drawer>
        </Layout.Content>
      </Layout>
    );
  }
};

export default Subdomains;
