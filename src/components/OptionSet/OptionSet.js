import React, { useState } from "react";
import { Row, Col, Card, Descriptions, Divider } from "antd";
import { EditButton, DeleteButton } from "../../utils/Utils";
import { getOptionSet, deleteOptionSet } from "../../utils/API";
import EditOptionSet from "./EditOptionSet";

const OptionSet = props => {
  const [optionSet, setOptionSet] = useState(props.optionSet);
  const [showForm, setShowForm] = useState(false);

  const fetchOptionSet = async id => {
    setShowForm(false);
    const result = await getOptionSet(id);
    setOptionSet(result.data);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleEditOptionSet = () => {
    setShowForm(true);
  };

  const handleDeleteOptionSet = () => {
    deleteOptionSet(optionSet.id).then(res => {
      let index = props.optionSets.indexOf(optionSet);
      props.optionSets.splice(index, 1);
      props.setOptionSets([...props.optionSets]);
    });
  };

  const OptionSetDetails = () => (
    <Card title={optionSet.title}>
      {optionSet.instructions && (
        <i
          dangerouslySetInnerHTML={{
            __html: optionSet.instructions
          }}
        />
      )}
      {optionSet.option_in_option_sets &&
        optionSet.option_in_option_sets.length > 0 && (
          <Descriptions.Item label="Options">
            <Row gutter={16}>
              {optionSet.option_in_option_sets.map((oios, index) => (
                <Col key={oios.id} span={12}>
                  <b>{`${oios.number_in_question})`}</b> {oios.option.text}
                </Col>
              ))}
            </Row>
          </Descriptions.Item>
        )}
      <br />
      <Row>
        <Col offset={16}>
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
    if (showForm) {
      return (
        <EditOptionSet
          visible={true}
          optionSet={optionSet}
          options={props.options}
          instructions={props.instructions}
          handleCancel={handleCancel}
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
