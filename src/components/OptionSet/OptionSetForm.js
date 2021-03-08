import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Select, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { InstructionContext } from "../../context/InstructionContext";
import { OptionContext } from "../../context/OptionContext";
import { getOptions } from "../../utils/api/option";
import { deleteOptionInOptionSet } from "../../utils/api/option_in_option_set";
import { createOptionSet, updateOptionSet } from "../../utils/api/option_set";
import { RightSubmitButton } from "../../utils/Buttons";
import { modalWidth } from "../../utils/Constants";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import AddOptions from "./AddOptions";
import OptionSetOptions from "./OptionSetOptions";

const { Text } = Typography;
const { Option } = Select;
const OptionSetSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

const OptionSetForm = (props) => {
  const optionSet = props.optionSet;
  // eslint-disable-next-line no-unused-vars
  const [options, setOptions] = useContext(OptionContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  const [addOptions, setAddOptions] = useState(false);

  useEffect(() => {
    const fetchOptions = () => {
      if (options.length === 0) {
        getOptions().then((results) => {
          setOptions(results.data);
        });
      }
    };
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetOptionSetForm = (array, values, resetForm) => {
    array.forEach((item, index) => (item.number_in_question = index + 1));
    resetForm({
      id: values.id,
      title: values.title,
      instruction_id: values.instruction_id,
      special: values.special,
      option_in_option_sets: array,
    });
  };

  const handleDeleteOption = (oios, values, resetForm) => {
    const index = optionSet.option_in_option_sets.findIndex(
      (item) => oios.id === item.id
    );
    let optionSetOptions = optionSet.option_in_option_sets;

    if (index > -1) {
      optionSetOptions.splice(index, 1);
      if (oios.id) {
        deleteOptionInOptionSet(optionSet.id, oios.id)
          .then((res) => {
            resetOptionSetForm(optionSetOptions, values, resetForm);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        resetOptionSetForm(optionSetOptions, values, resetForm);
      }
    }
  };

  const AddOptionIcon = () => {
    if (addOptions) {
      return <CloseOutlined style={{ color: "red" }} />;
    } else {
      return <PlusOutlined />;
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
            (optionSet && optionSet.option_in_option_sets) || [],
        }}
        validationSchema={OptionSetSchema}
        onSubmit={(values, { setErrors }) => {
          const optionSetObj = {
            title: values.title,
            instruction_id: values.instruction_id,
            special: values.special,
            option_in_option_sets: values.option_in_option_sets,
          };
          if (values.id) {
            updateOptionSet(values.id, optionSetObj)
              .then((response) => {
                if (response.status === 200) {
                  props.fetchOptionSet(values.id);
                }
              })
              .catch((error) => {
                for (const err of error.data.errors) {
                  if (err.includes("Title")) {
                    setErrors({ title: err });
                  }
                }
              });
          } else {
            createOptionSet(optionSetObj)
              .then((response) => {
                if (response.status === 200) {
                  props.fetchOptionSet(response.data.id);
                }
              })
              .catch((error) => {
                for (const err of error.data.errors) {
                  if (err.includes("Title")) {
                    setErrors({ title: err });
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
                      style={{ width: "100%" }}
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      onChange={(value) => {
                        if (value === undefined) {
                          value = null;
                        }
                        setFieldValue("instruction_id", value);
                      }}
                      filterOption={(input, option) =>
                        option.props.children &&
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="" />
                      {instructions.map((instruction) => {
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
              <Col span={5}>
                <Text strong>Pop-up Instruction</Text>
              </Col>
              <Col span={5}>
                <Text strong>Excludes</Text>
              </Col>
              <Col span={2}>
                <Text strong>Allow Text Entry</Text>
              </Col>
              <Col span={2}>
                <Text strong>Action</Text>
              </Col>
            </DRow>
            <OptionSetOptions
              values={values}
              setFieldValue={setFieldValue}
              instructions={instructions}
              handleDeleteOption={handleDeleteOption}
              resetForm={resetForm}
            />
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
