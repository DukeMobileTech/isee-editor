import React from "react";
import { Modal } from "antd";
import OptionSetForm from "./OptionSetForm";

const EditOptionSet = props => {
  return (
    <Modal visible={props.visible} footer={null} closable={false}>
      <OptionSetForm
        optionSet={props.optionSet}
        options={props.options}
        instructions={props.instructions}
        handleCancel={props.handleCancel}
        fetchOptionSet={props.fetchOptionSet}
      />
    </Modal>
  );
};

export default EditOptionSet;
