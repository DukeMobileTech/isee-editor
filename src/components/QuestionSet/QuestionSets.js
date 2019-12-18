import { Button, Divider, Icon, Row, Spin, Typography } from "antd";
import React, { Fragment, useContext, useState } from "react";
import {
  deleteQuestionSet,
  getQuestionSets
} from "../../utils/api/question_set";

import { TranslationAddButtons } from "../../utils/Utils";
import FolderForm from "./FolderForm";
import QuestionSet from "./QuestionSet";
import { QuestionSetContext } from "../../context/QuestionSetContext";
import QuestionSetForm from "./QuestionSetForm";
import Translations from "../QuestionTranslation/Translations";

const QuestionSets = props => {
  const [loading, setLoading] = useState(false);
  const [showQsForm, setShowQsForm] = useState(false);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [questionSet, setQuestionSet] = useState(null);
  const [questionSets, setQuestionSets] = useContext(QuestionSetContext);
  const [showTranslations, setShowTranslations] = useState(false);
  const [folder, setFolder] = useState(null);

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
    setFolder(null);
    setShowTranslations(true);
  };

  const handleFolderTranslations = folder => {
    setFolder(folder);
    setQuestionSet(null);
    setShowTranslations(true);
  };

  const QuestionSetActions = ({ qSet }) => {
    return (
      <Row justify="center" type="flex">
        <Typography.Title level={4}>{qSet.title}</Typography.Title>
        <span style={{ padding: 5 }}>
          <Button
            title={`Edit ${qSet.title}`}
            type="link"
            onClick={event => {
              event.stopPropagation();
              handleEditQuestionSet(qSet);
            }}
          >
            <Icon type="edit" />
          </Button>
          <Divider type="vertical" />
          <Button
            title={`Add folder to ${qSet.title}`}
            type="link"
            onClick={event => {
              event.stopPropagation();
              handleNewFolder(qSet);
            }}
          >
            <Icon type="folder-add" />
          </Button>
          <Divider type="vertical" />
          <Button
            title={`Show questions for ${qSet.title}`}
            type="link"
            onClick={event => {
              event.stopPropagation();
              props.questionSubset(null, qSet);
            }}
          >
            <Icon type="database" />
          </Button>
          <Divider type="vertical" />
          <Button
            title={`Show question translations for ${qSet.title}`}
            type="link"
            onClick={event => {
              event.stopPropagation();
              handleTranslations(qSet);
            }}
          >
            <Icon type="global" />
          </Button>
          <Divider type="vertical" />
          <Button
            style={{ color: "red" }}
            title={`Delete ${qSet.title}`}
            type="link"
            onClick={event => {
              event.stopPropagation();
              if (
                window.confirm(`Are you sure you want to delete ${qSet.title}?`)
              )
                handleDeleteQuestionSet(qSet);
            }}
          >
            <Icon type="delete" />
          </Button>
        </span>
      </Row>
    );
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
        folder={folder}
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
        <TranslationAddButtons
          handleTranslationClick={() => setShowTranslations(!showTranslations)}
          handleAddClick={handleNewQuestionSet}
        />
        {questionSets.map(qs => {
          return (
            <Fragment key={`${qs.id}`}>
              <QuestionSetActions qSet={qs} />
              <QuestionSet
                questionSet={qs}
                questionSubset={props.questionSubset}
                handleFolderTranslations={handleFolderTranslations}
              />
            </Fragment>
          );
        })}
      </Spin>
    );
  }
};

export default QuestionSets;
