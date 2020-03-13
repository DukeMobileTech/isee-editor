import { DeleteButton, EditButton, AddButton } from "../../utils/Buttons";
import { Divider, Table, Button } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import {
  deleteScoreScheme,
  getScoreSchemes
} from "../../utils/api/score_scheme";

import ScoreSchemeForm from "./ScoreSchemeForm";
import ScoreScheme from "./ScoreScheme";

const { Column } = Table;

const ScoreSchemes = props => {
  const instrument = props.instrument;
  const [scoreSchemes, setScoreSchemes] = useState([]);
  const [scoreScheme, setScoreScheme] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUnits, setShowUnits] = useState(false);

  useEffect(() => {
    if (instrument) fetchScoreSchemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchScoreSchemes = async () => {
    handleCancel();
    const result = await getScoreSchemes(instrument.project_id, instrument.id);
    setScoreSchemes(result.data);
  };

  const handleNewScheme = () => {
    setShowForm(true);
    setScoreScheme(null);
  };

  const handleEditScheme = scheme => {
    setScoreScheme(scheme);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowUnits(false);
  };

  const handleDeleteScheme = scheme => {
    deleteScoreScheme(instrument.project_id, instrument.id, scheme.id)
      .then(results => {
        let index = scoreSchemes.indexOf(scheme);
        scoreSchemes.splice(index, 1);
        setScoreSchemes([...scoreSchemes]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleShowUnits = scheme => {
    setScoreScheme(scheme);
    setShowUnits(true);
  };

  if (showForm) {
    return (
      <ScoreSchemeForm
        instrument={instrument}
        scoreScheme={scoreScheme}
        fetchScoreSchemes={fetchScoreSchemes}
        handleCancel={handleCancel}
      />
    );
  } else if (showUnits) {
    return (
      <ScoreScheme
        instrument={instrument}
        scoreScheme={scoreScheme}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Fragment>
        <AddButton handleClick={handleNewScheme} />
        <Table dataSource={scoreSchemes} rowKey={scheme => scheme.id}>
          <Column
            title="Title"
            dataIndex="title"
            render={(text, scheme) => (
              <Button type="link" onClick={() => handleShowUnits(scheme)}>
                {scheme.title}
              </Button>
            )}
          />
          <Column
            title="Active"
            dataIndex="active"
            key="active"
            render={(text, scheme) => scheme.active.toString()}
          />
          <Column
            title="Action"
            key="action"
            render={(text, scheme) => (
              <span>
                <EditButton handleClick={() => handleEditScheme(scheme)} />
                <Divider type="vertical" />
                <DeleteButton
                  handleClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${scheme.title}?`
                      )
                    )
                      handleDeleteScheme(scheme);
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

export default ScoreSchemes;
