import React from "react";
import { Select } from "antd";

const { Option } = Select;

const ImportOption = props => {
  const options = props.options;
  const optionSet = props.optionSet;
  const values = props.values;

  if (props.importOption) {
    return (
      <Select
        showSearch
        autoClearSearchValue
        mode="tags"
        style={{ width: "100%" }}
        placeholder="Search/select an option and add to the set"
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
                optionSet.option_in_option_sets.push({
                  option_id: option.id,
                  option_set_id: optionSet.id,
                  number_in_question:
                    optionSet.option_in_option_sets.length + 1,
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
              }
            }
          });
        }}
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
  } else {
    return null;
  }
};

export default ImportOption;
