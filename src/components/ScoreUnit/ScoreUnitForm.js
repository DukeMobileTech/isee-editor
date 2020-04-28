import * as Yup from "yup";

import {
  LeftCancelButton,
  RightSubmitButton,
  DeleteButton
} from "../../utils/Buttons";
import { AlertErrorMessage, DRow, hasOtherOption } from "../../utils/Utils";
import { Form as AntForm, Col, Select, Typography, Modal } from "antd";
import { CenteredH4 } from "../../utils/Styles";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useContext } from "react";

import { createScoreUnit } from "../../utils/api/score_unit";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import { OptionSetContext } from "../../context/OptionSetContext";
import {
  scoreTypes,
  modalWidth,
  institutionTypes
} from "../../utils/Constants";

const { Text } = Typography;
const FormItem = AntForm.Item;
const { Option } = Select;
const ScoreUnitSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  weight: Yup.number()
    .min(1.0, "Weight must be 1.0 or larger")
    .required("Weight is required"),
  score_type: Yup.string().required("Score type is required")
});

const ScoreUnitForm = props => {
  const instrument = props.instrument;
  const subdomain = props.subdomain;
  const scoreUnit = props.scoreUnit;
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);

  return (
    <Modal
      title={(scoreUnit && scoreUnit.title) || "New Score Unit"}
      visible={props.visible}
      footer={null}
      onCancel={() => props.setVisible(false)}
      width={modalWidth}
    >
      <Formik
        initialValues={{
          subdomain_id: subdomain.id,
          title: (scoreUnit && scoreUnit.title) || "",
          weight: (scoreUnit && scoreUnit.weight) || 1.0,
          score_type: (scoreUnit && scoreUnit.type) || "",
          base_point_score: (scoreUnit && scoreUnit.base_point_score) || 0,
          institution_type: (scoreUnit && scoreUnit.institution_type) || "",
          options: []
        }}
        validationSchema={ScoreUnitSchema}
        onSubmit={(values, { setErrors }) => {
          const scoreUnit = {
            subdomain_id: subdomain.id,
            title: values.title,
            weight: values.weight,
            score_type: values.score_type,
            base_point_score: values.base_point_score,
            institution_type: values.institution_type,
            options: values.options
          };
          createScoreUnit(instrument, props.scoreSchemeId, scoreUnit)
            .then(response => {
              if (response.status === 201) {
                props.fetchScoreUnits();
              }
            })
            .catch(error => {
              console.log(error);
              setErrors(error);
            });
        }}
        render={({ values, setFieldValue }) => (
          <Form>
            <CenteredH4>
              {values.title ? values.title : "New Score Unit"}
            </CenteredH4>
            <DRow>
              <Col span={4}>
                <Text strong>Title</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="title"
                  placeholder="Enter title"
                  type="text"
                />
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="title" type="error" />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Weight</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input-number"
                  name="weight"
                  placeholder="Enter weight"
                  type="number"
                />
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="weight" type="error" />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Score Type</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="score_type"
                  component="select"
                >
                  <option></option>
                  {scoreTypes.map(type => {
                    return (
                      <option key={type} name="score_type" value={type}>
                        {type}
                      </option>
                    );
                  })}
                </Field>
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="score_type" type="error" />
              </Col>
            </DRow>
            {values.score_type === "SUM" && (
              <DRow>
                <Col span={4}>
                  <Text strong>Base Point Score</Text>
                </Col>
                <Col span={14}>
                  <Field
                    className="ant-input-number"
                    name="base_point_score"
                    placeholder="Enter base point score"
                    type="number"
                  />
                </Col>
                <Col span={6}>
                  <AlertErrorMessage name="base_point_score" type="error" />
                </Col>
              </DRow>
            )}
            <DRow>
              <Col span={4}>
                <Text strong>Institution Type</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="institution_type"
                  component="select"
                >
                  <option></option>
                  {institutionTypes.map(type => {
                    return (
                      <option key={type} name="institution_type" value={type}>
                        {type}
                      </option>
                    );
                  })}
                </Field>
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="institution_type" type="error" />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Questions in Score Unit</Text>
              </Col>
              <Col span={20}>
                <FieldArray
                  name="options"
                  render={arrayHelpers => (
                    <div>
                      <FormItem>
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Search and/or select one question at a time add to the score unit"
                          onChange={selectedValue => {
                            const question = instrumentQuestions.find(
                              iq => iq.identifier === selectedValue
                            );
                            const os = optionSets.find(
                              oSet => oSet.id === question.option_set_id
                            );
                            question &&
                              os &&
                              os.option_in_option_sets.forEach(
                                (oios, index) => {
                                  let optionObj = {
                                    value: "",
                                    option_identifier: oios.option.identifier,
                                    text: oios.option.text,
                                    instrument_question_id: question.id
                                  };
                                  if (
                                    !values.options.find(
                                      option =>
                                        option.identifier ===
                                        optionObj.option_identifier
                                    )
                                  ) {
                                    arrayHelpers.push(optionObj);
                                  }
                                }
                              );
                            question &&
                              hasOtherOption(question) &&
                              os &&
                              arrayHelpers.push({
                                value: "",
                                option_identifier: os.other_option.identifier,
                                text: os.other_option.text,
                                instrument_question_id: question.id
                              });
                          }}
                        >
                          {instrumentQuestions &&
                            instrumentQuestions.map(iq => {
                              return (
                                <Option key={`${iq.identifier}`}>
                                  {iq.identifier}
                                </Option>
                              );
                            })}
                        </Select>
                      </FormItem>
                      {values.options.length > 0 && (
                        <DRow>
                          <Col span={12}>
                            <strong>Text</strong>
                          </Col>
                          <Col span={8}>
                            <strong>Score</strong>
                          </Col>
                          <Col span={4}>
                            <strong>Remove</strong>
                          </Col>
                        </DRow>
                      )}
                      {values.options &&
                        values.options.map((option, index) => (
                          <DRow key={`${option.option_identifier}_${index}`}>
                            <Col span={12}>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: option.text
                                }}
                              />
                            </Col>
                            <Col span={8}>
                              <Field
                                className="ant-input-number"
                                name={`options.${index}.value`}
                                placeholder="Value"
                                type="number"
                                step="0.1"
                              />
                              <AlertErrorMessage
                                name={`options.${index}.value`}
                                type="error"
                              />
                            </Col>
                            <Col span={4}>
                              <DeleteButton
                                handleClick={() => {
                                  const copy = values.options.slice();
                                  copy.splice(index, 1);
                                  setFieldValue("options", copy);
                                }}
                              />
                            </Col>
                          </DRow>
                        ))}
                    </div>
                  )}
                />
              </Col>
            </DRow>
            <LeftCancelButton handleClick={props.handleCancel} />
            <RightSubmitButton />
          </Form>
        )}
      />
    </Modal>
  );
};

export default ScoreUnitForm;
