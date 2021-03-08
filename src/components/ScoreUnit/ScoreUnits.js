import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Drawer, Layout, Menu, Row, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import {
  copyScoreUnit,
  deleteScoreUnit,
  getScoreUnits,
} from "../../utils/api/score_unit";
import {
  CopyButton,
  DeleteButton,
  EditButton,
  LeftCancelButton,
} from "../../utils/Buttons";
import { CenteredH3, CenteredH4, CenteredH5 } from "../../utils/Styles";
import { customExpandIcon } from "../../utils/Utils";
import EditScoreUnit from "./EditScoreUnit";
import NewScoreUnit from "./NewScoreUnit";

const { Column } = Table;

const ScoreUnits = (props) => {
  const projectId = props.projectId;
  const instrumentId = props.instrumentId;
  const scoreScheme = props.scoreScheme;
  const domain = props.domain;
  const subdomains = props.subdomains;
  const [subdomain, setSubdomain] = useState(props.subdomain);
  const [scoreUnits, setScoreUnits] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [scoreUnit, setScoreUnit] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const fetchScoreUnits = async () => {
    const result = await getScoreUnits(
      projectId,
      instrumentId,
      scoreScheme.id,
      subdomain.id
    );
    setScoreUnits(result.data);
  };

  useEffect(() => {
    fetchScoreUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubdomainClick = (item) => {
    const clicked = subdomains.find((sd) => sd.id === Number(item.key));
    setSubdomain(clicked);
    getScoreUnits(
      projectId,
      instrumentId,
      scoreScheme.id,
      clicked.id
    ).then((res) => setScoreUnits(res.data));
  };

  const onNew = () => {
    setShowNew(true);
  };

  const onCancelNew = () => {
    setShowNew(false);
  };

  const onCancelEdit = () => {
    setShowEdit(false);
    setScoreUnit(null);
    fetchScoreUnits();
  };

  const handleEditScoreUnit = (scoreUnit) => {
    setScoreUnit(scoreUnit);
    setShowEdit(true);
  };

  const handleCopyUnit = (scoreUnit) => {
    copyScoreUnit(projectId, instrumentId, scoreScheme.id, scoreUnit).then(
      (response) => {
        scoreUnits.unshift(response.data);
        setScoreUnits([...scoreUnits]);
      }
    );
  };

  const handleDeleteScoreUnit = (scoreUnit) => {
    deleteScoreUnit(projectId, instrumentId, scoreScheme.id, scoreUnit)
      .then((res) => {
        let index = scoreUnits.indexOf(scoreUnit);
        scoreUnits.splice(index, 1);
        setScoreUnits([...scoreUnits]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Layout>
      <Layout.Sider width={250} style={{ background: "#ffffff" }}>
        <CenteredH4>Subdomains</CenteredH4>
        <Menu
          key={subdomain.title}
          defaultSelectedKeys={[`${subdomain.id}`]}
          defaultOpenKeys={[`${subdomain.id}`]}
          onClick={handleSubdomainClick}
        >
          {subdomains.map((item) => {
            return (
              <Menu.Item key={`${item.id}`}>
                {`${item.title} ${item.name}`}
              </Menu.Item>
            );
          })}
        </Menu>
      </Layout.Sider>
      <Layout.Content>
        <CenteredH3>{`${domain.title} ${domain.name}`}</CenteredH3>
        <CenteredH4>{`${subdomain.title} ${subdomain.name}`}</CenteredH4>
        <CenteredH5>Score Units</CenteredH5>
        <Row style={{ margin: "5px" }}>
          <LeftCancelButton handleClick={props.handleCancel} />
          <Button
            style={{ float: "right" }}
            type="primary"
            onClick={onNew}
            title="New Score Unit"
          >
            <PlusOutlined />
          </Button>
        </Row>
        <Table
          dataSource={scoreUnits}
          rowKey={(su) => su.id}
          pagination={{
            defaultPageSize: 50,
          }}
          expandedRowRender={(scoreUnit) => (
            <Fragment>
              {scoreUnit.notes && (
                <Row style={{ marginBottom: "25px" }}>{scoreUnit.notes}</Row>
              )}
              <Table
                dataSource={scoreUnit.option_scores}
                rowKey={(optionScore) => optionScore.id}
                pagination={{
                  defaultPageSize: 50,
                }}
              >
                <Table.Column
                  title="Question"
                  dataIndex="question_identifier"
                />
                <Table.Column title="Option" dataIndex="option_identifier" />
                <Table.Column title="Score" dataIndex="value" />
                <Table.Column title="Notes" dataIndex="notes" />
              </Table>
            </Fragment>
          )}
          expandIcon={(props) => customExpandIcon(props)}
        >
          <Column title="Title" dataIndex="title" />
          <Column title="Type" dataIndex="score_type" />
          <Column title="Weight" dataIndex="weight" />
          <Column title="Base Score" dataIndex="base_point_score" />
          <Column title="Institution" dataIndex="institution_type" />
          <Column title="Questions" dataIndex="question_identifiers" />
          <Column title="Option Count" dataIndex="option_score_count" />
          <Column
            title="Action"
            key="action"
            render={(text, scoreUnit) => (
              <span>
                <EditButton
                  handleClick={() => handleEditScoreUnit(scoreUnit)}
                />
                <Divider type="vertical" />
                <CopyButton
                  handleClick={() => {
                    if (
                      // eslint-disable-next-line no-alert
                      window.confirm(
                        `Are you sure you want to make a copy of ${scoreUnit.title}?`
                      )
                    )
                      handleCopyUnit(scoreUnit);
                  }}
                />
                <Divider type="vertical" />
                <DeleteButton
                  handleClick={() => {
                    if (
                      // eslint-disable-next-line no-alert
                      window.confirm(
                        `Are you sure you want to delete ${scoreUnit.title}?`
                      )
                    )
                      handleDeleteScoreUnit(scoreUnit);
                  }}
                />
              </span>
            )}
          />
        </Table>
        <Drawer
          title="New Score Unit"
          placement={"right"}
          width={720}
          closable={false}
          onClose={onCancelNew}
          visible={showNew}
          key="new"
          destroyOnClose
        >
          <NewScoreUnit
            subdomain={subdomain}
            projectId={projectId}
            instrumentId={instrumentId}
            handleCancel={onCancelNew}
            scoreSchemeId={scoreScheme.id}
            fetchScoreUnits={fetchScoreUnits}
            visible={showNew}
            setVisible={setShowNew}
          />
        </Drawer>
        <Drawer
          title={scoreUnit && scoreUnit.title}
          placement={"right"}
          width={1080}
          closable={false}
          onClose={onCancelEdit}
          visible={showEdit}
          key="edit"
          destroyOnClose
        >
          <EditScoreUnit
            scoreUnit={scoreUnit}
            subdomain={subdomain}
            projectId={projectId}
            instrumentId={instrumentId}
            handleCancel={onCancelEdit}
            scoreSchemeId={scoreScheme.id}
            fetchScoreUnits={fetchScoreUnits}
            visible={showEdit}
            setVisible={setShowEdit}
          />
        </Drawer>
      </Layout.Content>
    </Layout>
  );
  // }
};
export default ScoreUnits;
