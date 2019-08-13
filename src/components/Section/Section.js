import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Display from "../Display/Display";
import { deleteDisplay } from "../../utils/API";

const Section = props => {
  const section = props.section;
  const [displays, setDisplays] = useState(
    props.displays.filter(dis => dis.section_id === section.id)
  );

  const handleDisplayDelete = display => {
    deleteDisplay(props.projectId, section.instrument_id, display.id)
      .then(res => {
        displays.splice(displays.indexOf(display), 1);
        setDisplays([...displays]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <Accordion key={`${section.id}_${section.title}`}>
        {displays.map((display, index) => {
          return (
            <Card key={display.id}>
              <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
                <Row>
                  <Col xs={2}>
                    <h5>{display.position}</h5>
                  </Col>
                  <Col>
                    <h5>{display.title}</h5>
                  </Col>
                  <Col xs={2}>
                    <Link
                      className="btn btn-primary mr-1"
                      to={{
                        pathname: `/projects/${props.projectId}/instruments/${section.instrument_id}/displays/${display.id}/edit`,
                        state: {
                          display,
                          sectionId: section.id,
                          displayPosition: display.position
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
                            `Are you sure you want to delete ${display.title}?`
                          )
                        )
                          handleDisplayDelete(display);
                      }}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={`${index}`}>
                <Card.Body>
                  <Display projectId={props.projectId} display={display} />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          );
        })}
      </Accordion>
      <Link
        className="btn btn-primary mt-1 mb-1 float-right"
        to={{
          pathname: `/projects/${props.projectId}/instruments/${section.instrument_id}/displays/new`,
          state: {
            displayPosition:
              displays && displays.size > 0
                ? displays.slice(-1)[0].position
                : props.displays.slice(-1)[0].position,
            sectionId: section.id
          }
        }}
      >
        New Display
      </Link>
    </React.Fragment>
  );
};

export default Section;
