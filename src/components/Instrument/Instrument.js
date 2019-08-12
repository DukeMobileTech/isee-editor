import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Section from "../Section/Section";
import { getInstrument } from "../../utils/API";

function Instrument({ match }) {
  const projectId = match.params.project_id;
  const instrumentId = match.params.id;
  const [instrument, setInstrument] = useState({});
  const [sectionCount, setSectionCount] = useState(0);

  useEffect(() => {
    const fetchInstrument = async () => {
      const result = await getInstrument(projectId, instrumentId);
      setInstrument(result.data);
      setSectionCount(result.data.sections.length);
    };
    fetchInstrument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <h1 className="text-center">{instrument.title}</h1>
      <Accordion>
        {instrument.sections &&
          instrument.sections.map((section, index) => {
            return (
              <Card key={section.id}>
                <Accordion.Toggle
                  as={Card.Header}
                  eventKey={`${index}`}
                  className="text-center"
                >
                  <h3>{section.title}</h3>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={`${index}`}>
                  <Card.Body>
                    <Section
                      projectId={projectId}
                      section={section}
                      sectionCount={sectionCount}
                      displays={instrument.displays}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}
      </Accordion>

      <Link
        className="btn btn-primary mt-1 float-right"
        to={{
          pathname: `/projects/${projectId}/instruments/${instrumentId}/sections/new`,
          state: { sectionCount: sectionCount }
        }}
      >
        New Section
      </Link>
    </React.Fragment>
  );
}

export default Instrument;
