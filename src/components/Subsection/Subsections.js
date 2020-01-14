import { Button, Col, Divider, List, Row, Icon } from "antd";
import {
  DeleteButton,
  EditButton,
  FolderAddButton,
  LeftCancelButton
} from "../../utils/Buttons";
import React, { Fragment, useContext, useState, useEffect } from "react";

import { CenteredH3 } from "../../utils/Styles";
import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";
import SubsectionForm from "./SubsectionForm";
import { deleteDisplay } from "../../utils/api/display";
import { getSections, orderDisplays } from "../../utils/api/section";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getListStyle, getItemStyle } from "../../utils/Utils";

const Subsections = props => {
  // eslint-disable-next-line no-unused-vars
  const [sections, setSections] = useContext(InstrumentSectionContext);
  const section = props.section;
  const [displays, setDisplays] = useState(section.displays);
  const [showForm, setShowForm] = useState(false);
  const [display, setDisplay] = useState(null);

  useEffect(() => {
    sections.forEach(sec => {
      if (sec.id === section.id) {
        setDisplays(sec.displays);
      }
    });
  }, [section, sections]);

  const fetchSections = async () => {
    setShowForm(false);
    const results = await getSections(
      props.instrument.project_id,
      props.instrument.id
    );
    setSections(results.data);
  };

  const handleNewDisplay = () => {
    setDisplay(null);
    setShowForm(true);
  };

  const handleEditDisplay = display => {
    setDisplay(display);
    setShowForm(true);
  };

  const handleDeleteDisplay = display => {
    deleteDisplay(
      props.instrument.project_id,
      display.instrument_id,
      display.id
    )
      .then(res => {
        fetchSections();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const FooterButtons = () => {
    return (
      <Row>
        <LeftCancelButton handleClick={props.handleCancel} />
        <FolderAddButton handleClick={handleNewDisplay} />
      </Row>
    );
  };

  const onDragEnd = result => {
    let order = [];
    const copy = [...displays];
    copy.splice(
      result.destination.index,
      0,
      copy.splice(result.source.index, 1)[0]
    );
    copy.forEach((dis, index) => {
      order.push(dis.id);
    });
    orderDisplays(
      props.instrument.project_id,
      props.instrument.id,
      section.id,
      {
        order
      }
    ).then(res => {
      fetchSections();
    });
  };

  const DisplaysView = () => {
    if (showForm) {
      return (
        <SubsectionForm
          instrument={props.instrument}
          section={section}
          display={display}
          handleCancel={handleCancel}
          fetchSections={fetchSections}
        />
      );
    } else {
      return (
        <Fragment>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <List
                    footer={<FooterButtons />}
                    bordered
                    dataSource={displays}
                    renderItem={(display, index) => (
                      <Draggable
                        key={display.id}
                        draggableId={display.id}
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
                                <Icon type="drag" />
                              </Col>
                              <Col span={16}>
                                <Button
                                  type="link"
                                  onClick={() => props.showQuestions(display)}
                                >
                                  {display.title}
                                </Button>
                              </Col>
                              <Col span={6}>
                                <EditButton
                                  handleClick={() => handleEditDisplay(display)}
                                />
                                <Divider type="vertical" />
                                <DeleteButton
                                  handleClick={() => {
                                    if (
                                      window.confirm(
                                        `Are you sure you want to delete ${display.title}?`
                                      )
                                    )
                                      handleDeleteDisplay(display);
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
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <CenteredH3>{section.title}</CenteredH3>
      <DisplaysView />
    </Fragment>
  );
};

export default Subsections;
