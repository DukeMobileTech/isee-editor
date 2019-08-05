import React from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Table from "react-bootstrap/Table";

class Home extends React.Component {
  state = {
    instruments: []
  };

  componentDidMount() {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("authenticationToken");
    axios
      .get(
        `http://localhost:3000/api/v4/instruments?user_email=${email}&authentication_token=${token}`
      )
      .then(res => {
        const instruments = res.data;
        this.setState({ instruments });
      })
      .catch(error => {
        // console.log(error.response.status);
        if (error.response.status === 401) {
          console.log("401");
          // <Redirect to="/login" />;
        }
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
