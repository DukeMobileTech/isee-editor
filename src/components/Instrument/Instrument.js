import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Section from "../Section/Section";
import { getInstrument, deleteSection, updateSection } from "../../utils/API";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const padding = 5;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: padding * 2,
  margin: `0 0 ${padding}px 0`,
  background: isDragging ? "green" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightgray" : "white",
  padding: padding
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Instrument = ({ match }) => {
  const projectId = match.params.project_id;
  const instrumentId = match.params.id;
  const [instrument, setInstrument] = useState({});
  const [sections, setSections] = useState([]);
  let currentIndex = null;

  useEffect(() => {
    const fetchInstrument = async () => {
      const result = await getInstrument(projectId, instrumentId);
      setInstrument(result.data);
      setSections(result.data.sections);
    };
    fetchInstrument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragEnd = result => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }
    let movedSection = sections[result.source.index];
    movedSection.position = result.destination.index + 1;
    const reorderedSections = reorder(
      sections,
      result.source.index,
      result.destination.index
    );
    setSections(reorderedSections);
    updateSection(projectId, instrumentId, movedSection.id, movedSection)
      .then(response => {
        if (response.status === 204) {
          window.location.reload();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSectionDelete = section => {
    deleteSection(projectId, instrumentId, section.id)
      .then(res => {
        sections.splice(sections.indexOf(section), 1);
        setSections([...sections]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <h1 className="text-center">{instrument.title}</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <Accordion>
                {sections &&
                  sections.map((section, index) => {
                    return (
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={index}
                        isDragDisabled={index === currentIndex}
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
                            <Card key={section.id}>
                              <Accordion.Toggle
                                as={Card.Header}
                                eventKey={`${index}`}
                                className="text-left"
                              >
                                <Row>
                                  <Col xs={1}>{section.position}</Col>
                                  <Col className="text-center">
                                    <h5>{section.title}</h5>
                                  </Col>
                                  <Col xs={2}>
                                    <Link
                                      className="btn btn-primary mr-1"
                                      to={{
                                        pathname: `/projects/${projectId}/instruments/${section.instrument_id}/sections/${section.id}/edit`,
                                        state: {
                                          section,
                                          sectionCount: sections.length
                                        }
                                      }}
                                    >
                                      Edit
                                    </Link>
                                    <Button
                                      className="ml-1"
                                      variant="danger"
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            `Are you sure you want to delete ${section.title}?`
                                          )
                                        )
                                          handleSectionDelete(section);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Col>
                                </Row>
                              </Accordion.Toggle>
                              <Accordion.Collapse eventKey={`${index}`}>
                                <Card.Body>
                                  <Section
                                    projectId={projectId}
                                    section={section}
                                    sectionCount={sections.length}
                                    displays={instrument.displays}
                                  />
                                </Card.Body>
                              </Accordion.Collapse>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
              </Accordion>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Link
        className="btn btn-primary mt-1 float-right"
        to={{
          pathname: `/projects/${projectId}/instruments/${instrumentId}/sections/new`,
          state: { sectionCount: sections.length }
        }}
      >
        New Section
      </Link>
    </React.Fragment>
  );
};

export default Instrument;
