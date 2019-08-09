import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { getInstruments, deleteInstrument } from "../utils/API";
import Button from "react-bootstrap/Button";

const Home = () => {
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    const fetchInstruments = async () => {
      const results = await getInstruments();
      setInstruments(results.data);
    };
    fetchInstruments();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInstrumentDelete = instrument => {
    deleteInstrument(instrument.project_id, instrument.id)
      .then(results => {
        let index = instruments.indexOf(instrument);
        instruments.splice(index, 1);
        setInstruments([...instruments]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const renderInstruments = () => {
    return instruments.map((instrument, index) => {
      const {
        id,
        title,
        project,
        project_id,
        published,
        current_version_number,
        question_count
      } = instrument;
      return (
        <tr key={id}>
          <th>
            <Link to={`/projects/${project_id}/instruments/${id}`}>
              {title}
            </Link>
          </th>
          <td>{project}</td>
          <td>{published.toString()}</td>
          <td>{current_version_number}</td>
          <td>{question_count}</td>
          <td>
            <Link
              className="btn btn-primary mr-1"
              to={{
                pathname: `/projects/${project_id}/instruments/${id}/edit`,
                state: { instrument }
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
                    `Are you sure you want to delete ${instrument.title}?`
                  )
                )
                  handleInstrumentDelete(instrument);
              }}
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    });
  };

  return (
    <React.Fragment>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Project</th>
            <th>Published</th>
            <th>Version</th>
            <th>Question Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderInstruments()}</tbody>
      </Table>
      <Button className="float-right" variant="primary" href="/instruments/new">
        New Instrument
      </Button>
    </React.Fragment>
  );
};

export default Home;
