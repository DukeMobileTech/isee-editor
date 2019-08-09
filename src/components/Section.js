import React from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Display from "./Display";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Section = props => {
  const section = props.section;
  const displays = props.displays.filter(dis => dis.section_id === section.id);

  return (
    <React.Fragment>
      <Link
        className="btn btn-primary mb-1 "
        to={{
          pathname: `/projects/${props.projectId}/instruments/${section.instrument_id}/sections/${section.id}/edit`,
          state: { section, sectionCount: props.sectionCount }
        }}
      >
        Edit Section
      </Link>
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
    </React.Fragment>
  );
};

export default Section;
