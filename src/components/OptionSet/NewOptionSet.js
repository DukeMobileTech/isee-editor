import React from "react";
import { Modal } from "antd";
import OptionSetForm from "./OptionSetForm";

const NewOptionSet = props => {
  const optionSet = {
    title: "",
    instruction_id: "",
    special: false,
    option_in_option_sets: []
  };

  const handleCancel = e => {
    props.setVisible(false);
  };

  const fetchOptionSet = id => {
    props.setVisible(false);
    props.fetchOptionSets();
  };

  return (
    <Modal title="New Option Set" visible={props.visible} footer={null}>
      <OptionSetForm
        optionSet={optionSet}
        options={props.options}
        instructions={props.instructions}
        handleCancel={handleCancel}
        fetchOptionSet={fetchOptionSet}
      />
    </Modal>
  );
};

export default NewOptionSet;
