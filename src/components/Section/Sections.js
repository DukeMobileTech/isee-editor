import React, { useState } from "react";
import { List, Col, Button, Divider, Icon, Typography } from "antd";
import { deleteSection, getSections, updateSection } from "../../utils/API";
import SectionForm from "./SectionForm";
import Subsections from "./Subsection/Subsections";
import {
  FolderAddButton,
  EditButton,
  DeleteButton,
  getItemStyle,
  getListStyle
} from "../../utils/Utils";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const InstrumentSections = props => {
  const instrument = props.instrument;
  const [sections, setSections] = useState(props.sections);
  const [showForm, setShowForm] = useState(false);
  const [showDisplays, setShowDisplays] = useState(false);
  const [section, setSection] = useState(null);

  const handleDeleteSection = section => {
    deleteSection(instrument.project_id, instrument.id, section.id)
      .then(res => {
        fetchUpdatedSections();
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
  };

  const handleOpenSection = section => {
    setSection(section);
    setShowDisplays(true);
  };

  const fetchUpdatedSections = async () => {
    setShowForm(false);
    const results = await getSections(instrument.project_id, instrument.id);
    setSections(results.data);
  };

  const onDragEnd = result => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const movedSection = sections[result.source.index];
    movedSection.position = result.destination.index + 1;

    updateSection(
      instrument.project_id,
      instrument.id,
      movedSection.id,
      movedSection
    ).then(res => fetchUpdatedSections());
  };

  const SectionsView = () => {
    if (showForm) {
      return (
        <SectionForm
          instrument={instrument}
          section={section}
          sectionCount={sections.length}
          fetchUpdatedSections={fetchUpdatedSections}
          handleCancel={handleCancel}
        />
      );
    } else if (showDisplays) {
      return (
        <Subsections
          section={section}
          instrument={instrument}
          sections={sections}
          handleCancel={handleCancel}
        />
      );
    } else {
      return <SectionList />;
    }
  };

  const SectionList = () => {
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
                          <Col span={2}>
                            <Icon type="drag" />{" "}
                            <Typography.Text strong>
                              {section.position}
                            </Typography.Text>
                          </Col>
                          <Col span={14}>{section.title}</Col>
                          <Col span={8}>
                            <Button onClick={() => handleOpenSection(section)}>
                              <Icon type="folder-open" />
                            </Button>
                            <Divider type="vertical" />
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
  };

  return <SectionsView />;
};

export default InstrumentSections;
