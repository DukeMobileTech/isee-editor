import { Col, Form as AntForm, Modal, Table, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { Fragment, useState } from "react";
import * as Yup from "yup";
import { getDisplay } from "../../utils/api/display";
import { updateInstrumentQuestion } from "../../utils/api/instrument_question";
import {
  DeleteButton,
  LeftCancelButton,
  LeftCancelRightAddButtons,
  RightSubmitButton,
} from "../../utils/Buttons";
import { modalWidth } from "../../utils/Constants";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import AddTableQuestion from "./AddTableQuestion";

const FormItem = AntForm.Item;

const TableSchema = Yup.object().shape({
  table_identifier: Yup.string().required("Table identifier is required"),
});

const TableForm = (props) => {
  const tableQuestions = props.tableQuestions;

  return (
    <Formik
      initialValues={{
        table_identifier: "",
        instrument_questions: tableQuestions || [],
      }}
      validationSchema={TableSchema}
      onSubmit={(values, { setErrors }) => {
        const updateTable = async () => {
          for (let i = 0; i < values.instrument_questions.length; i++) {
            const editQuestion = {
              id: values.instrument_questions[i].id,
              instrument_id: props.display.instrument_id,
              table_identifier: values.table_identifier,
            };
            await updateInstrumentQuestion(props.projectId, editQuestion);
          }
          props.fetchDisplay();
        };
        updateTable();
      }}
      render={({ values, resetForm }) => (
        <Form className="ant-form ant-form-horizontal">
          <FormItem>
            <Field
              className="ant-input"
              name="table_identifier"
              placeholder="Enter table name"
              type="text"
            />
            <AlertErrorMessage name="table_identifier" type="error" />
          </FormItem>
          {values.instrument_questions.length > 0 && (
            <DRow gutter={16}>
              <Col span={6}>
                <Typography.Text strong>Position</Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text strong>Identifier</Typography.Text>
              </Col>
              <Col span={6}>
                <Typography.Text strong>Action</Typography.Text>
              </Col>
            </DRow>
          )}
          {values.instrument_questions.map((iq, index) => (
            <DRow key={index} gutter={16}>
              <Col span={6}>{iq.number_in_instrument}</Col>
              <Col span={12}>
                <Field
                  className="ant-input"
                  name={`instrument_questions.${index}.identifier`}
                  placeholder="Identifier"
                  type="text"
                />
                <AlertErrorMessage
                  name={`instrument_questions.${index}.identifier`}
                  type="error"
                />
              </Col>
              <Col span={6}>
                <DeleteButton
                  handleClick={() => {
                    if (
                      // eslint-disable-next-line no-alert
                      window.confirm(
                        `Are you sure you want to remove ${iq.identifier} from the table?`
                      )
                    )
                      props.handleRemoveFromTable(iq);
                  }}
                />
              </Col>
            </DRow>
          ))}
          <FormItem>
            <AddTableQuestion
              instrumentQuestions={props.display.instrument_questions}
              tableQuestions={tableQuestions}
              resetForm={resetForm}
              values={values}
            />
          </FormItem>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

const TableQuestions = (props) => {
  const [display, setDisplay] = useState(props.display);
  const [showForm, setShowForm] = useState(false);
  let tableNames = new Set(
    display.instrument_questions.map((iq) => iq.table_identifier)
  );

  tableNames.delete(null);
  tableNames.delete("");
  const tables = [...tableNames];

  const handleTableAdd = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const tableQuestions = (name) => {
    return display.instrument_questions.filter(
      (iq) => iq.table_identifier === name
    );
  };

  const fetchDisplay = () => {
    getDisplay(props.projectId, display.instrument_id, display.id).then(
      (results) => {
        setDisplay(results.data);
        setShowForm(false);
      }
    );
  };

  const handleRemoveFromTable = (iq) => {
    const editQuestion = {
      id: iq.id,
      instrument_id: display.instrument_id,
      table_identifier: null,
    };
    updateInstrumentQuestion(props.projectId, editQuestion).then((response) => {
      if (response.status === 204) {
        fetchDisplay();
      }
    });
  };

  if (showForm) {
    return (
      <Modal
        title="Table Form"
        visible
        footer={null}
        destroyOnClose
        onCancel={handleCancel}
        width={modalWidth}
      >
        <TableForm
          display={display}
          handleCancel={handleCancel}
          tableQuestions={[]}
          handleRemoveFromTable={handleRemoveFromTable}
          projectId={props.projectId}
          fetchDisplay={fetchDisplay}
        />
      </Modal>
    );
  } else {
    return (
      <Fragment>
        {tables.map((name) => {
          return (
            <Table
              key={name}
              size="middle"
              dataSource={tableQuestions(name)}
              rowKey={(iq) => iq.id}
            >
              <Table.Column title="Position" dataIndex="number_in_instrument" />
              <Table.Column title="Identifier" dataIndex="identifier" />
              <Table.Column title="Table Name" dataIndex="table_identifier" />
              <Table.Column
                title="Remove"
                dataIndex="actions"
                render={(text, iq) => (
                  <DeleteButton
                    handleClick={() => {
                      if (
                        // eslint-disable-next-line no-alert
                        window.confirm(
                          `Are you sure you want to remove ${iq.identifier} from table ${iq.table_identifier}?`
                        )
                      )
                        handleRemoveFromTable(iq);
                    }}
                  />
                )}
              />
            </Table>
          );
        })}
        <LeftCancelRightAddButtons
          handleCancelClick={props.handleCancel}
          handleAddClick={handleTableAdd}
        />
      </Fragment>
    );
  }
};

export default TableQuestions;
