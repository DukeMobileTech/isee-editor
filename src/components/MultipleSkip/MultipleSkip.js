import { Button, Col, Icon, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";

import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import {
  deleteMultipleSkip,
  getMultipleSkips
} from "../../utils/api/multiple_skip";
import MultipleSkipForm from "./MultipleSkipForm";

const { Column } = Table;

const MultipleSkip = props => {
  const instrumentQuestion = props.instrumentQuestion;
  const [multipleSkips, setMultipleSkips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multipleSkip, setMultipleSkip] = useState(null);

  useEffect(() => {
    fetchMultipleSkips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMultipleSkips = () => {
    setLoading(true);
    setMultipleSkip(null);
    getMultipleSkips(
      props.projectId,
      instrumentQuestion.instrument_id,
      instrumentQuestion.id
    ).then(results => {
      setMultipleSkips(results.data);
      setLoading(false);
    });
  };

  const handleMultipleSkipEdit = ms => {
    setMultipleSkip(ms);
  };

  const handleMultipleSkipDelete = ms => {
    deleteMultipleSkip(props.projectId, instrumentQuestion.instrument_id, ms)
      .then(res => {
        fetchMultipleSkips();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleNewMultipleSkip = () => {
    setMultipleSkip({});
  };

  const handleCancel = () => {
    setMultipleSkip(null);
  };

  if (multipleSkip) {
    return (
      <MultipleSkipForm
        multipleSkip={multipleSkip}
        instrumentQuestion={instrumentQuestion}
        projectId={props.projectId}
        handleCancel={handleCancel}
        fetchMultipleSkips={fetchMultipleSkips}
      />
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Table dataSource={multipleSkips} rowKey={nq => nq.id}>
          <Column title="Option" dataIndex="option_identifier" />
          <Column title="Value" dataIndex="value" />
          <Column
            title="Question To Skip"
            dataIndex="skip_question_identifier"
          />
          <Column
            title="Actions"
            dataIndex="actions"
            render={(_text, ms) => (
              <EditDeleteBtnGroup
                object={ms}
                message={ms.id}
                handleEdit={handleMultipleSkipEdit}
                handleDelete={handleMultipleSkipDelete}
              />
            )}
          />
        </Table>
        <br />
        <Row gutter={8}>
          <Col span={18}></Col>
          <Col span={6}>
            <Button type="primary" onClick={handleNewMultipleSkip}>
              <Icon type="plus" /> New Question To Skip
            </Button>
          </Col>
        </Row>
      </Spin>
    );
  }
};

export default MultipleSkip;
