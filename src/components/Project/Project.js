import { DeleteButton, EditButton, FolderAddButton } from "../../utils/Buttons";
import { Divider, Table } from "antd";
import React, { Fragment, useEffect, useState, useContext } from "react";
import { deleteInstrument, getInstruments } from "../../utils/api/instrument";

import InstrumentForm from "../Instrument/InstrumentForm";
import { Link } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";
import { CenteredH4 } from "../../utils/Styles";

const { Column } = Table;

const Project = ({ match }) => {
  const projectId = match.params.project_id;
  const [instruments, setInstruments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [instrument, setInstrument] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [projects, currentProject, setCurrentProject] = useContext(
    ProjectContext
  );
  sessionStorage.setItem("projectId", projectId);
  setCurrentProject(projectId);

  useEffect(() => {
    fetchInstruments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInstruments = async () => {
    setShowForm(false);
    const results = await getInstruments(projectId);
    setInstruments(results.data);
  };

  const handleDeleteInstrument = instrument => {
    deleteInstrument(instrument.project_id, instrument.id)
      .then(results => {
        let index = instruments.indexOf(instrument);
        instruments.splice(index, 1);
        setInstruments([...instruments]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleEditInstrument = instrument => {
    setInstrument(instrument);
    setShowForm(true);
  };

  const handleNewInstrument = () => {
    setInstrument(null);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <InstrumentForm
        instrument={instrument}
        handleCancel={handleCancel}
        fetchInstruments={fetchInstruments}
      />
    );
  } else {
    return (
      <Fragment>
        <CenteredH4>Instruments</CenteredH4>
        <Table dataSource={instruments} rowKey={instrument => instrument.id}>
          <Column
            title="Title"
            dataIndex="title"
            render={(text, instrument) => (
              <Link
                to={`/projects/${instrument.project_id}/instruments/${instrument.id}`}
              >
                {instrument.title}
              </Link>
            )}
          />
          <Column title="Project" dataIndex="project" key="project" />
          <Column
            title="Version Number"
            dataIndex="current_version_number"
            key="current_version_number"
          />
          <Column
            title="Question Count"
            dataIndex="question_count"
            key="question_count"
          />
          <Column
            title="Published"
            dataIndex="published"
            key="published"
            render={(text, instrument) => String(instrument.published)}
          />
          <Column
            title="Action"
            key="action"
            render={(text, instrument) => (
              <span>
                <EditButton
                  handleClick={() => handleEditInstrument(instrument)}
                />
                <Divider type="vertical" />
                <DeleteButton
                  handleClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${instrument.title}?`
                      )
                    )
                      handleDeleteInstrument(instrument);
                  }}
                />
              </span>
            )}
          />
        </Table>
        <FolderAddButton handleClick={handleNewInstrument} />
      </Fragment>
    );
  }
};

export default Project;
