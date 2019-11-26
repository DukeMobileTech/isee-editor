import { Col, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";

import { getResponses } from "../../utils/api/response";

const { Column } = Table;

const Responses = ({ match }) => {
  const surveyId = match.params.survey_id;
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResponses = async () => {
    const results = await getResponses(surveyId);
    setResponses(results.data);
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      {responses[0] && (
        <Row>
          <Col span={12}>
            <strong>Survey UUID:</strong> {responses[0].survey_uuid}
          </Col>
          <Col span={12}>
            <strong>Survey ID:</strong> {surveyId}
          </Col>
        </Row>
      )}
      <Table bordered dataSource={responses} rowKey={response => response.id}>
        <Column title="Id" dataIndex="id" />
        <Column title="UUID" dataIndex="uuid" />
        <Column title="Question" dataIndex="question_identifier" />
        <Column title="Date Received" dataIndex="created_at" />
        <Column title="Text Response" dataIndex="text" />
        <Column title="Special Response" dataIndex="special_response" />
        <Column title="Other Response" dataIndex="other_response" />
        <Column title="Started" dataIndex="time_started" />
        <Column title="Finished" dataIndex="time_ended" />
      </Table>
    </Spin>
  );
};

export default Responses;
