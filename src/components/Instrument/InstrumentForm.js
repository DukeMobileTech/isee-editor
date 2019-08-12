import React, { useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import { LanguageContext } from "../../context/LanguageContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import * as Yup from "yup";
import { createInstrument, updateInstrument } from "../../utils/API";

const InstrumentSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  language: Yup.string().required("Language is required"),
  project_id: Yup.string().required("Project is required")
});

const InstrumentForm = props => {
  const projects = useContext(ProjectContext);
  const languages = useContext(LanguageContext);
  const instrument = props.location.state
    ? props.location.state.instrument
    : null;

  const redirectToInstrument = (projectId, id) => {
    props.history.push(`/projects/${projectId}/instruments/${id}`);
  };

  return (
    <Formik
      initialValues={{
        id: (instrument && instrument.id) || null,
        title: (instrument && instrument.title) || "",
        project_id: (instrument && instrument.project_id) || "",
        language: (instrument && instrument.language) || "",
        published: (instrument && instrument.published) || false
      }}
      validationSchema={InstrumentSchema}
      onSubmit={(values, { setErrors }) => {
        const instrument = {
          title: values.title,
          project_id: values.project_id,
          language: values.language,
          published: values.published
        };
        if (values.id) {
          updateInstrument(values.project_id, values.id, instrument)
            .then(response => {
              if (response.status === 204) {
                // Successful update
                redirectToInstrument(values.project_id, values.id);
              }
            })
            .catch(error => {
              setErrors(error);
            });
        } else {
          createInstrument(values.project_id, instrument)
            .then(response => {
              if (response.status === 201) {
                redirectToInstrument(values.project_id, response.data.id);
              }
            })
            .catch(error => {
              setErrors(error);
            });
        }
      }}
      render={({ errors, values, touched }) => (
        <Form>
          <h4 className="text-center">
            {values.title ? values.title : "New Instrument"}
          </h4>
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
          <Row className="form-group">
            <Col sm="2">
              <label htmlFor="language">Language</label>
            </Col>
            <Col sm="7">
              <Field
                className="form-control"
                name="language"
                component="select"
              >
                <option></option>
                {languages.map(language => {
                  return (
                    <option
                      key={language.code}
                      name="language"
                      value={language.code}
                    >
                      {language.name}
                    </option>
                  );
                })}
              </Field>
            </Col>
            <Col sm="3">
              <ErrorMessage
                name="language"
                render={msg => <Alert variant="danger">{msg}</Alert>}
              />
            </Col>
          </Row>
          <Row className="form-group">
            <Col sm="2">
              <label htmlFor="project_id">Project</label>
            </Col>
            <Col sm="7">
              <Field
                className="form-control"
                name="project_id"
                component="select"
              >
                <option></option>
                {projects.map(project => {
                  return (
                    <option
                      key={project.id}
                      name="project_id"
                      value={project.id}
                    >
                      {project.name}
                    </option>
                  );
                })}
              </Field>
            </Col>
            <Col sm="3">
              <ErrorMessage
                name="project_id"
                render={msg => <Alert variant="danger">{msg}</Alert>}
              />
            </Col>
          </Row>
          <Row className="form-group">
            <Col sm="2">
              <label htmlFor="published">Published</label>
            </Col>
            <Col sm="10">
              <Field
                className="form-control"
                name="published"
                type="checkbox"
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

export default InstrumentForm;
