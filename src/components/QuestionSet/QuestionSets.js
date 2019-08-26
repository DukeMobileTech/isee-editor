import React, { useState, useEffect, Fragment } from "react";
import { Divider, Collapse } from "antd";
import { deleteQuestionSet, getQuestionSets } from "../../utils/API";
import { RightAddButton, EditButton, DeleteButton } from "../../utils/Utils";
import QuestionSetForm from "./QuestionSetForm";
import QuestionSet from "./QuestionSet";

const { Panel } = Collapse;

const QuestionSets = props => {
  const [questionSets, setQuestionSets] = useState(props.questionSets);
  const [showForm, setShowForm] = useState(false);
  const [questionSet, setQuestionSet] = useState(null);

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  const fetchQuestionSets = async () => {
    setShowForm(false);
    const results = await getQuestionSets();
    setQuestionSets(results.data);
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

  function callback(key) {
    console.log(key);
  }

  const CollapseView = () => {
    return (
      <Fragment>
        <Collapse
          accordion
          defaultActiveKey={["1"]}
          onChange={callback}
          expandIconPosition={"left"}
        >
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
        <RightAddButton handleClick={handleNewQuestionSet} />
      </Fragment>
    );
  };

  return <View />;
};

export default QuestionSets;
