/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment, useContext } from "react";
import { Divider, Collapse, Spin } from "antd";
import {
  deleteQuestionSet,
  getQuestionSets,
  getOptionSets,
  getInstructions
} from "../../utils/API";
import { FolderAddButton, EditButton, DeleteButton } from "../../utils/Utils";
import QuestionSetForm from "./QuestionSetForm";
import QuestionSet from "./QuestionSet";
import { OptionSetContext } from "../../context/OptionSetContext";
import { InstructionContext } from "../../context/InstructionContext";

const { Panel } = Collapse;

const QuestionSets = props => {
  const [loadingQs, setLoadingQs] = useState(true);
  const [loadingOs, setLoadingOs] = useState(true);
  const [loadingIs, setLoadingIs] = useState(true);
  const [questionSets, setQuestionSets] = useState(props.questionSets);
  const [showForm, setShowForm] = useState(false);
  const [questionSet, setQuestionSet] = useState(null);
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  const [instructions, setInstructions] = useContext(InstructionContext);

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  const fetchQuestionSets = async () => {
    setShowForm(false);
    const results = await getQuestionSets();
    setQuestionSets(results.data);
    setLoadingQs(false);
  };

  useEffect(() => {
    const fetchOptionSets = async () => {
      const results = await getOptionSets();
      setOptionSets(results.data);
      setLoadingOs(false);
    };
    fetchOptionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchInstructions = async () => {
      const results = await getInstructions();
      setInstructions(results.data);
      setLoadingIs(false);
    };
    fetchInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setShowForm(true);
  };

  const handleNewQuestionSet = () => {
    setQuestionSet(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setQuestionSet(null);
  };

  const View = () => {
    if (showForm) {
      return (
        <QuestionSetForm
          questionSet={questionSet}
          fetchQuestionSets={fetchQuestionSets}
          handleCancel={handleCancel}
        />
      );
    } else {
      return <CollapseView />;
    }
  };

  const genExtra = questionSet => (
    <Fragment>
      <EditButton
        handleClick={event => {
          event.stopPropagation();
          handleEditQuestionSet(questionSet);
        }}
      />
      <Divider type="vertical" />
      <DeleteButton
        handleClick={event => {
          event.stopPropagation();
          if (
            window.confirm(
              `Are you sure you want to delete ${questionSet.title}?`
            )
          )
            handleDeleteQuestionSet(questionSet);
        }}
      />
    </Fragment>
  );

  const CollapseView = () => {
    return (
      <Fragment>
        <Collapse accordion expandIconPosition={"left"}>
          {questionSets &&
            questionSets.map(questionSet => {
              return (
                <Panel
                  header={questionSet.title}
                  key={`${questionSet.id}`}
                  extra={genExtra(questionSet)}
                >
                  <QuestionSet questionSet={questionSet} />
                </Panel>
              );
            })}
        </Collapse>
        <br />
        <FolderAddButton handleClick={handleNewQuestionSet} />
      </Fragment>
    );
  };

  return (
    <Spin spinning={loadingQs || loadingOs || loadingIs}>
      <View />
    </Spin>
  );
};

export default QuestionSets;
