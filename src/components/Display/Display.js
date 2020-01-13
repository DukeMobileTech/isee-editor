import { Button, Col, Icon, Row, Spin, Table, Tabs, Typography } from "antd";
import React, { Fragment, useEffect, useState } from "react";

import { CenteredH2 } from "../../utils/Styles";
import DisplayInstructions from "./DisplayInstructions";
import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import ExpandedQuestion from "../utils/ExpandedQuestion";
import ImportInstrumentQuestion from "../InstrumentQuestion/ImportInstrumentQuestion";
import InstrumentQuestion from "../InstrumentQuestion/InstrumentQuestion";
import NewInstrumentQuestion from "../InstrumentQuestion/NewInstrumentQuestion";
import QuestionForm from "../Question/QuestionForm";
import { deleteInstrumentQuestion } from "../../utils/api/instrument_question";
import { getDisplay } from "../../utils/api/display";
import { reorderInstrumentQuestions } from "../../utils/api/instrument";
import TableQuestions from "./TableQuestions";
import { customExpandIcon } from "../../utils/Utils";

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
  const [showTables, setShowTables] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
    setShowTables(false);
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
      return display.instrument_question_count;
    }
  };

  const reorderQuestions = () => {
    reorderInstrumentQuestions(projectId, display.instrument_id).then(res => {
      fetchDisplay();
    });
  };

  const handleCancelQuestion = () => {
    setShowQuestionModal(false);
    setInstrumentQuestion(null);
  };

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  const handleQuestionClick = question => {
    setInstrumentQuestion(question);
    setShowQuestionModal(true);
  };

  const tabulateQuestions = () => {
    setShowTables(true);
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
        <QuestionForm
          question={instrumentQuestion.question}
          folder={null}
          fetchQuestions={handleCancelQuestion}
          visible={showQuestionModal}
          setVisible={setShowQuestionModal}
        />
      );
    } else if (showTables) {
      return (
        <TableQuestions
          handleCancel={handleCancel}
          display={display}
          projectId={projectId}
          fetchDisplay={fetchDisplay}
        />
      );
    } else {
      return <InstrumentQuestionList />;
    }
  };

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const DisplayQuestions = () => {
    return (
      <Table
        size="middle"
        dataSource={display.instrument_questions}
        rowKey={iq => iq.id}
        expandedRowRender={iq => (
          <ExpandedQuestion
            question={iq.question}
            options={iq.options}
            specialOptions={iq.special_options}
          />
        )}
        expandIcon={props => customExpandIcon(props)}
        pagination={{
          defaultPageSize: 25,
          onChange: onPageChange,
          current: currentPage
        }}
      >
        <Column title="Position" dataIndex="number_in_instrument" />
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
    );
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
            <Row style={{ margin: "3px" }}>
              <Button
                type="primary"
                onClick={tabulateQuestions}
                title="Show Tables"
              >
                <Icon type="table" />
              </Button>
              <Button
                style={{ float: "right" }}
                type="primary"
                onClick={reorderQuestions}
                title="Renumber Questions"
              >
                <Icon type="ordered-list" />
              </Button>
            </Row>
            <DisplayQuestions />
          </Fragment>
          <Row style={{ marginTop: "3px" }} gutter={16}>
            <Col span={12}>
              <Button type="primary" onClick={handleImportInstrumentQuestion}>
                <Icon type="import" /> Import Questions
              </Button>
            </Col>
            <Col span={12}>
              <Button
                style={{ float: "right" }}
                type="primary"
                onClick={handleCreateInstrumentQuestion}
              >
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
