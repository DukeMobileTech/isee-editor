import React from "react";
import { Modal } from "antd";
import OptionSetForm from "./OptionSetForm";
import { modalWidth } from "../../utils/Constants";

const NewOptionSet = props => {
  const optionSet = {
    title: "",
    instruction_id: "",
    special: false,
    option_in_option_sets: []
  };

  const fetchOptionSet = () => {
    props.setVisible(false);
    props.fetchOptionSets();
  };

  const onCancel = () => {
    props.setVisible(false);
  };

  return (
    <Modal
      title="New Option Set"
      visible={props.visible}
      footer={null}
      onCancel={onCancel}
      width={modalWidth}
      destroyOnClose={true}
    >
      <OptionSetForm optionSet={optionSet} fetchOptionSet={fetchOptionSet} />
    </Modal>
  );
};

export default NewOptionSet;
