import React, { useState, Fragment, useEffect } from "react";
import { Row, Col, Table, Button, Icon, Divider } from "antd";
import DisplayInstructionForm from "./DisplayInstructionForm";
import {
  getDisplayInstructions,
  deleteDisplayInstruction
} from "../../utils/API";
import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";

const { Column } = Table;

const DisplayInstructions = props => {
  const [showForm, setShowForm] = useState(false);
  const [displayInstructions, setDisplayInstructions] = useState([]);
  const [displayInstruction, setDisplayInstruction] = useState(null);

  useEffect(() => {
    fetchDisplayInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDisplayInstructions = async () => {
    setShowForm(false);
    const results = await getDisplayInstructions(
      props.projectId,
      props.display.instrument_id,
      props.display.id
    );
    setDisplayInstructions(results.data);
  };

  const handleNewDisplayInstruction = () => {
    setDisplayInstruction(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setDisplayInstruction(null);
  };

  const handleDiEdit = di => {
    setDisplayInstruction(di);
    setShowForm(true);
  };

  const handleDiDelete = di => {
    deleteDisplayInstruction(
      props.projectId,
      props.display.instrument_id,
      props.display.id,
      di
    )
      .then(res => {
        fetchDisplayInstructions();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const View = () => {
    if (showForm) {
      return (
        <DisplayInstructionForm
          projectId={props.projectId}
          displayInstruction={displayInstruction}
          display={props.display}
          handleCancel={handleCancel}
          fetchDisplayInstructions={fetchDisplayInstructions}
        />
      );
    } else {
      return (
        <Fragment>
          <Table dataSource={displayInstructions} rowKey={di => di.id}>
            <Column title="Position" dataIndex="position" />
            <Column
              title="Instruction"
              dataIndex="instructions"
              render={(text, di) => (
                <span
                  dangerouslySetInnerHTML={{
                    __html: di.instructions
                  }}
                />
              )}
            />
            <Column
              title="Actions"
              dataIndex="actions"
              render={(text, di) => (
                <EditDeleteBtnGroup
                  object={di}
                  message={di.instructions}
                  handleEdit={handleDiEdit}
                  handleDelete={handleDiDelete}
                />
              )}
            />
          </Table>
          <Divider />
          <Row>
            <Col offset={18}>
              <Button type="primary" onClick={handleNewDisplayInstruction}>
                <Icon type="plus" /> New Instruction
              </Button>
            </Col>
          </Row>
        </Fragment>
      );
    }
  };

  return <View />;
};

export default DisplayInstructions;
