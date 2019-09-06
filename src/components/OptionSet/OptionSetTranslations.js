import React from "react";
import { Modal } from "antd";
import { modalWidth } from "../../utils/Constants";
import Translations from "../Option/Translations";

const OptionSetTranslations = props => {
  const optionSet = props.optionSet;
  const options = optionSet.option_in_option_sets.map(oios => oios.option);

  const onCancel = () => {
    props.setShowTranslations(false);
  };

  return (
    <Modal
      title={optionSet.title}
      visible={props.showTranslations}
      footer={null}
      onCancel={onCancel}
      width={modalWidth}
      destroyOnClose={true}
    >
      <Translations
        options={options}
        setShowTranslations={props.setShowTranslations}
        showTranslations={props.showTranslations}
      />
    </Modal>
  );
};

export default OptionSetTranslations;
