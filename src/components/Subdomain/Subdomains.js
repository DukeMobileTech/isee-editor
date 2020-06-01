import {
  Divider,
  Button,
  Row,
  Layout,
  Menu,
  Icon,
  Drawer,
  Table,
  Typography
} from "antd";
import {
  DeleteButton,
  EditButton,
  LeftCancelButton
} from "../../utils/Buttons";
import React, { Fragment, useState } from "react";

import ScoreUnits from "../ScoreUnit/ScoreUnits";
import SubdomainForm from "./SubdomainForm";
import { deleteSubdomain } from "../../utils/api/subdomain";
import { CenteredH4, CenteredH3 } from "../../utils/Styles";
import { getDomain } from "../../utils/api/domain";

const Subdomains = props => {
  const instrument = props.instrument;
  const scoreScheme = props.scoreScheme;
  const [domain, setDomain] = useState(props.domain);
  const [subdomains, setSubdomains] = useState(props.domain.subdomains);
  const [visible, setVisible] = useState(false);
  const [subdomain, setSubdomain] = useState(null);
  const [show, setShow] = useState(false);

  const fetchDomain = async () => {
    handleCancel();
    const result = await getDomain(
      instrument.project_id,
      instrument.id,
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
    deleteSubdomain(instrument, scoreScheme.id, subdomain).then(res =>
      fetchDomain()
    );
  };

  if (show) {
    return (
      <ScoreUnits
        instrument={instrument}
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
          <Row style={{ margin: "5px" }}>
            <LeftCancelButton handleClick={props.handleCancel} />
            <Button
              title="New Subdomain"
              style={{ float: "right" }}
              type="primary"
              onClick={() => handleEditSubdomain()}
            >
              <Icon type="plus" />
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
              instrument={instrument}
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
