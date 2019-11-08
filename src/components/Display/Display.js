import React, { useState, useEffect, Fragment } from "react";
import { Row, Col, Table, Button, Icon, Typography, Spin, Tabs } from "antd";
import { CenteredH3 } from "../../utils/Styles";
import NewInstrumentQuestion from "../InstrumentQuestion/NewInstrumentQuestion";
import { getDisplay, deleteInstrumentQuestion } from "../../utils/API";
import ExpandedQuestion from "../utils/ExpandedQuestion";
import ImportInstrumentQuestion from "../InstrumentQuestion/ImportInstrumentQuestion";
import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import { OptionSetProvider } from "../../context/OptionSetContext";
import { InstructionProvider } from "../../context/InstructionContext";
import { QuestionSetProvider } from "../../context/QuestionSetContext";
import InstrumentQuestion from "../InstrumentQuestion/InstrumentQuestion";
import DisplayInstructions from "./DisplayInstructions";

const { Column } = Table;
const { TabPane } = Tabs;

let position = 1;
const setPosition = display => {
  if (
    display &&
    display.instrument_questions &&
    display.instrument_questions.length > 0
  ) {
    position = display.instrument_questions.slice(-1)[0].number_in_instrument;
  }
};

const Display = props => {
  const projectId = props.projectId;
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(props.display);
  const [showNew, setShowNew] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [selectedKey, setSelectedKey] = useState("1");
  setPosition(props.display);

  useEffect(() => {
    setShowNew(false);
    let isSubscribed = true;
    if (display) {
      setLoading(true);
      getDisplay(projectId, display.instrument_id, display.id).then(results => {
        if (isSubscribed) {
          setDisplay(results.data);
          setPosition(results.data);
          setLoading(false);
        }
      });
    }
    return () => (isSubscribed = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImportInstrumentQuestion = () => {
    setShowImport(true);
  };

  const handleCreateInstrumentQuestion = () => {
    setShowNew(true);
  };

  const handleCancel = () => {
    setShowNew(false);
    setShowEdit(false);
  };

  const handleImportCompleted = () => {
    setShowImport(false);
    fetchDisplay();
  };

  const fetchDisplay = () => {
    handleCancel();
    setLoading(true);
    getDisplay(projectId, display.instrument_id, display.id).then(results => {
      setDisplay(results.data);
      setPosition(results.data);
      setLoading(false);
    });
  };

  const handleQuestionEdit = question => {
    setEditQuestion(question);
    setShowEdit(true);
  };

  const handleQuestionDelete = question => {
    deleteInstrumentQuestion(projectId, question)
      .then(res => {
        fetchDisplay();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const DisplayView = () => {
    if (showNew) {
      return (
        <QuestionSetProvider>
          <OptionSetProvider>
            <InstructionProvider>
              <NewInstrumentQuestion
                projectId={projectId}
                display={display}
                position={position}
                fetchDisplay={fetchDisplay}
                handleCancel={handleCancel}
                visible={showNew}
              />
            </InstructionProvider>
          </OptionSetProvider>
        </QuestionSetProvider>
      );
    } else if (showEdit) {
      return (
        <InstrumentQuestion
          instrumentQuestion={editQuestion}
          visible={showEdit}
          handleCancel={handleCancel}
          projectId={projectId}
          fetchDisplay={fetchDisplay}
        />
      );
    } else if (showImport) {
      return (
        <ImportInstrumentQuestion
          projectId={projectId}
          display={display}
          position={position}
          handleImportCompleted={handleImportCompleted}
        />
      );
    } else {
      return <InstrumentQuestionList />;
    }
  };

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  const InstrumentQuestionList = () => {
    return (
      <Tabs defaultActiveKey={selectedKey} onChange={onTabSelection}>
        <TabPane
          tab={
            <span>
              <Icon type="project" />
              Questions
            </span>
          }
          key="1"
        >
          <Table
            size="middle"
            dataSource={display.instrument_questions}
            rowKey={iq => iq.id}
            expandedRowRender={question => (
              <ExpandedQuestion question={question} />
            )}
          >
            <Column title="Position" dataIndex="number_in_instrument" />
            <Column title="Identifier" dataIndex="identifier" />
            <Column title="Type" dataIndex="type" />
            <Column
              title="Text"
              dataIndex="text"
              render={(text, iq) => (
                <span
                  dangerouslySetInnerHTML={{
                    __html: iq.text
                  }}
                />
              )}
            />
            <Column
              title="Actions"
              dataIndex="actions"
              render={(text, question) => (
                <EditDeleteBtnGroup
                  object={question}
                  message={question.identifier}
                  handleEdit={handleQuestionEdit}
                  handleDelete={handleQuestionDelete}
                />
              )}
            />
          </Table>
          <br />
          <Row gutter={8}>
            <Col span={12}></Col>
            <Col span={6}>
              <Button type="primary" onClick={handleImportInstrumentQuestion}>
                <Icon type="import" /> Add Question
              </Button>
            </Col>
            <Col span={6}>
              <Button type="primary" onClick={handleCreateInstrumentQuestion}>
                <Icon type="plus" /> Create Question
              </Button>
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="check-square" />
              Instructions
            </span>
          }
          key="2"
        >
          <DisplayInstructions
            projectId={projectId}
            display={display}
            setSelectedKey={setSelectedKey}
          />
        </TabPane>
      </Tabs>
    );
  };

  return (
    <Fragment>
      <Spin spinning={loading}>
        <CenteredH3>
          {display && <Typography.Text strong>{display.title}</Typography.Text>}
        </CenteredH3>
        {display && <DisplayView />}
      </Spin>
    </Fragment>
  );
};

export default Display;
