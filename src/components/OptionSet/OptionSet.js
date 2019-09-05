import React, { useState } from "react";
import { Row, Col, Card, Divider, Typography } from "antd";
import { EditButton, DeleteButton } from "../../utils/Utils";
import { getOptionSet, deleteOptionSet } from "../../utils/API";
import EditOptionSet from "./EditOptionSet";

const { Text } = Typography;
const { Paragraph } = Typography;

const OptionSet = props => {
  const [optionSet, setOptionSet] = useState(props.optionSet);
  const [visible, setVisible] = useState(false);

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
      <Row>
        <Col offset={12}>
          <EditButton handleClick={handleEditOptionSet} />
          <Divider type="vertical" />
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
        </Col>
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
    } else {
      return <OptionSetDetails />;
    }
  };

  return <View />;
};

export default OptionSet;
