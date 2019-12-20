import { DeleteButton, EditButton, FolderAddButton } from "../../utils/Buttons";
import { Divider, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import {
  deleteScoreScheme,
  getScoreSchemes
} from "../../utils/api/score_scheme";

import { Link } from "react-router-dom";
import ScoreSchemeForm from "./ScoreSchemeForm";

const { Column } = Table;

const ScoreSchemes = props => {
  const instrument = props.instrument;
  const [scoreSchemes, setScoreSchemes] = useState([]);
  const [scheme, setScheme] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (instrument) fetchScoreSchemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchScoreSchemes = async () => {
    setShowForm(false);
    const result = await getScoreSchemes(instrument.project_id, instrument.id);
    setScoreSchemes(result.data);
  };

  const handleNewScheme = () => {
    setShowForm(true);
    setScheme(null);
  };

  const handleEditScheme = scheme => {
    setScheme(scheme);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
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

  const ScoreSchemesView = () => {
    if (showForm) {
      return (
        <ScoreSchemeForm
          instrument={instrument}
          scoreScheme={scheme}
          fetchScoreSchemes={fetchScoreSchemes}
          handleCancel={handleCancel}
        />
      );
    } else {
      return <ScoreSchemeList />;
    }
  };

  const ScoreSchemeList = () => {
    return (
      <Fragment>
        <Table dataSource={scoreSchemes} rowKey={scheme => scheme.id}>
          <Column
            title="Title"
            dataIndex="title"
            render={(text, scheme) => (
              <Link
                to={{
                  pathname: `/projects/${instrument.project_id}/instruments/${instrument.id}/score_schemes/${scheme.id}`,
                  state: { instrument, scheme }
                }}
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
        <FolderAddButton handleClick={handleNewScheme} />
      </Fragment>
    );
  };

  return (
    <Fragment>
      <ScoreSchemesView />
    </Fragment>
  );
};

export default ScoreSchemes;
