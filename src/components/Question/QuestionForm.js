import { Col, Modal, Select, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import ReactQuill from "react-quill";
import * as Yup from "yup";
import { InstructionContext } from "../../context/InstructionContext";
import { OptionSetContext } from "../../context/OptionSetContext";
import { QuestionSetContext } from "../../context/QuestionSetContext";
import {
  createFolderQuestion,
  updateFolderQuestion,
} from "../../utils/api/question";
import { RightSubmitButton } from "../../utils/Buttons";
import {
  modalWidth,
  pdfResponseHeights,
  questionTypes,
  questionTypesWithDefaultResponses,
  questionTypesWithOptions,
} from "../../utils/Constants";
import { AlertErrorMessage, DRow } from "../../utils/Utils";

const { Text } = Typography;
const { Option } = Select;

const QuestionSchema = Yup.object().shape({
  question_set_id: Yup.number().required("Question Set is required"),
  folder_id: Yup.number().required("Folder is required"),
  question_identifier: Yup.string().required("Identifier is required"),
  question_type: Yup.string().required("Type is required"),
  text: Yup.string()
    .test("isNotEmpty", "Text should not be empty", (string) => {
      if (string === undefined) return false;
      const stripedHtml = string.replace(/<[^>]+>/g, "");
      return stripedHtml.length > 0;
    })
    .required("Text is required"),
  option_set_id: Yup.number().when("question_type", {
    is: (val) => questionTypesWithOptions.includes(val),
    then: Yup.number().required(
      "Option Set required for this type of question"
    ),
  }),
});

const QuestionForm = (props) => {
  const question = props.question;
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  // eslint-disable-next-line no-unused-vars
  const [questionSets, setQuestionSets] = useContext(QuestionSetContext);
  const showOnPdf =
    question === null || (question && question.pdf_print_options === null)
      ? true
      : question.pdf_print_options;
  const title = props.question
    ? props.question.question_identifier
    : "New Question";

  return (
    <Modal
      title={title}
      visible={props.visible}
      footer={null}
      destroyOnClose
      onCancel={() => props.setVisible(false)}
      width={modalWidth}
    >
      <Formik
        initialValues={{
          question_set_id:
            (question && question.question_set_id) ||
            (props.questionSet && props.questionSet.id) ||
            (props.folder && props.folder.question_set_id) ||
            "",
          folder_id:
            (question && question.folder_id) ||
            (props.folder && props.folder.id) ||
            "",
          question_identifier: (question && question.question_identifier) || "",
          question_type: (question && question.question_type) || "",
          pdf_response_height: (question && question.pdf_response_height) || "",
          pdf_print_options: showOnPdf,
          pop_up_instruction_id:
            (question && question.pop_up_instruction_id) || "",
          after_text_instruction_id:
            (question && question.after_text_instruction_id) || "",
          text: (question && question.text) || "",
          identifies_survey: (question && question.identifies_survey) || false,
          option_set_id: (question && question.option_set_id) || "",
          instruction_id: (question && question.instruction_id) || "",
          special_option_set_id:
            (question && question.special_option_set_id) || "",
          default_response: (question && question.default_response) || "",
        }}
        validationSchema={QuestionSchema}
        onSubmit={(values, { setErrors }) => {
          const editQuestion = {
            question_identifier: values.question_identifier,
            folder_id: values.folder_id,
            question_set_id: values.question_set_id,
            question_type: values.question_type,
            text: values.text,
            identifies_survey: values.identifies_survey,
            instruction_id: values.instruction_id,
            option_set_id: values.option_set_id,
            special_option_set_id: values.special_option_set_id,
            pdf_response_height: values.pdf_response_height,
            pdf_print_options: values.pdf_print_options,
            pop_up_instruction_id: values.pop_up_instruction_id,
            after_text_instruction_id: values.after_text_instruction_id,
            default_response: values.default_response,
          };
          if (question && question.id) {
            editQuestion.id = question.id;
            updateFolderQuestion(editQuestion)
              .then((response) => {
                props.fetchQuestions();
              })
              .catch((error) => {
                for (const err of error.data.errors) {
                  if (err.includes("Question identifier")) {
                    setErrors({ question_identifier: err });
                  }
                }
              });
          } else {
            createFolderQuestion(editQuestion)
              .then((response) => {
                if (props.returnValue) {
                  props.fetchQuestions(response.data);
                } else {
                  props.fetchQuestions();
                }
              })
              .catch((error) => {
                for (const err of error.data.errors) {
                  if (err.includes("Question identifier")) {
                    setErrors({ question_identifier: err });
                  }
                }
              });
          }
        }}
        render={({ values, setFieldValue }) => (
          <Form>
            <DRow>
              <Col span={4}>
                <Text strong>Question Set</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="question_set_id"
                  component="select"
                >
                  <option />
                  {questionSets.map((set) => {
                    return (
                      <option
                        key={set.id}
                        name="question_set_id"
                        value={set.id}
                      >
                        {set.title}
                      </option>
                    );
                  })}
                </Field>
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="question_set_id" type="error" />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Folder</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="folder_id"
                  component="select"
                >
                  <option />
                  {values.question_set_id &&
                    questionSets
                      .find((qs) => qs.id === Number(values.question_set_id))
                      .folders.map((folder) => {
                        return (
                          <option
                            key={folder.id}
                            name="folder_id"
                            value={folder.id}
                          >
                            {folder.title}
                          </option>
                        );
                      })}
                </Field>
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="folder_id" type="error" />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Identifier</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="question_identifier"
                  placeholder="Enter unique identifier"
                  type="text"
                />
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="question_identifier" type="error" />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Type</Text>
              </Col>
              <Col span={14}>
                <Field
                  className="ant-input"
                  name="question_type"
                  component="select"
                >
                  <option />
                  {questionTypes.map((type) => {
                    return (
                      <option key={type} name="question_type" value={type}>
                        {type}
                      </option>
                    );
                  })}
                </Field>
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="question_type" type="error" />
              </Col>
            </DRow>
            {values.question_type === "FREE_RESPONSE" && (
              <DRow>
                <Col span={4}>
                  <Text strong>PDF Response Height</Text>
                </Col>
                <Col span={14}>
                  <Field
                    className="ant-input"
                    name="pdf_response_height"
                    component="select"
                  >
                    <option />
                    {pdfResponseHeights.map((height) => {
                      return (
                        <option
                          key={height}
                          name="pdf_response_height"
                          value={height}
                        >
                          {height}
                        </option>
                      );
                    })}
                  </Field>
                </Col>
                <Col span={6}>
                  <AlertErrorMessage name="pdf_response_height" type="error" />
                </Col>
              </DRow>
            )}
            <DRow>
              <Col span={4}>
                <Text strong>Before Text Instructions</Text>
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
                <Text strong>Text</Text>
              </Col>
              <Col span={14}>
                <Field name="text">
                  {({ field }) => (
                    <ReactQuill
                      value={field.value}
                      onChange={field.onChange(field.name)}
                    />
                  )}
                </Field>
              </Col>
              <Col span={6}>
                <AlertErrorMessage name="text" type="error" />
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Pop-up Instructions</Text>
              </Col>
              <Col span={20}>
                <Field
                  name="pop_up_instruction_id"
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
                        setFieldValue("pop_up_instruction_id", value);
                      }}
                      filterOption={(input, option) =>
                        option.props.children &&
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {instructions.map((instruction) => {
                        return (
                          <Option
                            key={instruction.id}
                            name="pop_up_instruction_id"
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
                <Text strong>After Text Instructions</Text>
              </Col>
              <Col span={20}>
                <Field
                  name="after_text_instruction_id"
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
                        setFieldValue("after_text_instruction_id", value);
                      }}
                      filterOption={(input, option) =>
                        option.props.children &&
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {instructions.map((instruction) => {
                        return (
                          <Option
                            key={instruction.id}
                            name="after_text_instruction_id"
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
            {questionTypesWithDefaultResponses.includes(
              values.question_type
            ) && (
              <DRow>
                <Col span={4}>
                  <Text strong>Default Response</Text>
                </Col>
                <Col span={20}>
                  <Field
                    className="ant-input"
                    placeholder="Enter default response"
                    name="default_response"
                    component="textarea"
                  />
                </Col>
              </DRow>
            )}
            {questionTypesWithOptions.includes(values.question_type) && (
              <DRow>
                <Col span={4}>
                  <Text strong>Option Set</Text>
                </Col>
                <Col span={14}>
                  <Field
                    name="option_set_id"
                    render={({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        showSearch
                        optionFilterProp="children"
                        onChange={(value) =>
                          setFieldValue("option_set_id", value)
                        }
                        filterOption={(input, option) =>
                          option.props.children &&
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="" />
                        {optionSets.map((optionSet) => {
                          return (
                            <Option
                              key={optionSet.id}
                              name="option_set_id"
                              value={optionSet.id}
                            >
                              {optionSet.title.replace(/<[^>]+>/g, "")}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  />
                </Col>
                <Col span={6}>
                  <AlertErrorMessage name="option_set_id" type="error" />
                </Col>
              </DRow>
            )}
            {values.option_set_id && (
              <DRow>
                <Col span={4}>
                  <Text strong>Print Options On PDF</Text>
                </Col>
                <Col span={20}>
                  <Field
                    name="pdf_print_options"
                    type="checkbox"
                    checked={values.pdf_print_options}
                  />
                </Col>
              </DRow>
            )}
            <DRow>
              <Col span={4}>
                <Text strong>Special Option Set</Text>
              </Col>
              <Col span={20}>
                <Field
                  className="ant-input"
                  name="special_option_set_id"
                  placeholder="Select special option set for the question"
                  component="select"
                >
                  <option />
                  {optionSets
                    .filter((os) => os.special)
                    .map((optionSet) => {
                      return (
                        <option
                          key={optionSet.id}
                          name="special_option_set_id"
                          value={optionSet.id}
                        >
                          {optionSet.title.replace(/<[^>]+>/g, "")}
                        </option>
                      );
                    })}
                </Field>
              </Col>
            </DRow>
            <DRow>
              <Col span={4}>
                <Text strong>Identifies Survey</Text>
              </Col>
              <Col span={20}>
                <Field
                  name="identifies_survey"
                  type="checkbox"
                  checked={values.identifies_survey}
                />
              </Col>
            </DRow>
            <RightSubmitButton />
          </Form>
        )}
      />
    </Modal>
  );
};

export default QuestionForm;
