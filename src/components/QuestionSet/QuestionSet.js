import { Collapse, Divider, Icon } from "antd";
import { DeleteButton, EditButton } from "../../utils/Utils";
import React, { Fragment, useState } from "react";
import { deleteFolder, getFolders } from "../../utils/api/folder";

import FolderForm from "./FolderForm";
import FolderQuestions from "./FolderQuestions";

const { Panel } = Collapse;

const QuestionSet = props => {
  const questionSet = props.questionSet;
  const [folders, setFolders] = useState(
    questionSet === null ? [] : questionSet.folders
  );
  const [showForm, setShowForm] = useState(false);
  const [folder, setFolder] = useState(null);

  const fetchFolders = async () => {
    setShowForm(false);
    const results = await getFolders(questionSet.id);
    setFolders(results.data);
  };

  const handleEditFolder = folder => {
    setFolder(folder);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFolder(null);
  };

  const handleDeleteFolder = folder => {
    deleteFolder(questionSet.id, folder.id)
      .then(res => {
        fetchFolders();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const genExtra = folder => (
    <Fragment>
      <EditButton
        handleClick={event => {
          event.stopPropagation();
          handleEditFolder(folder);
        }}
      />
      <Divider type="vertical" />
      <DeleteButton
        handleClick={event => {
          event.stopPropagation();
          if (
            window.confirm(`Are you sure you want to delete ${folder.title}?`)
          )
            handleDeleteFolder(folder);
        }}
      />
    </Fragment>
  );

  const View = () => {
    if (showForm) {
      return (
        <FolderForm
          folder={folder}
          questionSet={questionSet}
          fetchFolders={fetchFolders}
          handleCancel={handleCancel}
        />
      );
    } else {
      return <CollapseView />;
    }
  };

  const CollapseView = () => {
    return (
      <Fragment>
        <Collapse
          accordion
          expandIcon={({ isActive }) => (
            <Icon type="caret-right" rotate={isActive ? 90 : 0} />
          )}
        >
          {folders.map(folder => {
            return (
              <Panel
                header={folder.title}
                key={`${folder.id}`}
                extra={genExtra(folder)}
              >
                <FolderQuestions folder={folder} />
              </Panel>
            );
          })}
        </Collapse>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <View />
    </Fragment>
  );
};

export default QuestionSet;
