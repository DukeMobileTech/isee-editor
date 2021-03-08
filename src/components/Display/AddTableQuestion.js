import { Select } from "antd";
import React from "react";

const { Option } = Select;

const AddTableQuestion = (props) => {
  const instrumentQuestions = props.instrumentQuestions;
  const tableQuestions = props.tableQuestions;
  const values = props.values;

  return (
    <Select
      showSearch
      autoClearSearchValue
      mode="tags"
      style={{ width: "100%" }}
      placeholder="Search/select a question and add to the table"
      onChange={(selectedValues) => {
        selectedValues.forEach((selectedValue) => {
          const iq = instrumentQuestions.find(
            (iq) => iq.identifier === selectedValue
          );
          if (iq) {
            const exists = tableQuestions.find(
              (q) => q.identifier === iq.identifier
            );
            if (exists === undefined) {
              tableQuestions.push({
                id: iq.id,
                identifier: iq.identifier,
                number_in_instrument: iq.number_in_instrument,
              });
              props.resetForm({
                table_identifier: values.table_identifier,
                instrument_questions: tableQuestions,
              });
            }
          }
        });
      }}
    >
      {instrumentQuestions &&
        instrumentQuestions.map((iq) => {
          return (
            <Option
              key={`${iq.identifier}`}
            >{`${iq.number_in_instrument} - ${iq.identifier}`}</Option>
          );
        })}
    </Select>
  );
};

export default AddTableQuestion;
