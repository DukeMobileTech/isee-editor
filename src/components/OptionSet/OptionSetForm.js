import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Col, Button, Icon, Typography, Select } from "antd";
import * as Yup from "yup";
import {
  AlertErrorMessage,
  RightSubmitButton,
  DeleteButton,
  DRow
} from "../../utils/Utils";
import {
  updateOptionSet,
  createOptionSet,
  deleteOptionInOptionSet,
  getOptions,
  getInstructions
} from "../../utils/API";
import NewOption from "./NewOption";
import ImportOption from "./ImportOption";

const { Text } = Typography;
const { Option } = Select;
const OptionSetSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const OptionSetForm = props => {
  const optionSet = props.optionSet;
  const [options, setOptions] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [showNewOptionForm, setShowNewOptionForm] = useState(false);
  const [importOption, setImportOption] = useState(false);

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOptions = async () => {
    const results = await getOptions();
    setOptions(results.data);
  };

  const fetchInstructions = async () => {
    const results = await getInstructions();
    setInstructions(results.data);
  };

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
      props.fetchOptionSet(optionSet.id);
    }
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
              <Text strong>Special</Text>
            </Col>
            <Col span={20}>
              <Field name="special" type="checkbox" checked={values.special} />
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
          <DRow gutter={16}>
            <Col span={6}>
              <Text strong>Position</Text>
            </Col>
            <Col span={12}>
              <Text strong>Text</Text>
            </Col>
            <Col span={6}>
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
                <Col span={6}>
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
                <Col span={12}>{oios.option.text}</Col>
                <Col span={6}>
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
              </DRow>
            ))}
          <DRow>
            <Col span={6}>
              <Button
                type="primary"
                onClick={() => setImportOption(!importOption)}
              >
                <Icon type="import" /> IMPORT EXISTING
              </Button>
            </Col>
            <Col span={18}>
              <ImportOption
                importOption={importOption}
                options={options}
                optionSet={optionSet}
                resetForm={resetForm}
                values={values}
              />
            </Col>
          </DRow>
          <DRow>
            <Button type="primary" onClick={() => setShowNewOptionForm(true)}>
              <Icon type="plus" /> ADD NEW
            </Button>
            <NewOption
              showNewOptionForm={showNewOptionForm}
              setShowNewOptionForm={setShowNewOptionForm}
              options={options}
              setOptions={setOptions}
              optionSet={optionSet}
              resetForm={resetForm}
              values={values}
            />
          </DRow>
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default OptionSetForm;
