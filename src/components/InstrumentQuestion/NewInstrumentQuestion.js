import React from "react";
import { createInstrumentQuestion } from "../../utils/api/instrument_question";
import QuestionForm from "../Question/QuestionForm";

const NewInstrumentQuestion = (props) => {
  const onCreateQuestion = (question) => {
    const instrumentQuestions = [];
    instrumentQuestions.push({
      question_id: question.id,
      instrument_id: props.display.instrument_id,
      position: props.display.instrument_questions_count + 1,
      display_id: props.display.id,
      identifier: question.question_identifier,
    });
    createInstrumentQuestion(props.projectId, props.display.instrument_id, {
      instrument_questions: instrumentQuestions,
    })
      .then((res) => {
        props.fetchDisplay();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <QuestionForm
      visible={props.visible}
      setVisible={props.handleCancel}
      question={null}
      folder={null}
      fetchQuestions={onCreateQuestion}
      returnValue
    />
  );
};

export default NewInstrumentQuestion;
