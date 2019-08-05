import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

const Display = props => {
  const projectId = props.projectId;
  const instrumentId = props.display.instrument_id;
  const id = props.display.id;
  const [display, setDisplay] = useState({});

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("authenticationToken");

    const fetchDisplay = async () => {
      const result = await axios(
        `http://localhost:3000/api/v4/projects/${projectId}/instruments/${instrumentId}/displays/${id}?user_email=${email}&authentication_token=${token}`
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
