import React, { useContext, useState, useEffect } from "react";
import { Button, Col, Divider, List, Row, Drawer, Layout, Menu } from "antd";
import { DragOutlined, PlusOutlined, GlobalOutlined } from "@ant-design/icons";

import {
  DeleteButton,
  EditButton,
  LeftCancelButton
} from "../../utils/Buttons";
import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";
import DisplayForm from "./DisplayForm";
import { deleteDisplay } from "../../utils/api/display";
import { getSections, orderDisplays } from "../../utils/api/section";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getListStyle, getItemStyle } from "../../utils/Utils";
import Display from "../Display/Display";
import { Translations } from "../DisplayTranslation/Translations";
import { CenteredH2, CenteredH4 } from "../../utils/Styles";

const Displays = props => {
  // eslint-disable-next-line no-unused-vars
  const [sections, setSections] = useContext(InstrumentSectionContext);
  const [section, setSection] = useState(props.section);
  const [displays, setDisplays] = useState(section.displays);
  const [showForm, setShowForm] = useState(false);
  const [display, setDisplay] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);

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
    setShowQuestions(false);
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

  const handleShowQuestions = display => {
    setDisplay(display);
    setShowQuestions(true);
  };

  const handleTranslations = () => {
    setShowTranslations(!showTranslations);
  };

  const handleSectionClick = item => {
    const clickedSection = sections.find(sec => sec.id === Number(item.key));
    setSection(clickedSection);
  };

  if (showTranslations) {
    return (
      <Translations
        instrument={props.instrument}
        displays={displays}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
      />
    );
  } else if (showQuestions) {
    return (
      <Display
        display={display}
        displays={displays}
        section={section}
        projectId={props.instrument.project_id}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Layout>
        <Layout.Sider width={250} style={{ background: "#ffffff" }}>
          <CenteredH4>Sections</CenteredH4>
          <Menu
            key={section.title}
            defaultSelectedKeys={[`${section.id}`]}
            defaultOpenKeys={[`${section.id}`]}
            onClick={handleSectionClick}
          >
            {sections.map(sectionItem => {
              return (
                <Menu.Item key={`${sectionItem.id}`}>
                  {sectionItem.title}
                </Menu.Item>
              );
            })}
          </Menu>
        </Layout.Sider>
        <Layout.Content>
          <CenteredH2>{section.title}</CenteredH2>
          <Row
            gutter={8}
            type="flex"
            justify="space-between"
            align="middle"
            style={{ margin: "5px" }}
          >
            <LeftCancelButton handleClick={props.handleCancel} />
            <Button
              title="Show Translations"
              type="primary"
              onClick={handleTranslations}
            >
              <GlobalOutlined />
            </Button>
            <Button type="primary" title="Add New" onClick={handleNewDisplay}>
              <PlusOutlined />
            </Button>
          </Row>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <List
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
                              <Col span={1}>
                                <DragOutlined />
                              </Col>
                              <Col span={19}>
                                <Button
                                  type="link"
                                  onClick={() => handleShowQuestions(display)}
                                >
                                  {display.title}
                                </Button>
                              </Col>
                              <Col span={3}>
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
          <Drawer
            title={display === null ? "New Subsection" : display.title}
            placement={"right"}
            width={720}
            closable={false}
            onClose={handleCancel}
            visible={showForm}
            key={"right"}
            destroyOnClose={true}
          >
            <DisplayForm
              instrument={props.instrument}
              section={section}
              display={display}
              handleCancel={handleCancel}
              fetchSections={fetchSections}
            />
          </Drawer>
        </Layout.Content>
      </Layout>
    );
  }
};

export default Displays;
