import { Icon, Row, Button, Table } from "antd";
import { DeleteButton, EditButton } from "../../utils/Utils";
import React, { useState } from "react";
import { deleteFolder, getFolders } from "../../utils/api/folder";

import FolderForm from "./FolderForm";

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
    return (
      <Table size="small" dataSource={folders} rowKey={folder => folder.id}>
        <Table.Column title="Folder Title" dataIndex="title" />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(text, folder) => (
            <Row
              type="flex"
              justify="space-around"
              align="middle"
              key={`${folder.id}`}
            >
              <EditButton
                handleClick={event => {
                  event.stopPropagation();
                  handleEditFolder(folder);
                }}
              />
              <Button
                type="primary"
                title="Questions"
                onClick={() => props.questionSubset(folder, null)}
              >
                <Icon type="database" />
              </Button>
              <Button
                type="primary"
                title="Translations"
                onClick={() => props.handleFolderTranslations(folder)}
              >
                <Icon type="global" />
              </Button>
              <DeleteButton
                handleClick={event => {
                  event.stopPropagation();
                  if (
                    window.confirm(
                      `Are you sure you want to delete ${folder.title}?`
                    )
                  )
                    handleDeleteFolder(folder);
                }}
              />
            </Row>
          )}
        />
      </Table>
    );
  }
};

export default QuestionSet;
