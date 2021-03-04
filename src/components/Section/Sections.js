import * as Yup from "yup";
import React, { useContext, useState, Fragment, useEffect } from "react";
import { Button, Col, Divider, List, Row, Drawer } from "antd";
import { DragOutlined, PlusOutlined, GlobalOutlined } from "@ant-design/icons";
import { Formik, Form, Field } from "formik";

import {
  DeleteButton,
  EditButton,
  LeftCancelButton,
  RightSubmitButton
} from "../../utils/Buttons";
import {
  getItemStyle,
  getListStyle,
  DRow,
  AlertErrorMessage
} from "../../utils/Utils";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  deleteSection,
  getSections,
  updateSection,
  createSection
} from "../../utils/api/section";

import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";
import Displays from "./Displays";
import Translations from "../SectionTranslation/Translations";

const SectionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const Sections = props => {
  const instrument = props.instrument;
  const projectId = props.projectId;
  const instrumentId = props.instrumentId;
  const [sections, setSections] = useContext(InstrumentSectionContext);
  const [showForm, setShowForm] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);
  const [section, setSection] = useState(null);
  const [showDisplays, setShowDisplays] = useState(false);

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSections = async () => {
    handleCancel();
    const results = await getSections(projectId, instrumentId);
    setSections(results.data);
  };

  const handleDeleteSection = section => {
    deleteSection(projectId, instrumentId, section.id)
      .then(res => {
        fetchSections();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleEditSection = section => {
    setSection(section);
    setShowForm(true);
  };

  const handleNewSection = () => {
    setSection(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowDisplays(false);
    setSection(null);
  };

  const handleShowDisplays = section => {
    setSection(section);
    setShowDisplays(true);
  };

  const onDragEnd = async result => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const movedSection = sections[result.source.index];
    movedSection.position = result.destination.index + 1;

    await updateSection(
      instrument.project_id,
      instrument.id,
      movedSection.id,
      movedSection
    );
    fetchSections();
  };

  const handleSectionTranslations = () => {
    setShowTranslations(!showTranslations);
  };

  if (showTranslations) {
    return (
      <Translations
        instrument={instrument}
        sections={sections}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
      />
    );
  } else if (showDisplays) {
    return (
      <Displays
        section={section}
        instrument={instrument}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Fragment>
        <Row gutter={8} type="flex" justify="space-between" style={{ margin: "5px" }}>
          <Button
            title="Show Translations"
            type="primary"
            onClick={handleSectionTranslations}
            style={{ marginRight: "2px" }}
          >
            <GlobalOutlined />
          </Button>
          <Button
            style={{ float: "right" }}
            type="primary"
            title="Add New"
            onClick={handleNewSection}
          >
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
                  dataSource={sections}
                  renderItem={(section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
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
                                onClick={() => handleShowDisplays(section)}
                              >
                                {section.title}
                              </Button>
                            </Col>
                            <Col span={3}>
                              <EditButton
                                handleClick={() => handleEditSection(section)}
                              />
                              <Divider type="vertical" />
                              <DeleteButton
                                handleClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete ${section.title}?`
                                    )
                                  )
                                    handleDeleteSection(section);
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
          title={section === null ? "New Section" : section.title}
          placement={"right"}
          width={720}
          closable={false}
          onClose={handleCancel}
          visible={showForm}
          key={"right"}
          destroyOnClose={true}
        >
          <Formik
            initialValues={{
              id: (section && section.id) || null,
              title: (section && section.title) || "",
              instrument_id:
                (section && section.instrument_id) || instrument.id,
              position:
                (section && section.position) || instrument.section_count + 1
            }}
            validationSchema={SectionSchema}
            onSubmit={(values, { setErrors }) => {
              const secObj = {
                id: values.id,
                title: values.title,
                instrument_id: values.instrument_id,
                position: values.position
              };
              if (values.id) {
                updateSection(
                  instrument.project_id,
                  values.instrument_id,
                  values.id,
                  secObj
                )
                  .then(res => {
                    fetchSections();
                  })
                  .catch(error => {
                    for (const err of error.data.errors) {
                      if (err.includes("Title")) {
                        setErrors({ title: err });
                      }
                    }
                  });
              } else {
                createSection(
                  instrument.project_id,
                  values.instrument_id,
                  secObj
                )
                  .then(res => {
                    fetchSections();
                  })
                  .catch(error => {
                    for (const err of error.data.errors) {
                      if (err.includes("Title")) {
                        setErrors({ title: err });
                      }
                    }
                  });
              }
            }}
            render={({ values }) => (
              <Form>
                <DRow>
                  <Col span={18}>
                    <Field
                      className="ant-input"
                      name="title"
                      placeholder="Enter title"
                      type="text"
                    />
                  </Col>
                  <Col span={6}>
                    <AlertErrorMessage name="title" type="error" />
                  </Col>
                </DRow>
                <DRow>
                  <LeftCancelButton handleClick={handleCancel} />
                  <RightSubmitButton />
                </DRow>
              </Form>
            )}
          />
        </Drawer>
      </Fragment>
    );
  }
};

export default Sections;
