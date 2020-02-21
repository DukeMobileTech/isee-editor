import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";

import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import NextQuestionForm from "./NextQuestionForm";
import {
  getNextQuestions,
  deleteNextQuestion
} from "../../utils/api/next_question";
import { AddButton } from "../../utils/Buttons";
import IQForm from "./IQForm";

const { Column } = Table;

const NextQuestion = props => {
  const instrumentQuestion = props.instrumentQuestion;
  const [nextQuestions, setNextQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextQuestion, setNextQuestion] = useState(null);

  useEffect(() => {
    fetchNextQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNextQuestions = () => {
    setLoading(true);
    setNextQuestion(null);
    getNextQuestions(
      props.projectId,
      instrumentQuestion.instrument_id,
      instrumentQuestion.id
    ).then(results => {
      setNextQuestions(results.data);
      setLoading(false);
    });
  };

  const handleNextQuestionEdit = nq => {
    setNextQuestion(nq);
  };

  const handleNextQuestionDelete = nq => {
    deleteNextQuestion(props.projectId, instrumentQuestion.instrument_id, nq)
      .then(res => {
        fetchNextQuestions();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleNewNextQuestion = () => {
    setNextQuestion({});
  };

  const handleCancel = () => {
    setNextQuestion(null);
  };

  if (nextQuestion) {
    return (
      <NextQuestionForm
        nextQuestion={nextQuestion}
        instrumentQuestion={instrumentQuestion}
        projectId={props.projectId}
        handleCancel={handleCancel}
        fetchNextQuestions={fetchNextQuestions}
      />
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Table dataSource={nextQuestions} rowKey={nq => nq.id}>
          <Column title="Option" dataIndex="option_identifier" />
          <Column title="Value Operator" dataIndex="value_operator" />
          <Column title="Value" dataIndex="value" />
          <Column title="Next Question" dataIndex="next_question_identifier" />
          <Column
            title="Complete Survey"
            dataIndex="complete_survey"
            render={(_text, nq) => String(nq.complete_survey)}
          />
          <Column
            title="Actions"
            dataIndex="actions"
            render={(_text, nq) => (
              <EditDeleteBtnGroup
                object={nq}
                message={nq.id}
                handleEdit={handleNextQuestionEdit}
                handleDelete={handleNextQuestionDelete}
              />
            )}
          />
        </Table>
        <AddButton handleClick={handleNewNextQuestion} />
        <IQForm
          instrumentQuestion={instrumentQuestion}
          projectId={props.projectId}
          nextQuestions={nextQuestions}
        />
      </Spin>
    );
  }
};

export default NextQuestion;
