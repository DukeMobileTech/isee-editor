import React, { useState, useContext } from "react";
import { Form as AntForm, Select, Row, Col } from "antd";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  LeftCancelButton,
  RightSubmitButton,
  AlertErrorMessage
} from "../../utils/Utils";
import { CenteredH4, CenteredH3 } from "../../utils/Styles";
import { createScoreUnit } from "../../utils/API";
import { ScoreTypeContext } from "../../context/ScoreTypeContext";

const FormItem = AntForm.Item;
const { Option } = Select;
const ScoreUnitSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  weight: Yup.number()
    .min(1, "Weight must be 1.0 or larger")
    .required("Weight is required"),
  score_type: Yup.string().required("Score type is required")
});

const ScoreUnitForm = props => {
  const instrument = props.instrument;
  const subdomain = props.subdomain;
  const scoreUnit = props.scoreUnit;
  const scoreTypes = useContext(ScoreTypeContext);
  const instrumentQuestions = instrument.instrument_questions;

  return (
    <Formik
      initialValues={{
        subdomain_id: subdomain.id,
        title: (scoreUnit && scoreUnit.title) || "",
        weight: (scoreUnit && scoreUnit.weight) || 1.0,
        score_type: (scoreUnit && scoreUnit.type) || "",
        options: []
      }}
      validationSchema={ScoreUnitSchema}
      onSubmit={(values, { setErrors }) => {
        const scoreUnit = {
          subdomain_id: subdomain.id,
          title: values.title,
          weight: values.weight,
          score_type: values.score_type,
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
      render={({ values }) => (
        <Form>
          <CenteredH4>
            {values.title ? values.title : "New Score Unit"}
          </CenteredH4>
          <FormItem>
            <Field
              className="ant-input"
              name="title"
              placeholder="Enter title"
              type="text"
            />
            <AlertErrorMessage name="title" type="error" />
          </FormItem>
          <FormItem>
            <Field
              className="ant-input-number"
              name="weight"
              placeholder="Enter weight"
              type="number"
            />
            <AlertErrorMessage name="weight" type="error" />
          </FormItem>
          <FormItem>
            <Field className="ant-input" name="score_type" component="select">
              <option></option>
              {scoreTypes.map(type => {
                return (
                  <option key={type} name="score_type" value={type}>
                    {type}
                  </option>
                );
              })}
            </Field>
            <AlertErrorMessage name="score_type" type="error" />
          </FormItem>
          <CenteredH3>Questions in score unit</CenteredH3>
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
                      question &&
                        question.options.forEach((option, index) => {
                          let optionObj = {
                            value: "",
                            option_identifier: option.identifier,
                            text: option.text,
                            instrument_question_id: question.id,
                            position: index,
                            follow_up_qid: ""
                          };
                          if (values.options.indexOf(optionObj) === -1) {
                            arrayHelpers.push(optionObj);
                          }
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
                {values.options &&
                  values.options.map((option, index) => (
                    <FormItem key={`${option.option_identifier}_${index}`}>
                      <Row>
                        <Col span={8}>{option.text}</Col>
                        <Col span={8}>
                          <Field
                            className="ant-input-number"
                            name={`options.${index}.value`}
                            placeholder="Value"
                            type="number"
                          />
                          <AlertErrorMessage
                            name={`options.${index}.value`}
                            type="error"
                          />
                        </Col>
                        <Col span={8}>
                          <Field
                            className="ant-input"
                            name={`options.${index}.follow_up_qid`}
                            placeholder="Follow-up question identifier"
                            type="text"
                          />
                          <AlertErrorMessage
                            name={`options.${index}.follow_up_qid`}
                            type="error"
                          />
                        </Col>
                      </Row>
                    </FormItem>
                  ))}
              </div>
            )}
          />
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default ScoreUnitForm;
