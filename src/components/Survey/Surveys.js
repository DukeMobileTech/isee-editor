import React, { useEffect, useState } from "react";
import { Spin, Table } from "antd";

import { Link } from "react-router-dom";
import { getSurveys } from "../../utils/api/survey";

const { Column } = Table;

const Surveys = () => {
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    const results = await getSurveys();
    setSurveys(results.data);
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Table bordered dataSource={surveys} rowKey={survey => survey.id}>
        <Column title="Id" dataIndex="id" />
        <Column title="UUID" dataIndex="uuid" />
        <Column title="Identifier" dataIndex="identifier" />
        <Column title="Instrument" dataIndex="instrument_title" />
        <Column title="Project" dataIndex="project_name" />
        <Column title="Received On" dataIndex="created_at" />
        <Column title="Device" dataIndex="device_label" />
        <Column title="Completion Rate" dataIndex="completion_rate" />
        <Column
          title="Received Responses"
          dataIndex="received_responses_count"
          render={(text, survey) => (
            <Link to={`/surveys/${survey.id}/responses`}>
              {survey.received_responses_count}
            </Link>
          )}
        />
        <Column
          title="Completed Responses"
          dataIndex="completed_responses_count"
        />
        <Column title="Location" dataIndex="location" />
      </Table>
    </Spin>
  );
};

export default Surveys;
