import React, { useState } from "react";
import { Row, Card, Typography, Button, Icon } from "antd";
import { EditButton, DeleteButton } from "../../utils/Utils";
import { getOptionSet, deleteOptionSet } from "../../utils/API";
import EditOptionSet from "./EditOptionSet";
import OptionSetTranslations from "./OptionSetTranslations";

const { Text } = Typography;
const { Paragraph } = Typography;

const OptionSet = props => {
  const [optionSet, setOptionSet] = useState(props.optionSet);
  const [visible, setVisible] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);

  const fetchOptionSet = async id => {
    setVisible(false);
    const result = await getOptionSet(id);
    setOptionSet(result.data);
  };

  const handleEditOptionSet = () => {
    setVisible(true);
  };

  const handleDeleteOptionSet = () => {
    deleteOptionSet(optionSet.id).then(res => {
      let index = props.optionSets.indexOf(optionSet);
      props.optionSets.splice(index, 1);
      props.setOptionSets([...props.optionSets]);
    });
  };

  const OptionSetDetails = () => (
    <Card title={optionSet.title} style={{ flex: 1 }}>
      {optionSet.instructions && (
        <p>
          <i
            dangerouslySetInnerHTML={{
              __html: optionSet.instructions
            }}
          />
        </p>
      )}
      {optionSet.option_in_option_sets &&
        optionSet.option_in_option_sets.map(
          (oios, index) =>
            oios.id && (
              <Paragraph key={oios.id || oios.option.id}>
                <Text strong>{`${oios.number_in_question})`}</Text>
                {oios.option.text}
              </Paragraph>
            )
        )}
      <br />
      <Row gutter={8} type="flex" justify="space-around" align="middle">
        <Button
          type="primary"
          onClick={() => setShowTranslations(!showTranslations)}
        >
          <Icon type="global" />
        </Button>
        <EditButton handleClick={handleEditOptionSet} />
        <DeleteButton
          handleClick={() => {
            if (
              window.confirm(
                `Are you sure you want to delete ${optionSet.title}?`
              )
            )
              handleDeleteOptionSet();
          }}
        />
      </Row>
    </Card>
  );

  const View = () => {
    if (visible) {
      return (
        <EditOptionSet
          visible={visible}
          optionSet={optionSet}
          setVisible={setVisible}
          fetchOptionSet={fetchOptionSet}
        />
      );
    } else if (showTranslations) {
      return (
        <OptionSetTranslations
          optionSet={optionSet}
          setShowTranslations={setShowTranslations}
          showTranslations={showTranslations}
        />
      );
    } else {
      return <OptionSetDetails />;
    }
  };

  return <View />;
};

export default OptionSet;
