import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";

const ACCESS_TOKEN = "2ec6cc8beeb8df73d1232a5961087ada";

const Display = ({ match }) => {
  const instrumentId = match.params.instrument_id;
  const id = match.params.id;
  const [display, setDisplay] = useState({});

  useEffect(() => {
    const fetchDisplay = async () => {
      const result = await axios(
        `http://localhost:3000/api/v4/projects/1/instruments/${instrumentId}/displays/${id}?access_token=${ACCESS_TOKEN}`
      );
      setDisplay(result.data);
    };
    fetchDisplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderDisplay() {
    return (
      display.instrument_questions &&
      display.instrument_questions.map(instrumentQuestion => {
        const {
          id,
          number_in_instrument,
          identifier,
          type,
          text,
          options
        } = instrumentQuestion;
        return (
          <tr key={id}>
            <th>{number_in_instrument}</th>
            <td>{identifier}</td>
            <td>{type}</td>
            <td dangerouslySetInnerHTML={{ __html: text }} />
            <td>
              {options &&
                options.map(option => {
                  return <li key={option.id}> {option.text} </li>;
                })}
            </td>
          </tr>
        );
      })
    );
  }

  return (
    <Container>
      <h1 className="text-center">{display.title}</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Position</th>
            <th>Identifier</th>
            <th>Type</th>
            <th>Text</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>{renderDisplay()}</tbody>
      </Table>
      <Row>
        <Col>
          <Button
            onClick={() => console.log("Previous")}
            variant="primary"
            size="lg"
            className="float-left"
          >
            <GoChevronLeft />
            Previous
          </Button>
        </Col>
        <Col xs={8} />
        <Col>
          <Button
            onClick={() => console.log("Next")}
            variant="primary"
            size="lg"
            className="float-right"
          >
            Next <GoChevronRight />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Display;
