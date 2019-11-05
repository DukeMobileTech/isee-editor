import React, { useState } from "react";
import { Typography, Icon, Divider, Popconfirm, Row, Col } from "antd";
import { Button } from "antd/lib/radio";
import { NEW_ID } from "../../utils/Constants";
import {
  deleteOptionTranslation,
  createOptionTranslation,
  updateOptionTranslation
} from "../../utils/API";

const { Paragraph } = Typography;

const OptionTranslation = props => {
  const translation = props.translation;
  const [showButtons, setShowButtons] = useState(false);

  const onChange = str => {
    setShowButtons(true);
    translation.text = str;
  };

  const handleDelete = () => {
    if (translation.id === NEW_ID) {
      props.translations.splice(props.translations.indexOf(translation), 1);
      props.setTranslations([...props.translations]);
    } else {
      deleteOptionTranslation(translation.id).then(res => {
        const dataSource = [...props.translations];
        props.setTranslations(
          dataSource.filter(item => item.id !== translation.id)
        );
      });
    }
  };

  const handleSave = () => {
    const newData = [...props.translations];
    const index = newData.findIndex(item => translation.id === item.id);
    if (index > -1) {
      const item = newData[index];
      if (translation.id === NEW_ID) {
        createOptionTranslation(translation).then(result => {
          newData.splice(index, 1, {
            ...item,
            ...result.data
          });
          props.setTranslations(newData);
        });
      } else {
        newData.splice(index, 1, {
          ...item,
          ...translation
        });
        updateOptionTranslation(translation.id, translation).then(result => {
          props.setTranslations(newData);
        });
      }
    } else {
      newData.push(translation);
      props.setTranslations(newData);
    }
  };

  const ButtonView = () => {
    if (showButtons) {
      return (
        <div>
          <Button type="primary" onClick={handleSave}>
            <Icon type="save" />
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title={`Sure to delete ${translation.text}?`}
            onConfirm={handleDelete}
          >
            <Button type="danger">
              <Icon type="delete" />
            </Button>
          </Popconfirm>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <Row gutter={8} type="flex" justify="space-around" align="middle">
      <Col span={17}>
        <Paragraph editable={{ onChange: onChange }}>
          {translation.text}
        </Paragraph>
      </Col>
      <Col span={7}>
        <ButtonView />
      </Col>
    </Row>
  );
};

export default OptionTranslation;
