import React, { Fragment } from "react";
import { Col, List, Row } from "antd";
import { DragOutlined } from "@ant-design/icons";

import { CenteredH3 } from "../../utils/Styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getListStyle, getItemStyle } from "../../utils/Utils";
import { LeftCancelButton } from "../../utils/Buttons";
import { orderInstrumentQuestions } from "../../utils/api/display";

const DisplayQuestions = props => {
  const instrumentQuestions = props.instrumentQuestions;
  const display = props.display;

  const onDragEnd = result => {
    let order = [];
    const copy = [...instrumentQuestions];
    copy.splice(
      result.destination.index,
      0,
      copy.splice(result.source.index, 1)[0]
    );
    copy.forEach((dis, index) => {
      order.push(dis.id);
    });
    orderInstrumentQuestions(
      props.projectId,
      display.instrument_id,
      display.id,
      {
        order
      }
    ).then(res => {
      props.fetchDisplay();
    });
  };

  return (
    <Fragment>
      <CenteredH3>{display.title}</CenteredH3>
      <Row type="flex" justify="space-around" align="middle">
        <Col span={1} />
        <Col span={3}>
          <strong>Position</strong>
        </Col>
        <Col span={3}>
          <strong>Identifier</strong>
        </Col>
        <Col span={17}>
          <strong>Text</strong>
        </Col>
      </Row>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="instrumentQuestions">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <List
                bordered
                dataSource={instrumentQuestions}
                renderItem={(instrumentQuestion, index) => (
                  <Draggable
                    key={instrumentQuestion.id}
                    draggableId={instrumentQuestion.id}
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
                          <Col span={1}>
                            <DragOutlined />
                          </Col>
                          <Col span={3}>{instrumentQuestion.position}</Col>
                          <Col span={3}>{instrumentQuestion.identifier}</Col>
                          <Col span={17}>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: instrumentQuestion.question.text
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
      <div style={{ marginTop: "5px" }}>
        <LeftCancelButton
          handleClick={() => props.setShowOrder(!props.setShowOrder)}
        />
      </div>
    </Fragment>
  );
};

export default DisplayQuestions;
