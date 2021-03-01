import React, { useEffect, useState, useContext } from "react";
import { Divider, Spin, Table } from "antd";
import { connect } from "react-redux";
import {
  deleteInstrument,
  loadInstruments
} from "../../redux/actions/instruments";
import { CenteredH4 } from "../../utils/Styles";
import { Link } from "react-router-dom";
import { DeleteButton, EditButton, FolderAddButton } from "../../utils/Buttons";
import InstrumentForm from "../Instrument/InstrumentForm";
import { ProjectContext } from "../../context/ProjectContext";

const { Column } = Table;

const Instruments = ({
  isLoading,
  instruments,
  projectId,
  loadInstruments,
  deleteInstrument
}) => {
  const [showForm, setShowForm] = useState(false);
  const [instrument, setInstrument] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [currentProjectId, setCurrentProjectId] = useContext(ProjectContext);

  useEffect(() => {
    loadInstruments(projectId);
    sessionStorage.setItem("projectId", projectId);
    setCurrentProjectId(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleEditInstrument = instrument => {
    setInstrument(instrument);
    setShowForm(true);
  };

  const handleNewInstrument = () => {
    setInstrument(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setInstrument(null);
  };

  if (showForm) {
    return (
      <InstrumentForm
        projectId={projectId}
        instrument={instrument}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Spin spinning={isLoading}>
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
                      deleteInstrument(projectId, instrument.id);
                  }}
                />
              </span>
            )}
          />
        </Table>
        <FolderAddButton handleClick={handleNewInstrument} />
      </Spin>
    );
  }
};

function mapStateToProps(state, ownProps) {
  const { isLoading, instruments, loadInstruments, deleteInstrument } = state;
  const projectId = Number(ownProps.match.params.project_id);
  return {
    isLoading,
    instruments,
    projectId,
    loadInstruments,
    deleteInstrument
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadInstruments: projectId => dispatch(loadInstruments(projectId)),
    deleteInstrument: (projectId, id) =>
      dispatch(deleteInstrument(projectId, id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Instruments);
