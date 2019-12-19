import React, { useState, Fragment, useRef } from "react";
import { Select, Divider, Icon, Button, Row, Input, Col } from "antd";
import { createOption } from "../../utils/api/option";

const { Option } = Select;

const AddOptions = props => {
  const options = props.options;
  const optionSet = props.optionSet;
  const values = props.values;
  const [newOption, setNewOption] = useState(false);
  const textInput = useRef("");
  const identifierInput = useRef("");

  const addNewOption = () => {
    setNewOption(!newOption);
  };

  const submitOption = event => {
    event.preventDefault();
    let option = {
      identifier: identifierInput.current.state.value,
      text: textInput.current.state.value
    };
    createOption(option).then(response => {
      if (response.status === 201) {
        option = response.data;
        props.setOptions([option, ...options]);
        addOption(option);
        setNewOption(!newOption);
        props.setAddOptions(!props.addOptions);
      }
    });
  };

  const addOption = option => {
    optionSet.option_in_option_sets.push({
      option_id: option.id,
      option_set_id: optionSet.id,
      number_in_question: optionSet.option_in_option_sets.length + 1,
      special: false,
      option: option
    });
    props.resetForm({
      id: values.id,
      title: values.title,
      instruction_id: values.instruction_id,
      special: values.special,
      option_in_option_sets: optionSet.option_in_option_sets
    });
  };

  const NewOption = () => {
    if (newOption) {
      return (
        <Row
          style={{ marginBottom: "5px" }}
          type="flex"
          justify="space-around"
          align="middle"
        >
          <Col span={6}>
            <Input
              placeholder="Enter unique identifier"
              ref={identifierInput}
              onClick={() => identifierInput.current.focus()}
            />
          </Col>
          <Col span={14}>
            <Input.TextArea
              placeholder="Enter text"
              ref={textInput}
              onClick={() => textInput.current.focus()}
            />
          </Col>
          <Button type="primary" onClick={e => submitOption(e)}>
            <Icon type="save" />
          </Button>
        </Row>
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
      onChange={selectedValues => {
        selectedValues.forEach(selectedValue => {
          const option = options.find(
            option => option.identifier === selectedValue
          );
          if (option) {
            const exists = optionSet.option_in_option_sets.find(
              os => os.option_id === option.id
            );
            if (exists === undefined) {
              addOption(option);
            }
          }
        });
      }}
      dropdownRender={menu => (
        <div>
          {menu}
          <Divider style={{ margin: "4px 0" }} />
          <Button
            type="primary"
            style={{ margin: "5px" }}
            onMouseDown={e => e.preventDefault()}
            onClick={addNewOption}
          >
            <Icon type="plus" />
            Create New Option
          </Button>
          <NewOption />
        </div>
      )}
    >
      {options &&
        options.map(option => {
          return (
            <Option key={`${option.identifier}`}>
              {`${option.identifier} - ${option.text}`}
            </Option>
          );
        })}
    </Select>
  );
};

export default AddOptions;
