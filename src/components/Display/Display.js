import {
  Button,
  Col,
  Icon,
  Modal,
  Row,
  Spin,
  Table,
  Tabs,
  Typography
} from "antd";
import React, { Fragment, useEffect, useState } from "react";

import { CenteredH2 } from "../../utils/Styles";
import DisplayInstructions from "./DisplayInstructions";
import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import ExpandedQuestion from "../utils/ExpandedQuestion";
import ImportInstrumentQuestion from "../InstrumentQuestion/ImportInstrumentQuestion";
import InstrumentLogic from "../InstrumentQuestion/InstrumentLogic";
import InstrumentQuestion from "../InstrumentQuestion/InstrumentQuestion";
import NewInstrumentQuestion from "../InstrumentQuestion/NewInstrumentQuestion";
import QuestionForm from "../QuestionSet/QuestionForm";
import { deleteInstrumentQuestion } from "../../utils/api/instrument_question";
import { getDisplay } from "../../utils/api/display";
import { modalWidth } from "../../utils/Constants";
import { reorderInstrumentQuestions } from "../../utils/api/instrument";

const { Column } = Table;
const { TabPane } = Tabs;

const Display = props => {
  const projectId = props.projectId;
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(props.display);
  const [showNew, setShowNew] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [selectedKey, setSelectedKey] = useState("1");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [instrumentQuestion, setInstrumentQuestion] = useState(null);
  const [showLogicModal, setShowLogicModal] = useState(false);

  useEffect(() => {
    setShowNew(false);
    let isSubscribed = true;
    if (display) {
      setLoading(true);
      getDisplay(projectId, display.instrument_id, display.id).then(results => {
        if (isSubscribed) {
          setDisplay(results.data);
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
    setShowImport(false);
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

  const getPosition = display => {
    if (
      display &&
      display.instrument_questions &&
      display.instrument_questions.length > 0
    ) {
      return display.instrument_questions.slice(-1)[0].number_in_instrument;
    } else {
      return 1;
    }
  };

  const reorderQuestions = () => {
    reorderInstrumentQuestions(projectId, display.instrument_id).then(res => {
      fetchDisplay();
    });
  };

  const handleCancelQuestion = () => {
    setShowQuestionModal(false);
    setShowLogicModal(false);
    setInstrumentQuestion(null);
  };

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  const handleQuestionClick = question => {
    setInstrumentQuestion(question);
    setShowQuestionModal(true);
  };

  const handleLogicClick = question => {
    setInstrumentQuestion(question);
    setShowLogicModal(true);
  };

  const DisplayView = () => {
    if (showNew) {
      return (
        <NewInstrumentQuestion
          projectId={projectId}
          display={display}
          position={getPosition(display)}
          fetchDisplay={fetchDisplay}
          handleCancel={handleCancel}
          visible={showNew}
        />
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
          position={getPosition(display)}
          handleImportCompleted={handleImportCompleted}
          handleCancel={handleCancel}
        />
      );
    } else if (showQuestionModal) {
      return (
        <Modal
          title={instrumentQuestion.question.question_identifier}
          visible={true}
          footer={null}
          destroyOnClose={true}
          onCancel={handleCancelQuestion}
          width={modalWidth}
        >
          <QuestionForm
            question={instrumentQuestion.question}
            folder={null}
            fetchQuestions={handleCancelQuestion}
          />
        </Modal>
      );
    } else if (showLogicModal) {
      return (
        <Modal
          title={instrumentQuestion.question.question_identifier}
          visible={true}
          footer={null}
          destroyOnClose={true}
          onCancel={handleCancelQuestion}
          width={modalWidth}
        >
          <InstrumentLogic instrumentQuestion={instrumentQuestion} />
        </Modal>
      );
    } else {
      return <InstrumentQuestionList />;
    }
  };

  const InstrumentQuestionList = () => {
    return (
      <Tabs defaultActiveKey={selectedKey} onChange={onTabSelection}>
        <TabPane
          tab={
            <span>
              <Icon type="project" />
              Instrument Questions
            </span>
          }
          key="1"
        >
          <Fragment>
            <Row>
              <Button
                style={{ float: "right", marginBottom: "3px" }}
                type="primary"
                onClick={reorderQuestions}
              >
                Renumber Instrument Questions
              </Button>
            </Row>
            <Table
              size="middle"
              dataSource={display.instrument_questions}
              rowKey={iq => iq.id}
              expandedRowRender={iq => <ExpandedQuestion iq={iq} />}
            >
              <Column title="Position" dataIndex="number_in_instrument" />
              <Column
                title="Logic"
                dataIndex="identifier"
                render={(text, iq) => (
                  <Button type="link" onClick={() => handleLogicClick(iq)}>
                    {iq.identifier}
                  </Button>
                )}
              />
              <Column
                title="Question"
                dataIndex="type"
                render={(text, iq) => (
                  <Button type="link" onClick={() => handleQuestionClick(iq)}>
                    {iq.question.question_type}
                  </Button>
                )}
              />
              <Column
                title="Text"
                dataIndex="text"
                render={(text, iq) => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: iq.question.text
                    }}
                  />
                )}
              />
              <Column
                title="Actions"
                dataIndex="actions"
                render={(text, iq) => (
                  <EditDeleteBtnGroup
                    object={iq}
                    message={iq.question.question_identifier}
                    handleEdit={handleQuestionEdit}
                    handleDelete={handleQuestionDelete}
                  />
                )}
              />
            </Table>
          </Fragment>
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
              Display Instructions
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
    <Spin spinning={loading}>
      {display && (
        <Fragment>
          <CenteredH2>
            <Typography.Text strong>{display.title}</Typography.Text>
          </CenteredH2>
          <DisplayView />
        </Fragment>
      )}
    </Spin>
  );
};

export default Display;
