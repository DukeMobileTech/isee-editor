import * as Yup from "yup";

import {
  RightSubmitButton,
  SaveButton,
  DeleteButton
} from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import { Col, Typography, Modal, Divider } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";

import { updateScoreUnit } from "../../utils/api/score_unit";
import { modalWidth, scoreTypes } from "../../utils/Constants";
import { getDomains } from "../../utils/api/domain";
import {
  deleteOptionScore,
  updateOptionScore
} from "../../utils/api/option_score";

const { Text } = Typography;
const ScoreUnitSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  weight: Yup.number()
    .min(1, "Weight must be 1.0 or larger")
    .required("Weight is required"),
  score_type: Yup.string().required("Score type is required")
});

const EditScoreUnitForm = props => {
  const instrument = props.instrument;
  const scoreUnit = props.scoreUnit;
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDomains = async () => {
    const result = await getDomains(
      instrument.project_id,
      instrument.id,
      props.scoreSchemeId
    );
    setDomains(result.data);
  };

  const handleDeleteOptionScore = (optionScore, values, setFieldValue) => {
    deleteOptionScore(
      instrument,
      props.scoreSchemeId,
      scoreUnit,
      optionScore.id
    )
      .then(res => {
        let index = values.option_scores.indexOf(optionScore);
        const copy = values.option_scores.slice();
        copy.splice(index, 1);
        setFieldValue("option_scores", copy);
        props.fetchScoreUnits(true, scoreUnit);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleUpdateOptionScore = optionScore => {
    updateOptionScore(
      instrument,
      props.scoreSchemeId,
      scoreUnit,
      optionScore
    ).then(props.fetchScoreUnits(true, scoreUnit));
  };

  return (
    <Modal
      title={scoreUnit.title}
      visible={props.visible}
      footer={null}
      onCancel={() => props.setVisible(false)}
      width={modalWidth}
    >
      <Formik
        initialValues={{
          domain_id: scoreUnit.domain_id,
          subdomain_id: scoreUnit.subdomain_id,
          title: scoreUnit.title,
          weight: scoreUnit.weight,
          score_type: scoreUnit.score_type,
          base_point_score: scoreUnit.base_point_score,
          option_scores: scoreUnit.option_scores
        }}
        validationSchema={ScoreUnitSchema}
        onSubmit={(values, { setErrors }) => {
          updateScoreUnit(instrument, props.scoreSchemeId, {
            id: scoreUnit.id,
            domain_id: values.domain_id,
            subdomain_id: values.subdomain_id,
            title: values.title,
            weight: values.weight,
            score_type: values.score_type,
            base_point_score: values.base_point_score
          })
            .then(res => props.fetchScoreUnits())
            .catch(error => setErrors(error));
        }}
        render={({ values, setFieldValue }) => (
          <Form>
            <DRow>
              <Col span={4}>
                <Text strong>Domain</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="domain_id"
                  component="select"
                >
                  <option></option>
                  {domains.map(domain => {
                    return (
                      <option
                        key={domain.id}
                        name="domain_id"
                        value={domain.id}
                      >
                        {domain.title}
                      </option>
                    );
                  })}
                </Field>
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="domain_id" type="error" />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Subdomain</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="subdomain_id"
                  component="select"
                >
                  <option></option>
                  {values.domain_id &&
                    domains.length > 0 &&
                    domains
                      .find(d => d.id === Number(values.domain_id))
                      .subdomains.map(sd => {
                        return (
                          <option key={sd.id} name="subdomain_id" value={sd.id}>
                            {sd.title}
                          </option>
                        );
                      })}
                </Field>
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="subdomain_id" type="error" />
              </Col>
            </DRow>
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
            <DRow>
              <RightSubmitButton />
            </DRow>
            {values.option_scores.length > 0 && (
              <DRow>
                <Col span={12}>
                  <strong>Option Identifier</strong>
                </Col>
                <Col span={8}>
                  <strong>Option Score</strong>
                </Col>
                <Col span={4}>
                  <strong>Actions</strong>
                </Col>
              </DRow>
            )}
            {values.option_scores.map((optionScore, index) => (
              <DRow key={`${optionScore.option_identifier}_${index}`}>
                <Col span={12}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: optionScore.option_identifier
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Field
                    className="ant-input-number"
                    name={`option_scores.${index}.value`}
                    placeholder="Value"
                    type="number"
                    step="0.1"
                  />
                  <AlertErrorMessage
                    name={`option_scores.${index}.value`}
                    type="error"
                  />
                </Col>
                <Col span={4}>
                  <SaveButton
                    handleClick={() => handleUpdateOptionScore(optionScore)}
                  />
                  <Divider type="vertical" />
                  <DeleteButton
                    handleClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${optionScore.option_identifier}?`
                        )
                      )
                        handleDeleteOptionScore(
                          optionScore,
                          values,
                          setFieldValue
                        );
                    }}
                  />
                </Col>
              </DRow>
            ))}
          </Form>
        )}
      />
    </Modal>
  );
};

export default EditScoreUnitForm;
