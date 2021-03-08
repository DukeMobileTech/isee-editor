import { DragOutlined } from "@ant-design/icons";
import { Col, List, Row } from "antd";
import React, { Fragment } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { orderQuestions } from "../../utils/api/folder";
import { LeftCancelButton } from "../../utils/Buttons";
import { getItemStyle, getListStyle } from "../../utils/Utils";

const QuestionReorder = (props) => {
  const onDragEnd = (result) => {
    let order = [];
    const copy = [...props.questions];
    copy.splice(
      result.destination.index,
      0,
      copy.splice(result.source.index, 1)[0]
    );
    copy.forEach((dis, index) => {
      order.push(dis.id);
    });
    orderQuestions(props.folder.question_set_id, props.folder.id, {
      order,
    }).then((res) => {
      props.fetchQuestions();
    });
  };

  return (
    <Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="folder-questions">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <List
                dataSource={props.questions}
                renderItem={(question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
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
                            {question.position}
                          </Col>
                          <Col span={10}>{question.question_identifier}</Col>
                          <Col span={12}>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: question.text,
                              }}
                            />
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
      <Row style={{ marginTop: "5px" }}>
        <LeftCancelButton
          handleClick={() => props.setReorder(!props.reorder)}
        />
      </Row>
    </Fragment>
  );
};

export default QuestionReorder;
