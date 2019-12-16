import { Button, Col, Divider, Icon, List, Typography } from "antd";
import {
  DeleteButton,
  EditButton,
  FolderAddButton,
  getItemStyle,
  getListStyle
} from "../../utils/Utils";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React, { useContext, useState } from "react";
import {
  deleteSection,
  getSections,
  updateSection
} from "../../utils/api/section";

import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";
import SectionForm from "./SectionForm";
import Subsections from "./Subsection/Subsections";

const Sections = props => {
  const instrument = props.instrument;
  const [sections, setSections] = useContext(InstrumentSectionContext);
  const [showForm, setShowForm] = useState(false);

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
    props.setSection(section);
    setShowForm(true);
  };

  const handleNewSection = () => {
    props.setSection(null);
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

  if (showForm) {
    return (
      <SectionForm
        instrument={instrument}
        section={props.section}
        handleCancel={handleCancel}
        fetchSections={fetchSections}
        maxCount={sections.length + 1}
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <List
                footer={<FolderAddButton handleClick={handleNewSection} />}
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
                            <Icon type="drag" />{" "}
                            <Typography.Text strong>
                              {section.position}
                            </Typography.Text>
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
    );
  }
};

export default Sections;
