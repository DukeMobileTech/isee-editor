import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, Select } from "antd";
import React, { Fragment, useState } from "react";
import { createOption } from "../../utils/api/option";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const AddOptions = (props) => {
  const options = props.options;
  const optionSet = props.optionSet;
  const values = props.values;
  const [newOption, setNewOption] = useState(false);

  const addOption = (option) => {
    const copy = [
      ...values.option_in_option_sets,
      {
        option_id: option.id,
        option_set_id: optionSet.id,
        number_in_question: optionSet.option_in_option_sets.length + 1,
        special: false,
        option: option,
      },
    ];

    props.resetForm({
      id: values.id,
      title: values.title,
      instruction_id: values.instruction_id,
      special: values.special,
      option_in_option_sets: copy,
    });
  };

  const onFinish = (values) => {
    let option = {
      identifier: values.identifier,
      text: values.text,
    };
    createOption(option).then((response) => {
      if (response.status === 201) {
        option = response.data;
        props.setOptions([option, ...options]);
        addOption(option);
        setNewOption(!newOption);
        props.setAddOptions(!props.addOptions);
      }
    });
  };

  const addNewOption = () => {
    setNewOption(!newOption);
  };

  const NewOption = () => {
    if (newOption) {
      return (
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Identifier"
            name="identifier"
            rules={[
              { required: true, message: "Please input the identifier!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Text"
            name="text"
            rules={[{ required: true, message: "Please input the text!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      );
    } else {
      return <Fragment />;
    }
  };

  return (
    <Select
      open={props.addOptions}
      disabled={!props.addOptions}
      showSearch
      autoClearSearchValue
      mode="tags"
      style={{ width: "100%" }}
      placeholder="Search/select an option to add to the set"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.props.children &&
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onChange={(selectedValues) => {
        selectedValues.forEach((selectedValue) => {
          const option = options.find(
            (option) => option.identifier === selectedValue
          );
          if (option) {
            const exists = optionSet.option_in_option_sets.find(
              (os) => os.option_id === option.id
            );
            if (exists === undefined) {
              addOption(option);
            }
          }
        });
      }}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <Divider style={{ margin: "4px 0" }} />
          <Button
            type="primary"
            style={{ margin: "5px" }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={addNewOption}
          >
            <PlusOutlined />
            Create New Option
          </Button>
          <NewOption />
        </div>
      )}
    >
      {options &&
        options.map((option) => {
          return (
            <Select.Option key={`${option.identifier}`}>
              {`${option.identifier} - ${option.text.replace(/<[^>]+>/g, "")}`}
            </Select.Option>
          );
        })}
    </Select>
  );
};

export default AddOptions;
