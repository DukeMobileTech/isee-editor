import { DeleteButton, EditButton, CopyButton } from "../../utils/Buttons";
import { Divider, Table, Row, Button } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import {
  deleteScoreUnit,
  getScoreUnits,
  copyScoreUnit
} from "../../utils/api/score_unit";

import ScoreUnitForm from "./ScoreUnitForm";
import EditScoreUnitForm from "./EditScoreUnitForm";
import { customExpandIcon } from "../../utils/Utils";

const { Column } = Table;

const ScoreUnits = props => {
  const instrument = props.instrument;
  const subdomain = props.subdomain;
  const [scoreUnits, setScoreUnits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [scoreUnit, setScoreUnit] = useState(null);
  const [editScoreUnit, setEditScoreUnit] = useState(false);

  useEffect(() => {
    fetchScoreUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchScoreUnits = async (status = false, unit = null) => {
    handleCancel(status, unit);
    const result = await getScoreUnits(
      instrument,
      props.scoreSchemeId,
      subdomain.id
    );
    setScoreUnits(result.data);
  };

  const handleNewScoreUnit = () => {
    setShowForm(true);
  };

  const handleCancel = (status = false, unit = null) => {
    setShowForm(false);
    setEditScoreUnit(status);
    setScoreUnit(unit);
  };

  const handleEditScoreUnit = scoreUnit => {
    setScoreUnit(scoreUnit);
    setEditScoreUnit(true);
  };

  const handleCopyUnit = scoreUnit => {
    copyScoreUnit(instrument, props.scoreSchemeId, scoreUnit).then(response => {
      scoreUnits.unshift(response.data);
      setScoreUnits([...scoreUnits]);
    });
  };

  const handleDeleteScoreUnit = scoreUnit => {
    deleteScoreUnit(instrument, props.scoreSchemeId, scoreUnit)
      .then(res => {
        let index = scoreUnits.indexOf(scoreUnit);
        scoreUnits.splice(index, 1);
        setScoreUnits([...scoreUnits]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  if (editScoreUnit) {
    return (
      <EditScoreUnitForm
        scoreUnit={scoreUnit}
        subdomain={subdomain}
        instrument={instrument}
        handleCancel={handleCancel}
        scoreSchemeId={props.scoreSchemeId}
        fetchScoreUnits={fetchScoreUnits}
        visible={editScoreUnit}
        setVisible={setEditScoreUnit}
      />
    );
  } else if (showForm) {
    return (
      <ScoreUnitForm
        subdomain={subdomain}
        instrument={instrument}
        handleCancel={handleCancel}
        scoreSchemeId={props.scoreSchemeId}
        fetchScoreUnits={fetchScoreUnits}
        visible={showForm}
        setVisible={setShowForm}
      />
    );
  } else {
    return (
      <Fragment>
        <Row style={{ margin: "3px" }}>
          <Button
            style={{ float: "right" }}
            type="primary"
            onClick={handleNewScoreUnit}
          >
            Add Score Unit
          </Button>
        </Row>
        <Table
          dataSource={scoreUnits}
          rowKey={su => su.id}
          pagination={{
            defaultPageSize: 50
          }}
          expandedRowRender={scoreUnit => (
            <Table
              dataSource={scoreUnit.option_scores}
              rowKey={optionScore => optionScore.id}
              pagination={{
                defaultPageSize: 50
              }}
            >
              <Table.Column title="Identifier" dataIndex="option_identifier" />
              <Table.Column title="Score" dataIndex="value" />
            </Table>
          )}
          expandIcon={props => customExpandIcon(props)}
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
      </Fragment>
    );
  }
};
export default ScoreUnits;
