import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm, Card, Row, Col, Select, Button, Icon } from "antd";
import * as Yup from "yup";
import {
  AlertErrorMessage,
  LeftCancelButton,
  RightSubmitButton,
  DeleteButton
} from "../../utils/Utils";
import {
  updateOptionSet,
  createOptionSet,
  deleteOptionInOptionSet
} from "../../utils/API";
import OptionForm from "./OptionForm";
// import { FormattedMessage } from "react-intl";

const FormItem = AntForm.Item;
const { Option } = Select;
const OptionSetSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const OptionSetForm = props => {
  const optionSet = props.optionSet;
  const [options, setOptions] = useState(props.options);
  const instructions = props.instructions;
  const [showNewOptionForm, setShowNewOptionForm] = useState(false);

  const handleDeleteOption = oios => {
    if (oios.id) {
      deleteOptionInOptionSet(optionSet.id, oios.id)
        .then(res => {
          props.fetchOptionSet(optionSet.id);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log("remove recent");
      //TODO: REMOVE FROM VALUES ARRAY ~ make enableReinitialize work
      props.fetchOptionSet(optionSet.id);
    }
  };

  const onNewOption = option => {
    console.log("new option", option);
    setOptions([option, ...options]);
    //TODO: Automatically add to option
  };

  return (
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
              if (response.status === 204) {
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
              if (response.status === 201) {
                props.fetchOptionSet(response.data.id);
              }
            })
            .catch(error => {
              for (const err of error.response.data.errors) {
                if (err.includes("Title")) {
                  setErrors({ title: err });
                }
              }
            });
        }
      }}
      render={({ values, resetForm }) => (
        <Card title={optionSet && optionSet.title}>
          <Form>
            <FormItem>
              <Field
                className="ant-input"
                name="title"
                placeholder="Enter option set title"
                type="text"
              />
              <AlertErrorMessage name="title" type="error" />
            </FormItem>
            <FormItem>
              <Field name="special" type="checkbox" checked={values.special} />
              <span> Special</span>
            </FormItem>
            <FormItem>
              <Field
                className="ant-input"
                name="instruction_id"
                placeholder="Selection instructions for the option set"
                component="select"
              >
                <option></option>
                {instructions.map(instruction => {
                  return (
                    // <option key={instruction.id}>
                    //   <FormattedMessage
                    //     id={instruction.id}
                    //     defaultMessage={instruction.title}
                    //     values={{
                    //       b: msg => <b>{msg}</b>,
                    //       u: msg => <u>{msg}</u>
                    //     }}
                    //   >
                    //     {message => ({ message })}
                    //   </FormattedMessage>
                    // </option>
                    // <FormattedMessage
                    //   id={instruction.id}
                    //   key={instruction.id}
                    //   defaultMessage={instruction.title}
                    //   values={{
                    //     b: msg => <b>{msg}</b>,
                    //     u: msg => <u>{msg}</u>
                    //   }}
                    // >
                    //   {message => (
                    //     <option value={instruction.id}>{message}</option>
                    //   )}
                    // </FormattedMessage>

                    <option
                      key={instruction.id}
                      name="instruction_id"
                      value={instruction.id}
                    >
                      {instruction.title}
                    </option>
                  );
                })}
              </Field>
              <AlertErrorMessage name="instruction_id" type="error" />
            </FormItem>
            {values.option_in_option_sets &&
              values.option_in_option_sets.map((oios, index) => (
                <Row
                  key={oios.option_id}
                  gutter={16}
                  style={{ marginBottom: 8 }}
                >
                  <Col span={8}>
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
                  <Col span={8}>{oios.option.text}</Col>
                  <Col span={8}>
                    <DeleteButton
                      handleClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to remove ${oios.option.text} from the set?`
                          )
                        )
                          handleDeleteOption(oios);
                      }}
                    />
                  </Col>
                </Row>
              ))}
            <FormItem>
              <Row>
                <Col span={6}>Add existing</Col>
                <Col span={18}>
                  <Select
                    showSearch
                    autoClearSearchValue
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Search/select an option and add to the set"
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
                            resetForm({
                              id: values.id,
                              title: values.title,
                              instruction_id: values.instruction_id,
                              special: values.special,
                              option_in_option_sets:
                                optionSet.option_in_option_sets
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
                            {option.text}
                          </Option>
                        );
                      })}
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={() => setShowNewOptionForm(true)}>
                <Icon type="plus" /> ADD NEW
              </Button>
              <OptionForm
                showNewOptionForm={showNewOptionForm}
                onNewOption={onNewOption}
                setShowNewOptionForm={setShowNewOptionForm}
              />
            </FormItem>
            <LeftCancelButton handleClick={props.handleCancel} />
            <RightSubmitButton />
          </Form>
        </Card>
      )}
    />
  );
};

export default OptionSetForm;
