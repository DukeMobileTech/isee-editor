import { Button, Divider, Icon, Pagination, Row, Spin, Col } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  deleteQuestionSet,
  getQuestionSets
} from "../../utils/api/question_set";

import { FolderAddButton } from "../../utils/Utils";
import FolderForm from "./FolderForm";
import QuestionSet from "./QuestionSet";
import { QuestionSetContext } from "../../context/QuestionSetContext";
import QuestionSetForm from "./QuestionSetForm";
import Translations from "../QuestionTranslation/Translations";

const QuestionSets = () => {
  const [loading, setLoading] = useState(false);
  const [showQsForm, setShowQsForm] = useState(false);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [questionSet, setQuestionSet] = useState(null);
  const [questionSets, setQuestionSets] = useContext(QuestionSetContext);
  const [showTranslations, setShowTranslations] = useState(false);

  const fetchQuestionSets = async () => {
    setLoading(true);
    setShowQsForm(false);
    setShowFolderForm(false);
    const results = await getQuestionSets();
    setQuestionSets(results.data);
    setLoading(false);
  };

  const handleDeleteQuestionSet = questionSet => {
    deleteQuestionSet(questionSet.id)
      .then(res => {
        fetchQuestionSets();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleEditQuestionSet = questionSet => {
    setQuestionSet(questionSet);
    setShowQsForm(true);
  };

  const handleNewQuestionSet = () => {
    setQuestionSet(null);
    setShowQsForm(true);
  };

  const handleNewFolder = questionSet => {
    setQuestionSet(questionSet);
    setShowFolderForm(true);
  };

  const handleCancel = () => {
    setShowQsForm(false);
    setShowFolderForm(false);
    setQuestionSet(null);
  };

  const handleTranslations = questionSet => {
    setQuestionSet(questionSet);
    setShowTranslations(true);
  };

  if (showQsForm) {
    return (
      <QuestionSetForm
        questionSet={questionSet}
        fetchQuestionSets={fetchQuestionSets}
        handleCancel={handleCancel}
      />
    );
  } else if (showTranslations) {
    return (
      <Translations
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
        questionSet={questionSet}
      />
    );
  } else if (showFolderForm) {
    return (
      <FolderForm
        folder={null}
        questionSet={questionSet}
        fetchFolders={fetchQuestionSets}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Row>
          <Col span={2}>
            <Button
              type="primary"
              onClick={() => setShowTranslations(!showTranslations)}
            >
              <Icon type="global" />
            </Button>
          </Col>
          <FolderAddButton handleClick={handleNewQuestionSet} />
        </Row>
        {questionSets.map(qs => {
          return (
            <Fragment key={`${qs.id}`}>
              <div style={{ margin: 5 }}>
                <span style={{ padding: 5 }}>
                  <strong>{qs.title}</strong>
                </span>
                <span style={{ padding: 5 }}>
                  <Button
                    title={`Edit ${qs.title}`}
                    type="link"
                    onClick={event => {
                      event.stopPropagation();
                      handleEditQuestionSet(qs);
                    }}
                  >
                    <Icon type="edit" />
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    style={{ color: "red" }}
                    title={`Delete ${qs.title}`}
                    type="link"
                    onClick={event => {
                      event.stopPropagation();
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${qs.title}?`
                        )
                      )
                        handleDeleteQuestionSet(qs);
                    }}
                  >
                    <Icon type="delete" />
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    title={`Add folder to ${qs.title}`}
                    type="link"
                    onClick={event => {
                      event.stopPropagation();
                      handleNewFolder(qs);
                    }}
                  >
                    <Icon type="folder-add" />
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    title={`Show translations ${qs.title}`}
                    type="link"
                    onClick={event => {
                      event.stopPropagation();
                      handleTranslations(qs);
                    }}
                  >
                    <Icon type="global" />
                  </Button>
                </span>
              </div>
              <QuestionSet questionSet={qs} />
            </Fragment>
          );
        })}
      </Spin>
    );
  }
};

export default QuestionSets;
