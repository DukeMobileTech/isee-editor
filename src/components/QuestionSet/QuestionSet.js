import { DatabaseOutlined, DragOutlined } from "@ant-design/icons";
import { Button, Col, List, Row } from "antd";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { deleteFolder, getFolders } from "../../utils/api/folder";
import { orderFolders } from "../../utils/api/question_set";
import {
  DeleteButton,
  EditButton,
  TranslationButton,
} from "../../utils/Buttons";
import { getItemStyle, getListStyle } from "../../utils/Utils";
import FolderForm from "./FolderForm";

const QuestionSet = (props) => {
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

  const handleEditFolder = (folder) => {
    setFolder(folder);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFolder(null);
  };

  const handleDeleteFolder = (folder) => {
    deleteFolder(questionSet.id, folder.id)
      .then((res) => {
        fetchFolders();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDragEnd = (result) => {
    let order = [];
    const copy = [...folders];
    copy.splice(
      result.destination.index,
      0,
      copy.splice(result.source.index, 1)[0]
    );
    copy.forEach((dis, index) => {
      order.push(dis.id);
    });
    orderFolders(questionSet.id, {
      order,
    }).then((res) => {
      fetchFolders();
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`${questionSet.id}-folders`}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <List
                dataSource={folders}
                renderItem={(folder, index) => (
                  <Draggable
                    key={folder.id}
                    draggableId={folder.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <List.Item>
                          <Col span={2}>
                            <DragOutlined />
                          </Col>
                          <Col span={16}>{folder.title}</Col>
                          <Col span={6}>
                            <Row
                              type="flex"
                              justify="space-around"
                              align="middle"
                              key={`${folder.id}`}
                            >
                              <EditButton
                                handleClick={(event) => {
                                  event.stopPropagation();
                                  handleEditFolder(folder);
                                }}
                              />
                              <Button
                                type="primary"
                                title="Questions"
                                onClick={() =>
                                  props.questionSubset(folder, null)
                                }
                              >
                                <DatabaseOutlined />
                              </Button>
                              <TranslationButton
                                handleClick={() =>
                                  props.handleFolderTranslations(folder)
                                }
                              />
                              <DeleteButton
                                handleClick={(event) => {
                                  event.stopPropagation();
                                  if (
                                    // eslint-disable-next-line no-alert
                                    window.confirm(
                                      `Are you sure you want to delete ${folder.title}?`
                                    )
                                  )
                                    handleDeleteFolder(folder);
                                }}
                              />
                            </Row>
                          </Col>
                        </List.Item>
                      </div>
                    )}
                  </Draggable>
                )}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
};

export default QuestionSet;
