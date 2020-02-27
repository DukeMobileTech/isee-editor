import { Button, Col, Icon, Row, Spin, Table, Typography } from "antd";
import React, { Fragment, useEffect, useState } from "react";

import { CenteredH2 } from "../../utils/Styles";
import ExpandedQuestion from "../utils/ExpandedQuestion";
import ImportInstrumentQuestion from "../InstrumentQuestion/ImportInstrumentQuestion";
import InstrumentQuestion from "../InstrumentQuestion/InstrumentQuestion";
import NewInstrumentQuestion from "../InstrumentQuestion/NewInstrumentQuestion";
import QuestionForm from "../Question/QuestionForm";
import { deleteInstrumentQuestion } from "../../utils/api/instrument_question";
import { getDisplay } from "../../utils/api/display";
import TableQuestions from "./TableQuestions";
import { customExpandIcon } from "../../utils/Utils";
import DisplayQuestions from "./DisplayQuestions";
import {
  ViewButton,
  EditButton,
  DeleteButton,
  TranslationButton
} from "../../utils/Buttons";
import Translations from "../InstrumentTranslation/Translations";

const { Column } = Table;

const Display = props => {
  const projectId = props.projectId;
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(props.display);
  const [showNew, setShowNew] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [instrumentQuestion, setInstrumentQuestion] = useState(null);
  const [showTables, setShowTables] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOrder, setShowOrder] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);
  const [questionIds, setQuestionIds] = useState([]);

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
    setShowQuestionModal(false);
    setInstrumentQuestion(null);
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

  const handleInstrumentQuestionEdit = question => {
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

  const reorderQuestions = () => {
    setShowOrder(!showOrder);
  };

  const handleQuestionClick = question => {
    setInstrumentQuestion(question);
    setShowQuestionModal(true);
  };

  const handleTranslation = question => {
    setQuestionIds([question.question.id]);
    setShowTranslations(true);
  };

  const handleTranslations = () => {
    setQuestionIds(display.instrument_questions.map(iq => iq.question.id));
    setShowTranslations(true);
  };

  const tabulateQuestions = () => {
    setShowTables(true);
  };

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const DisplayView = () => {
    if (showTranslations) {
      return (
        <Translations
          projectId={projectId}
          instrumentId={display.instrument_id}
          questionIds={questionIds}
          setShowTranslations={setShowTranslations}
          showTranslations={showTranslations}
        />
      );
    } else if (showNew) {
      return (
        <NewInstrumentQuestion
          projectId={projectId}
          display={display}
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
          display={display}
        />
      );
    } else if (showImport) {
      return (
        <ImportInstrumentQuestion
          projectId={projectId}
          display={display}
          handleImportCompleted={handleImportCompleted}
          handleCancel={handleCancel}
        />
      );
    } else if (showQuestionModal) {
      return (
        <QuestionForm
          question={instrumentQuestion.question}
          folder={null}
          fetchQuestions={fetchDisplay}
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
    } else if (showOrder) {
      return (
        <DisplayQuestions
          instrumentQuestions={display.instrument_questions}
          display={display}
          projectId={projectId}
          setShowOrder={setShowOrder}
          showOrder={showOrder}
          fetchDisplay={fetchDisplay}
        />
      );
    } else {
      return (
        <Fragment>
          <Row
            style={{ marginBottom: "5px" }}
            type="flex"
            justify="space-between"
            align="middle"
          >
            <Button
              type="primary"
              onClick={tabulateQuestions}
              title="Show Tables"
            >
              <Icon type="table" />
            </Button>
            <TranslationButton handleClick={handleTranslations} />
            <Button
              style={{ float: "right" }}
              type="primary"
              onClick={reorderQuestions}
              title="Renumber Questions"
            >
              <Icon type="ordered-list" />
            </Button>
          </Row>
          <Table
            size="middle"
            dataSource={display.instrument_questions}
            rowKey={iq => iq.id}
            expandedRowRender={iq => (
              <ExpandedQuestion
                question={iq.question}
                options={iq.options}
                specialOptions={iq.special_options}
                fetchDisplay={fetchDisplay}
              />
            )}
            expandIcon={props => customExpandIcon(props)}
            pagination={{
              defaultPageSize: 25,
              onChange: onPageChange,
              current: currentPage
            }}
          >
            <Column title="Position" dataIndex="position" />
            <Column title="Identifier" dataIndex="identifier" />
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
                <Row type="flex" justify="space-around" align="middle">
                  <ViewButton
                    handleClick={() => handleInstrumentQuestionEdit(iq)}
                  />
                  <EditButton handleClick={() => handleQuestionClick(iq)} />
                  <TranslationButton
                    handleClick={() => handleTranslation(iq)}
                  />
                  <DeleteButton
                    handleClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${iq.identifier}?`
                        )
                      )
                        handleQuestionDelete(iq);
                    }}
                  />
                </Row>
              )}
            />
          </Table>
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
        </Fragment>
      );
    }
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
