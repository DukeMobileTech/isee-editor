import { DeleteButton, FolderAddButton, ViewButton } from "../../utils/Utils";
import { Divider, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { deleteScoreUnit, getScoreUnits } from "../../utils/api/score_unit";

import ScoreUnit from "./ScoreUnit";
import ScoreUnitForm from "./ScoreUnitForm";

const { Column } = Table;

const ScoreUnits = props => {
  const instrument = props.instrument;
  const subdomain = props.subdomain;
  const [scoreUnits, setScoreUnits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showScoreUnit, setShowScoreUnit] = useState(false);
  const [scoreUnit, setScoreUnit] = useState(null);

  useEffect(() => {
    fetchScoreUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchScoreUnits = async () => {
    setShowForm(false);
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
    setScoreUnit(null);
  };

  const handleShowScoreUnit = scoreUnit => {
    setScoreUnit(scoreUnit);
    setShowScoreUnit(true);
  };

  const handleDeleteScoreUnit = scoreUnit => {
    deleteScoreUnit(instrument, props.scoreSchemeId, scoreUnit.id)
      .then(res => {
        let index = scoreUnits.indexOf(scoreUnit);
        scoreUnits.splice(index, 1);
        setScoreUnits([...scoreUnits]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const View = () => {
    if (showForm) {
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
          <Table dataSource={scoreUnits} rowKey={su => su.id}>
            <Column title="Title" dataIndex="title" />
            <Column title="Type" dataIndex="score_type" />
            <Column title="Weight" dataIndex="weight" />
            <Column title="Questions" dataIndex="question_identifiers" />
            <Column title="# of Options" dataIndex="option_score_count" />
            <Column
              title="Action"
              key="action"
              render={(text, scoreUnit) => (
                <span>
                  <ViewButton
                    handleClick={() => handleShowScoreUnit(scoreUnit)}
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
          <br />
          <FolderAddButton handleClick={handleNewScoreUnit} />
        </Fragment>
      );
    }
  };

  return <View />;
};
export default ScoreUnits;
