import { Divider, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteScoreScheme,
  getScoreSchemes,
} from "../../utils/api/score_scheme";
import { AddButton, DeleteButton, EditButton } from "../../utils/Buttons";
import ScoreScheme from "./ScoreScheme";
import ScoreSchemeForm from "./ScoreSchemeForm";

const { Column } = Table;

const ScoreSchemes = (props) => {
  const projectId = props.projectId;
  const instrument = props.instrument;
  const [scoreSchemes, setScoreSchemes] = useState([]);
  const [scoreScheme, setScoreScheme] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showScheme, setShowScheme] = useState(false);

  const handleCancel = () => {
    setShowForm(false);
    setShowScheme(false);
  };

  const fetchScoreSchemes = async () => {
    handleCancel();
    const result = await getScoreSchemes(projectId, instrument.id);
    setScoreSchemes(result.data);
  };

  useEffect(() => {
    fetchScoreSchemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewScheme = () => {
    setShowForm(true);
    setScoreScheme(null);
  };

  const handleEditScheme = (scheme) => {
    setScoreScheme(scheme);
    setShowForm(true);
  };

  const handleDeleteScheme = (scheme) => {
    deleteScoreScheme(instrument.project_id, instrument.id, scheme.id)
      .then((results) => {
        let index = scoreSchemes.indexOf(scheme);
        scoreSchemes.splice(index, 1);
        setScoreSchemes([...scoreSchemes]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (showScheme) {
    return (
      <ScoreScheme
        instrument={instrument}
        scoreScheme={scoreScheme}
        handleCancel={handleCancel}
      />
    );
  } else if (showForm) {
    return (
      <ScoreSchemeForm
        instrument={instrument}
        scoreScheme={scoreScheme}
        fetchScoreSchemes={fetchScoreSchemes}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Fragment>
        <AddButton handleClick={handleNewScheme} />
        <Table dataSource={scoreSchemes} rowKey={(scheme) => scheme.id}>
          <Column
            title="Title"
            dataIndex="title"
            render={(text, scheme) => (
              <Link
                to={`/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scheme.id}`}
              >
                {scheme.title}
              </Link>
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
                      // eslint-disable-next-line no-alert
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
