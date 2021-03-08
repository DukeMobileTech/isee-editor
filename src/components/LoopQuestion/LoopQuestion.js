import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  deleteLoopQuestion,
  getLoopQuestions,
} from "../../utils/api/loop_question";
import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import LoopQuestionForm from "./LoopQuestionForm";

const { Column } = Table;

const LoopQuestion = (props) => {
  const instrumentQuestion = props.instrumentQuestion;
  const [loopQuestions, setLoopQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loopQuestion, setLoopQuestion] = useState(null);

  const fetchLoopQuestions = () => {
    setLoading(true);
    setLoopQuestion(null);
    getLoopQuestions(
      props.projectId,
      instrumentQuestion.instrument_id,
      instrumentQuestion.id
    ).then((results) => {
      setLoopQuestions(
        results.data.sort((a, b) =>
          a.looped_position > b.looped_position ? 1 : -1
        )
      );
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLoopQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoopQuestionEdit = (lq) => {
    setLoopQuestion(lq);
  };

  const handleLoopQuestionDelete = (lq) => {
    deleteLoopQuestion(props.projectId, instrumentQuestion.instrument_id, lq)
      .then((res) => {
        fetchLoopQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNewLoopQuestion = () => {
    setLoopQuestion({});
  };

  const handleCancel = () => {
    setLoopQuestion(null);
  };

  if (loopQuestion) {
    return (
      <LoopQuestionForm
        loopQuestion={loopQuestion}
        instrumentQuestion={instrumentQuestion}
        projectId={props.projectId}
        handleCancel={handleCancel}
        fetchLoopQuestions={fetchLoopQuestions}
        loopQuestions={loopQuestions}
      />
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Table dataSource={loopQuestions} rowKey={(lq) => lq.id}>
          <Column title="Number" dataIndex="looped_position" />
          <Column title="Looped" dataIndex="looped" />
          <Column title="Option Indices" dataIndex="option_indices" />
          <Column title="Replacement Text" dataIndex="replacement_text" />
          <Column
            title="Same Display"
            dataIndex="same_display"
            render={(text, lq) => String(lq.same_display)}
          />
          <Column
            title="Actions"
            dataIndex="actions"
            render={(_text, ms) => (
              <EditDeleteBtnGroup
                object={ms}
                message={ms.id}
                handleEdit={handleLoopQuestionEdit}
                handleDelete={handleLoopQuestionDelete}
              />
            )}
          />
        </Table>
        <br />
        <Row gutter={8}>
          <Col span={18} />
          <Col span={6}>
            <Button type="primary" onClick={handleNewLoopQuestion}>
              <PlusOutlined /> New Loop Question
            </Button>
          </Col>
        </Row>
      </Spin>
    );
  }
};

export default LoopQuestion;
