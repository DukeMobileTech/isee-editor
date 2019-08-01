import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

const ACCESS_TOKEN = "2ec6cc8beeb8df73d1232a5961087ada";

const Display = props => {
  const instrumentId = props.display.instrument_id;
  const id = props.display.id;
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
            <td
              dangerouslySetInnerHTML={{
                __html: text
              }}
            />
            <td>
              {options &&
                options.map((option, index) => {
                  return (
                    <span key={option.id}>
                      {" "}
                      <b>{index + 1})</b> {option.text}{" "}
                    </span>
                  );
                })}
            </td>
          </tr>
        );
      })
    );
  }

  return (
    <Table hover size="sm" responsive>
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
  );
};

export default Display;
