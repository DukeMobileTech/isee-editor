import React, { useState, useEffect } from "react";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Section from "./Section";

const ACCESS_TOKEN = "2ec6cc8beeb8df73d1232a5961087ada";

function Instrument({ match }) {
  const instrumentId = match.params.id;
  const [instrument, setInstrument] = useState({});

  useEffect(() => {
    const fetchInstrument = async () => {
      const result = await axios(
        `http://localhost:3000/api/v4/projects/1/instruments/${instrumentId}?access_token=${ACCESS_TOKEN}`
      );
      setInstrument(result.data);
    };
    fetchInstrument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
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
                    <Section section={section} displays={instrument.displays} />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}
      </Accordion>
    </div>
  );
}

export default Instrument;
