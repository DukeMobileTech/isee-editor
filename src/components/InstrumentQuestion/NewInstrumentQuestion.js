import { Modal } from "antd";
import QuestionForm from "../QuestionSet/QuestionForm";
import React from "react";
import { createInstrumentQuestion } from "../../utils/api/instrument_question";
import { modalWidth } from "../../utils/Constants";

const NewInstrumentQuestion = props => {
  const onCancel = () => {
    props.handleCancel();
  };

  const onCreateQuestion = question => {
    const instrument_questions = [];
    instrument_questions.push({
      question_id: question.id,
      instrument_id: props.display.instrument_id,
      number_in_instrument: props.position + 1,
      display_id: props.display.id,
      identifier: question.question_identifier
    });
    createInstrumentQuestion(props.projectId, props.display.instrument_id, {
      instrument_questions
    })
      .then(res => {
        props.fetchDisplay();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Modal
      title="New Question"
      visible={props.visible}
      footer={null}
      destroyOnClose={true}
      onCancel={onCancel}
      width={modalWidth}
    >
      <QuestionForm
        question={null}
        folder={null}
        fetchQuestions={onCreateQuestion}
        returnValue={true}
      />
    </Modal>
  );
};

export default NewInstrumentQuestion;
