import { Modal } from "antd";
import React from "react";

import { modalWidth } from "../../utils/Constants";
import InstrumentQuestionForm from "./InstrumentQuestionForm";

const InstrumentQuestion = props => {
  const instrumentQuestion = props.instrumentQuestion;

  const onCancel = () => {
    props.handleCancel();
  };

  return (
    <Modal
      title={instrumentQuestion.identifier}
      visible={props.visible}
      footer={null}
      destroyOnClose={true}
      onCancel={onCancel}
      width={modalWidth}
    >
      <InstrumentQuestionForm
        instrumentQuestion={instrumentQuestion}
        projectId={props.projectId}
        fetchDisplay={props.fetchDisplay}
      />
    </Modal>
  );
};

export default InstrumentQuestion;
