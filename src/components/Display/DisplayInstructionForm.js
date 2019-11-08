import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Form as AntForm } from "antd";
import * as Yup from "yup";
import {
  getInstructions,
  updateDisplayInstruction,
  createDisplayInstruction
} from "../../utils/API";
import { CenteredH4 } from "../../utils/Styles";
import {
  AlertErrorMessage,
  RightSubmitButton,
  LeftCancelButton
} from "../../utils/Utils";

const FormItem = AntForm.Item;

const DisplayInstructionSchema = Yup.object().shape({
  instruction_id: Yup.string().required("Instruction is required"),
  position: Yup.number().required("Position is required")
});

const DisplayInstructionForm = props => {
  const projectId = props.projectId;
  const displayInstruction = props.displayInstruction;
  const display = props.display;
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    fetchInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInstructions = async () => {
    const results = await getInstructions();
    setInstructions(results.data);
  };

  return (
    <Formik
      initialValues={{
        id: (displayInstruction && displayInstruction.id) || null,
        position: (displayInstruction && displayInstruction.position) || 1,
        instruction_id:
          (displayInstruction && displayInstruction.instruction_id) || "",
        display_id:
          (displayInstruction && displayInstruction.display_id) || display.id
      }}
      validationSchema={DisplayInstructionSchema}
      onSubmit={(values, { setErrors }) => {
        const displayInstruction = {
          id: values.id,
          instruction_id: values.instruction_id,
          position: values.position,
          display_id: values.display_id
        };
        if (values.id) {
          updateDisplayInstruction(
            projectId,
            display.instrument_id,
            display.id,
            displayInstruction
          )
            .then(response => {
              if (response.status === 204) {
                props.fetchDisplayInstructions();
              }
            })
            .catch(error => {
              for (const err of error.response.data.errors) {
                if (err.includes("Instruction")) {
                  setErrors({ instruction_id: err });
                } else if (err.includes("Position")) {
                  setErrors({ position: err });
                }
              }
            });
        } else {
          createDisplayInstruction(
            projectId,
            display.instrument_id,
            display.id,
            displayInstruction
          )
            .then(response => {
              if (response.status === 201) {
                props.fetchDisplayInstructions();
              }
            })
            .catch(error => {
              for (const err of error.response.data.errors) {
                if (err.includes("Instruction")) {
                  setErrors({ instruction_id: err });
                } else if (err.includes("Position")) {
                  setErrors({ position: err });
                }
              }
            });
        }
      }}
      render={({ values }) => (
        <Form className="ant-form ant-form-horizontal">
          <CenteredH4>Display Instruction Form</CenteredH4>
          <FormItem>
            <Field
              className="ant-input"
              name="position"
              placeholder="Enter position"
              type="number"
            />
            <AlertErrorMessage name="position" type="error" />
          </FormItem>
          <FormItem>
            <Field
              className="ant-input"
              name="instruction_id"
              placeholder="Select instruction"
              component="select"
            >
              <option></option>
              {instructions.length > 0 &&
                instructions.map(instruction => {
                  return (
                    <option
                      key={instruction.id}
                      name="instruction_id"
                      value={instruction.id}
                    >
                      {instruction.title.replace(/<[^>]+>/g, "")}
                    </option>
                  );
                })}
            </Field>
          </FormItem>
          <LeftCancelButton handleClick={props.handleCancel} />
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default DisplayInstructionForm;
