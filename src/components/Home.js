import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Table from "react-bootstrap/Table";

const ACCESS_TOKEN = "2ec6cc8beeb8df73d1232a5961087ada";

class Home extends React.Component {
  state = {
    instruments: []
  };

  componentDidMount() {
    axios
      .get(
        `http://localhost:3000/api/v4/projects/1/instruments?access_token=${ACCESS_TOKEN}`
      )
      .then(res => {
        const instruments = res.data;
        this.setState({ instruments });
      });
  }

  renderInstruments() {
    return this.state.instruments.map((instrument, index) => {
      const {
        id,
        title,
        project,
        published,
        current_version_number,
        question_count
      } = instrument;
      return (
        <tr key={id}>
          <th>
            <Link to={`/instruments/${id}`}>{title}</Link>
          </th>
          <td>{project}</td>
          <td>{published.toString()}</td>
          <td>{current_version_number}</td>
          <td>{question_count}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Published</th>
              <th>Version</th>
              <th>Question Count</th>
            </tr>
          </thead>
          <tbody>{this.renderInstruments()}</tbody>
        </Table>
      </div>
    );
  }
}

export default Home;
