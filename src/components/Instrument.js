import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Table from "react-bootstrap/Table";

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

  function renderInstrument() {
    let currentSection = "";
    return (
      instrument.displays &&
      instrument.displays.map((display, index) => {
        const { id, position, title, section_title, question_range } = display;
        if (currentSection !== section_title) {
          currentSection = section_title;
          return (
            <React.Fragment key={`${index}_${id}`}>
              <tr key={section_title}>
                <td colSpan="12" className="text-center">
                  <h5>{section_title}</h5>
                </td>
              </tr>
              <tr key={id}>
                <th>{position}</th>
                <td>
                  <Link to={`/instruments/${instrumentId}/displays/${id}`}>
                    {title}
                  </Link>
                </td>
                <td>{question_range}</td>
              </tr>
            </React.Fragment>
          );
        } else {
          currentSection = section_title;
          return (
            <tr key={id}>
              <th>{position}</th>
              <td>
                <Link to={`/instruments/${instrumentId}/displays/${id}`}>
                  {title}
                </Link>
              </td>
              <td>{question_range}</td>
            </tr>
          );
        }
      })
    );
  }

  return (
    <div>
      <h1 className="text-center">{instrument.title}</h1>
      <h4 className="text-center">Sections</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Position</th>
            <th>Title</th>
            <th>Question Range</th>
          </tr>
        </thead>
        <tbody>{renderInstrument()}</tbody>
      </Table>
    </div>
  );
}

export default Instrument;
