import {
  DeleteButton,
  ViewButton,
  EditButton,
  CopyButton
} from "../../utils/Buttons";
import { Divider, Table, Row, Button } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import {
  deleteScoreUnit,
  getScoreUnits,
  copyScoreUnit
} from "../../utils/api/score_unit";

import ScoreUnit from "./ScoreUnit";
import ScoreUnitForm from "./ScoreUnitForm";
import EditScoreUnitForm from "./EditScoreUnitForm";

const { Column } = Table;

const ScoreUnits = props => {
  const instrument = props.instrument;
  const subdomain = props.subdomain;
  const [scoreUnits, setScoreUnits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showScoreUnit, setShowScoreUnit] = useState(false);
  const [scoreUnit, setScoreUnit] = useState(null);
  const [editScoreUnit, setEditScoreUnit] = useState(false);

  useEffect(() => {
    fetchScoreUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchScoreUnits = async () => {
    handleCancel();
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

  const handleCancel = () => {
    setShowForm(false);
    setShowScoreUnit(false);
    setEditScoreUnit(false);
    setScoreUnit(null);
  };

  const handleShowScoreUnit = scoreUnit => {
    setScoreUnit(scoreUnit);
    setShowScoreUnit(true);
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
      />
    );
  } else if (showScoreUnit) {
    return (
      <ScoreUnit
        scoreUnit={scoreUnit}
        instrument={instrument}
        handleCancel={handleCancel}
        scoreSchemeId={props.scoreSchemeId}
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
        <Table dataSource={scoreUnits} rowKey={su => su.id}>
          <Column title="Title" dataIndex="title" />
          <Column title="Type" dataIndex="score_type" />
          <Column title="Weight" dataIndex="weight" />
          <Column title="Base Score" dataIndex="base_point_score" />
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
                <ViewButton
                  handleClick={() => handleShowScoreUnit(scoreUnit)}
                />
                <Divider type="vertical" />
                <CopyButton handleClick={() => handleCopyUnit(scoreUnit)} />
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
