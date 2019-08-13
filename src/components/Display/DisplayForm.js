import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import * as Yup from "yup";
import { createDisplay, updateDisplay } from "../../utils/API";

const DisplaySchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  position: Yup.number()
    .min(1, "Number must be greater than 0")
    // .max(maxCount, "Number cannot exceed the current number of sections")
    .required("Postion is required")
});

const DisplayForm = props => {
  const projectId = props.match.params.project_id;
  const instrumentId = props.match.params.instrument_id;
  const sectionId = props.location.state && props.location.state.sectionId;
  const display = props.location.state ? props.location.state.display : null;
  const displayPosition = props.location.state.displayPosition
    ? props.location.state.displayPosition + 1
    : 1;

  const redirectToInstrument = () => {
    props.history.push(`/projects/${projectId}/instruments/${instrumentId}`);
  };

  return (
    <Formik
      initialValues={{
        id: (display && display.id) || null,
        title: (display && display.title) || "",
        instrument_id: (display && display.instrument_id) || instrumentId,
        section_id: (display && display.section_id) || sectionId,
        position: (display && display.position) || displayPosition
      }}
      validationSchema={DisplaySchema}
      onSubmit={(values, { setErrors }) => {
        const display = {
          title: values.title,
          instrument_id: values.instrument_id,
          position: values.position,
          section_id: values.section_id
        };
        if (values.id) {
          updateDisplay(projectId, values.instrument_id, values.id, display)
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
                } else if (err.includes("Position")) {
                  setErrors({ position: err });
                }
              }
            });
        } else {
          createDisplay(projectId, values.instrument_id, display)
            .then(response => {
              if (response.status === 201) {
                redirectToInstrument();
              }
            })
            .catch(error => {
              for (const err of error.response.data.errors) {
                if (err.includes("Title")) {
                  setErrors({ title: err });
                } else if (err.includes("Position")) {
                  setErrors({ position: err });
                }
              }
            });
        }
      }}
      render={({ values }) => (
        <Form>
          <h4 className="text-center">
            {values.title ? values.title : "New Display"}
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

export default DisplayForm;
