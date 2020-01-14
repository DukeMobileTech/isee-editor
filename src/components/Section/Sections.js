import { Button, Col, Divider, Icon, List, Row } from "antd";
import { DeleteButton, EditButton } from "../../utils/Buttons";
import { getItemStyle, getListStyle } from "../../utils/Utils";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React, { useContext, useState, Fragment } from "react";
import {
  deleteSection,
  getSections,
  updateSection
} from "../../utils/api/section";

import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";
import SectionForm from "./SectionForm";
import Subsections from "../Subsection/Subsections";
import Translations from "../SectionTranslation/Translations";
import { Translations as DisplayTranslations } from "../DisplayTranslation/Translations";

const Sections = props => {
  const instrument = props.instrument;
  const [sections, setSections] = useContext(InstrumentSectionContext);
  const [showForm, setShowForm] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);
  const [showSubsectionTranslations, setShowSubsectionTranslations] = useState(
    false
  );
  // eslint-disable-next-line no-unused-vars
  const [displays, setDisplays] = useState(
    [].concat.apply([], sections.map(section => section.displays))
  );
  const [section, setSection] = useState(null);

  const fetchSections = async () => {
    setShowForm(false);
    const results = await getSections(instrument.project_id, instrument.id);
    setSections(results.data);
  };

  const handleDeleteSection = section => {
    deleteSection(instrument.project_id, instrument.id, section.id)
      .then(res => {
        fetchSections();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleEditSection = section => {
    setShowForm(true);
    setSection(section);
  };

  const handleNewSection = () => {
    setSection(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    props.setShowDisplays(false);
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

  const handleSubsectionTranslations = () => {
    setShowSubsectionTranslations(!showSubsectionTranslations);
  };

  if (showForm) {
    return (
      <SectionForm
        instrument={instrument}
        section={section}
        handleCancel={handleCancel}
        fetchSections={fetchSections}
      />
    );
  } else if (showTranslations) {
    return (
      <Translations
        instrument={instrument}
        sections={sections}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
      />
    );
  } else if (showSubsectionTranslations) {
    return (
      <DisplayTranslations
        instrument={instrument}
        displays={displays}
        setShowTranslations={setShowSubsectionTranslations}
        showTranslations={showSubsectionTranslations}
      />
    );
  } else if (props.showDisplays) {
    return (
      <Subsections
        section={props.section}
        instrument={instrument}
        sections={sections}
        handleCancel={handleCancel}
        showQuestions={props.showQuestions}
      />
    );
  } else {
    return (
      <Fragment>
        <Row style={{ margin: "3px" }}>
          <Button
            title="Show Section Translations"
            type="primary"
            onClick={handleSectionTranslations}
            style={{ marginRight: "2px" }}
          >
            <Icon type="global" />
            Sections
          </Button>
          <Button
            title="Show Subsection Translations"
            type="primary"
            onClick={handleSubsectionTranslations}
            style={{ marginLeft: "2px" }}
          >
            <Icon type="global" />
            Subsections
          </Button>
          <Button
            style={{ float: "right" }}
            type="primary"
            title="Add New"
            onClick={handleNewSection}
          >
            <Icon type="plus" />
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
                            <Col span={4}>
                              <Icon type="drag" />
                            </Col>
                            <Col span={14}>
                              <Button
                                type="link"
                                onClick={() => props.handleOpenSection(section)}
                              >
                                {section.title}
                              </Button>
                            </Col>
                            <Col span={6}>
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
      </Fragment>
    );
  }
};

export default Sections;
