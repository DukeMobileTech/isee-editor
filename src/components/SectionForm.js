import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import * as Yup from "yup";
import { createSection, updateSection } from "../utils/API";

const SectionForm = props => {
  const projectId = useState(props.match.params.project_id);
  const instrumentId = useState(props.match.params.instrument_id);
  const section = useState(
    props.location.state ? props.location.state.section : null
  );
  const maxCount = useState(
    props.location.state.sectionCount
      ? props.location.state.sectionCount + 1
      : 1
  );

  const redirectToInstrument = () => {
    props.history.push(`/projects/${projectId}/instruments/${instrumentId}`);
  };

  return (
    <Formik
      initialValues={{
        id: (section && section.id) || null,
        title: (section && section.title) || "",
        instrument_id: (section && section.instrument_id) || instrumentId,
        position: (section && section.position) || maxCount
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string().required("Title is required"),
        position: Yup.number()
          .min(1, "Number must be greater than 0")
          .max(maxCount, "Number cannot exceed the current number of sections")
          .required("Postion is required")
      })}
      onSubmit={(values, { setErrors }) => {
        const section = {
          title: values.title,
          instrument_id: values.instrument_id,
          position: values.position
        };
        if (values.id) {
          updateSection(projectId, values.instrument_id, values.id, section)
            .then(response => {
              if (response.status === 204) {
                // Successful update
                redirectToInstrument();
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
          createSection(projectId, values.instrument_id, section)
            .then(response => {
              if (response.status === 201) {
                redirectToInstrument();
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
      render={({ values }) => (
        <Form>
          <h4 className="text-center">
            {values.title ? values.title : "New Section"}
          </h4>
          <Row className="form-group">
            <Col sm="2">
              <label htmlFor="position">Position</label>
            </Col>
            <Col sm="7">
              <Field
                className="form-control"
                name="position"
                placeholder="Enter position"
                type="number"
              />
            </Col>
            <Col sm="3">
              <ErrorMessage
                name="position"
                render={msg => <Alert variant="danger">{msg}</Alert>}
              />
            </Col>
          </Row>
          <Row className="form-group">
            <Col sm="2">
              <label htmlFor="title">Title</label>
            </Col>
            <Col sm="7">
              <Field
                className="form-control"
                name="title"
                placeholder="Enter title"
                type="text"
              />
            </Col>
            <Col sm="3">
              <ErrorMessage
                name="title"
                render={msg => <Alert variant="danger">{msg}</Alert>}
              />
            </Col>
          </Row>

          <Button className="float-right" type="submit">
            Save
          </Button>
        </Form>
      )}
    />
  );
};

export default SectionForm;
