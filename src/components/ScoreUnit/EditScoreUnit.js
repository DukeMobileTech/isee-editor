import * as Yup from "yup";

import {
  RightSubmitButton,
  SaveButton,
  DeleteButton,
  AddButton
} from "../../utils/Buttons";
import { AlertErrorMessage, DRow, hasOtherOption } from "../../utils/Utils";
import { Col, Typography, Divider } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useState, useEffect, useContext } from "react";

import { updateScoreUnit } from "../../utils/api/score_unit";
import { scoreTypes, institutionTypes } from "../../utils/Constants";
import { getDomains } from "../../utils/api/domain";
import {
  deleteOptionScore,
  updateOptionScore,
  createOptionScore
} from "../../utils/api/option_score";
import { OptionSetContext } from "../../context/OptionSetContext";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";

const { Text } = Typography;
const ScoreUnitSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  weight: Yup.number()
    .min(1, "Weight must be 1.0 or larger")
    .required("Weight is required"),
  score_type: Yup.string().required("Score type is required")
});

const EditScoreUnit = props => {
  const projectId = props.projectId;
  const instrumentId = props.instrumentId;
  const scoreSchemeId = props.scoreSchemeId;
  const scoreUnit = props.scoreUnit;
  const [domains, setDomains] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);

  useEffect(() => {
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDomains = async () => {
    const result = await getDomains(projectId, instrumentId, scoreSchemeId);
    setDomains(result.data);
  };

  const handleDeleteOptionScore = (optionScore, values, setFieldValue) => {
    if (optionScore.id != null) {
      deleteOptionScore(
        projectId,
        instrumentId,
        scoreSchemeId,
        scoreUnit,
        optionScore.id
      )
        .then(res => {
          let index = values.option_scores.indexOf(optionScore);
          const copy = values.option_scores.slice();
          copy.splice(index, 1);
          setFieldValue("option_scores", copy);
          props.fetchScoreUnits();
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      let index = values.option_scores.indexOf(optionScore);
      const copy = values.option_scores.slice();
      copy.splice(index, 1);
      setFieldValue("option_scores", copy);
    }
  };

  const handleUpdateOptionScore = optionScore => {
    if (optionScore.id != null) {
      updateOptionScore(
        projectId,
        instrumentId,
        scoreSchemeId,
        scoreUnit,
        optionScore
      ).then(props.fetchScoreUnits());
    } else {
      createOptionScore(
        projectId,
        instrumentId,
        scoreSchemeId,
        scoreUnit,
        optionScore
      ).then(props.fetchScoreUnits());
    }
  };

  const handleAddOptionScore = (values, setFieldValue) => {
    let optionScore = {
      option_identifier: "",
      value: "",
      score_unit_question_id: scoreUnit.option_scores[0].score_unit_question_id,
      question_identifier: scoreUnit.option_scores[0].question_identifier
    };
    const copy = values.option_scores.slice();
    copy.push(optionScore);
    setFieldValue("option_scores", copy);
  };

  return (
    <Formik
      initialValues={{
        domain_id: scoreUnit && scoreUnit.domain_id,
        subdomain_id: scoreUnit && scoreUnit.subdomain_id,
        title: scoreUnit && scoreUnit.title,
        weight: scoreUnit && scoreUnit.weight,
        score_type: scoreUnit && scoreUnit.score_type,
        base_point_score: scoreUnit && scoreUnit.base_point_score,
        institution_type: (scoreUnit && scoreUnit.institution_type) || "",
        notes: (scoreUnit && scoreUnit.notes) || "",
        option_scores: scoreUnit && scoreUnit.option_scores
      }}
      validationSchema={ScoreUnitSchema}
      onSubmit={(values, { setErrors }) => {
        updateScoreUnit(projectId, instrumentId, scoreSchemeId, {
          id: scoreUnit.id,
          domain_id: values.domain_id,
          subdomain_id: values.subdomain_id,
          title: values.title,
          weight: values.weight,
          score_type: values.score_type,
          institution_type: values.institution_type,
          base_point_score: values.base_point_score,
          notes: values.notes
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
              <Field className="ant-input" name="domain_id" component="select">
                <option></option>
                {domains.map(domain => {
                  return (
                    <option key={domain.id} name="domain_id" value={domain.id}>
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
              <Text strong>Score Type</Text>
            </Col>
            <Col span={14}>
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
                {institutionTypes.map(iType => {
                  return (
                    <option key={iType} name="institution_type" value={iType}>
                      {iType}
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
              <Text strong>Notes</Text>
            </Col>
            <Col span={14}>
              <Field className="ant-input" name="notes" component="textarea" />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="notes" type="error" />
            </Col>
          </DRow>
          <DRow>
            <RightSubmitButton />
          </DRow>
          {values.option_scores.length > 0 && (
            <DRow>
              <Col span={5}>
                <strong>Question</strong>
              </Col>
              <Col span={6}>
                <strong>Option Identifier</strong>
              </Col>
              <Col span={4}>
                <strong>Option Score</strong>
              </Col>
              <Col span={5}>
                <strong>Notes</strong>
              </Col>
              <Col span={4}>
                <strong>Actions</strong>
              </Col>
            </DRow>
          )}
          {values.option_scores.map((optionScore, index) => {
            const question = instrumentQuestions.find(
              iq => iq.identifier === optionScore.question_identifier
            );
            const os =
              question &&
              optionSets.find(set => set.id === question.option_set_id);
            return (
              <DRow key={`${optionScore.option_identifier}_${index}`}>
                {question && <Col span={5}>{question.identifier}</Col>}
                <Col span={6}>
                  <Field
                    className="ant-input"
                    name={`option_scores.${index}.option_identifier`}
                    component="select"
                  >
                    {os &&
                      os.option_in_option_sets.map(oios => {
                        return (
                          <option
                            key={oios.option.id}
                            name={`option_scores.${index}.option_identifier`}
                            value={oios.option.identifier}
                          >
                            {oios.option.identifier}
                          </option>
                        );
                      })}
                    {question && hasOtherOption(question) && os && (
                      <option
                        key={os.other_option.id}
                        name={`option_scores.${index}.option_identifier`}
                        value={os.other_option.identifier}
                      >
                        {os.other_option.identifier}
                      </option>
                    )}
                  </Field>
                </Col>
                <Col span={4}>
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
                <Col span={5}>
                  <Field
                    className="ant-input"
                    name={`option_scores.${index}.notes`}
                    component="textarea"
                    placeholder=""
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
            );
          })}
          <AddButton
            handleClick={() => handleAddOptionScore(values, setFieldValue)}
          />
        </Form>
      )}
    />
  );
};

export default EditScoreUnit;
