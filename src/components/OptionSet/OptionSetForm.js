import * as Yup from "yup";

import {
  AlertErrorMessage,
  DRow,
  DeleteButton,
  RightSubmitButton
} from "../../utils/Utils";
import { Button, Col, Icon, Select, Typography, Modal } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useState, useContext } from "react";
import { createOptionSet, updateOptionSet } from "../../utils/api/option_set";

import AddOptions from "./AddOptions";
import { deleteOptionInOptionSet } from "../../utils/api/option_in_option_set";
import { OptionContext } from "../../context/OptionContext";
import { InstructionContext } from "../../context/InstructionContext";
import { modalWidth } from "../../utils/Constants";

const { Text } = Typography;
const { Option } = Select;
const OptionSetSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const OptionSetForm = props => {
  const optionSet = props.optionSet;
  // eslint-disable-next-line no-unused-vars
  const [options, setOptions] = useContext(OptionContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  const [addOptions, setAddOptions] = useState(false);

  const handleDeleteOption = (oios, values, resetForm) => {
    const index = optionSet.option_in_option_sets.findIndex(
      item => oios.id === item.id
    );
    let optionSetOptions = optionSet.option_in_option_sets;

    if (index > -1) {
      optionSetOptions.splice(index, 1);
      if (oios.id) {
        deleteOptionInOptionSet(optionSet.id, oios.id)
          .then(res => {
            resetOptionSetForm(optionSetOptions, values, resetForm);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        resetOptionSetForm(optionSetOptions, values, resetForm);
      }
    }
  };

  const resetOptionSetForm = (array, values, resetForm) => {
    array.forEach((item, index) => (item.number_in_question = index + 1));
    resetForm({
      id: values.id,
      title: values.title,
      instruction_id: values.instruction_id,
      special: values.special,
      option_in_option_sets: array
    });
  };

  const AddOptionIcon = () => {
    if (addOptions) {
      return <Icon type="close" />;
    } else {
      return <Icon type="plus" />;
    }
  };

  const onCancel = () => {
    props.setVisible(false);
    props.fetchOptionSet(optionSet.id);
  };

  return (
    <Modal
      title={optionSet.title || "New Option Set"}
      visible={props.visible}
      footer={null}
      onCancel={onCancel}
      width={modalWidth}
      destroyOnClose
    >
      <Formik
        initialValues={{
          id: (optionSet && optionSet.id) || null,
          title: (optionSet && optionSet.title) || "",
          instruction_id: (optionSet && optionSet.instruction_id) || "",
          special: (optionSet && optionSet.special) || false,
          option_in_option_sets:
            (optionSet && optionSet.option_in_option_sets) || []
        }}
        validationSchema={OptionSetSchema}
        onSubmit={(values, { setErrors }) => {
          const optionSet = {
            title: values.title,
            instruction_id: values.instruction_id,
            special: values.special,
            option_in_option_sets: values.option_in_option_sets
          };
          if (values.id) {
            updateOptionSet(values.id, optionSet)
              .then(response => {
                if (response.status === 200) {
                  props.fetchOptionSet(values.id);
                }
              })
              .catch(error => {
                for (const err of error.response.data.errors) {
                  if (err.includes("Title")) {
                    setErrors({ title: err });
                  }
                }
              });
          } else {
            createOptionSet(optionSet)
              .then(response => {
                if (response.status === 200) {
                  props.fetchOptionSet(response.data.id);
                }
              })
              .catch(error => {
                if (error.response.data) {
                  for (const err of error.response.data.errors) {
                    if (err.includes("Title")) {
                      setErrors({ title: err });
                    }
                  }
                }
              });
          }
        }}
        render={({ values, resetForm, setFieldValue }) => (
          <Form>
            <DRow>
              <Col span={4}>
                <Text strong>Title</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="title"
                  placeholder="Enter option set title"
                  type="text"
                />
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="title" type="error" />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Instructions</Text>
              </Col>
              <Col span={20}>
                <Field
                  name="instruction_id"
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      optionFilterProp="children"
                      onChange={value => setFieldValue("instruction_id", value)}
                      filterOption={(input, option) =>
                        option.props.children &&
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value=""></Option>
                      {instructions.map(instruction => {
                        return (
                          <Option
                            key={instruction.id}
                            name="instruction_id"
                            value={instruction.id}
                          >
                            {instruction.title.replace(/<[^>]+>/g, "")}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Special</Text>
              </Col>
              <Col span={20}>
                <Field
                  name="special"
                  type="checkbox"
                  checked={values.special}
                />
              </Col>
            </DRow>
            <DRow gutter={16}>
              <Col span={4}>
                <Text strong>Position</Text>
              </Col>
              <Col span={6}>
                <Text strong>Text</Text>
              </Col>
              <Col span={6}>
                <Text strong>Pop-up Instruction</Text>
              </Col>
              <Col span={4}>
                <Text strong>Allow Text Entry</Text>
              </Col>
              <Col span={4}>
                <Text strong>Action</Text>
              </Col>
            </DRow>
            {values.option_in_option_sets &&
              values.option_in_option_sets.map((oios, index) => (
                <DRow
                  key={oios.option_id}
                  gutter={16}
                  style={{ marginBottom: 8 }}
                >
                  <Col span={4}>
                    <Field
                      className="ant-input-number"
                      name={`option_in_option_sets.${index}.number_in_question`}
                      placeholder="Position"
                      type="number"
                    />
                    <AlertErrorMessage
                      name={`option_in_option_sets.${index}.number_in_question`}
                      type="error"
                    />
                  </Col>
                  <Col span={6}>{oios.option && oios.option.text}</Col>
                  <Col span={6}>
                    <Field
                      name={`option_in_option_sets.${index}.instruction_id`}
                      render={({ field }) => (
                        <Select
                          {...field}
                          showSearch
                          optionFilterProp="children"
                          onChange={value =>
                            setFieldValue(
                              `option_in_option_sets.${index}.instruction_id`,
                              value
                            )
                          }
                          filterOption={(input, option) =>
                            option.props.children &&
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          <Option value=""></Option>
                          {instructions.map(instruction => {
                            return (
                              <Option
                                key={instruction.id}
                                name={`option_in_option_sets.${index}.instruction_id`}
                                value={instruction.id}
                              >
                                {instruction.title.replace(/<[^>]+>/g, "")}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    />
                  </Col>
                  <Col span={4}>
                    <Field
                      name={`option_in_option_sets.${index}.allow_text_entry`}
                      type="checkbox"
                      checked={
                        values.option_in_option_sets[index].allow_text_entry
                      }
                    />
                    <AlertErrorMessage
                      name={`option_in_option_sets.${index}.allow_text_entry`}
                      type="error"
                    />
                  </Col>
                  <Col span={4}>
                    <DeleteButton
                      handleClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to remove ${oios.option &&
                              oios.option.text} from the set?`
                          )
                        )
                          handleDeleteOption(oios, values, resetForm);
                      }}
                    />
                  </Col>
                </DRow>
              ))}
            <DRow>
              <Col span={4}>
                <Button
                  type="primary"
                  onClick={() => setAddOptions(!addOptions)}
                >
                  <AddOptionIcon />
                </Button>
              </Col>
              <Col span={16}>
                <AddOptions
                  addOptions={addOptions}
                  setAddOptions={setAddOptions}
                  options={options}
                  setOptions={setOptions}
                  optionSet={optionSet}
                  resetForm={resetForm}
                  values={values}
                />
              </Col>
              <Col span={4} />
            </DRow>
            <RightSubmitButton />
          </Form>
        )}
      />
    </Modal>
  );
};

export default OptionSetForm;
