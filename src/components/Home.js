import React from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { getInstruments } from "../utils/API";

class Home extends React.Component {
  state = {
    instruments: []
  };

  componentDidMount() {
    getInstruments().then(res => {
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
