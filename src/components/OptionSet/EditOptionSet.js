import React from "react";
import { Modal } from "antd";
import OptionSetForm from "./OptionSetForm";

const EditOptionSet = props => {
  const optionSet = props.optionSet;
  const modalWidth = window.innerWidth * 0.75;

  const onCancel = () => {
    props.setVisible(false);
  };

  return (
    <Modal
      title={optionSet.title}
      visible={props.visible}
      footer={null}
      onCancel={onCancel}
      width={modalWidth}
      destroyOnClose
    >
      <OptionSetForm
        optionSet={optionSet}
        fetchOptionSet={props.fetchOptionSet}
      />
    </Modal>
  );
};

export default EditOptionSet;
