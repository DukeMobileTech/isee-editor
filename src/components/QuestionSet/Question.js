import React from "react";
import { Modal } from "antd";
import QuestionForm from "./QuestionForm";
import { QuestionTypeProvider } from "../../context/QuestionTypeContext";

const Question = props => {
  const title = props.question
    ? props.question.question_identifier
    : "New Question";
  const modalWidth = window.innerWidth * 0.75;

  const onCancel = () => {
    props.setVisible(false);
  };

  return (
    <Modal
      title={title}
      visible={props.visible}
      footer={null}
      destroyOnClose={true}
      onCancel={onCancel}
      width={modalWidth}
    >
      <QuestionTypeProvider>
        <QuestionForm
          question={props.question}
          folder={props.folder}
          fetchQuestions={props.fetchQuestions}
        />
      </QuestionTypeProvider>
    </Modal>
  );
};

export default Question;
