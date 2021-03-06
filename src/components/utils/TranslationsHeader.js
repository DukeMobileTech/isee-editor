import { LeftOutlined } from "@ant-design/icons";
import { Button, Col, Select, Typography } from "antd";
import React from "react";
import { languages } from "../../utils/Constants";
import { DRow } from "../../utils/Utils";

const { Option } = Select;
const { Text } = Typography;

export const TranslationsHeader = ({ handleClick, handleChange }) => {
  return (
    <DRow>
      <Col span={12}>
        <Button title="Back" onClick={handleClick}>
          <LeftOutlined />
        </Button>
      </Col>
      <Col span={6}>
        <Text strong>Translation Language</Text>
      </Col>
      <Col span={6}>
        <Select
          placeholder="Select a language"
          style={{ width: 200 }}
          onChange={handleChange}
        >
          {languages.map((language) => {
            return (
              <Option key={language.code} name="language" value={language.code}>
                {language.name}
              </Option>
            );
          })}
        </Select>
      </Col>
    </DRow>
  );
};
