import React, { useState, Fragment, useEffect } from "react";
import { CenteredH1 } from "../../utils/Styles";
import { getQuestionSets, createInstrumentQuestion } from "../../utils/API";
import { Tree } from "antd";
import { RightSaveButton } from "../../utils/Utils";

const { TreeNode } = Tree;

const ImportInstrumentQuestion = props => {
  const [questionSets, setQuestionSets] = useState([]);
  const [questions, setQuestions] = useState(new Map());
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestionSets = async () => {
      const results = await getQuestionSets();
      setQuestionSets(results.data);
      const qsts = [];
      for (const qs of results.data) {
        for (const f of qs.folders) {
          for (const q of f.questions) {
            qsts.push([q.question_identifier, q]);
          }
        }
      }
      setQuestions(new Map(qsts));
    };
    fetchQuestionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCheck = (checkedKeys, info) => {
    let selected = [];
    for (const key of checkedKeys) {
      if (questions.has(key)) {
        selected.push(questions.get(key));
      }
    }
    setSelectedQuestions(selected);
  };

  const onSaveSelection = () => {
    const instrument_questions = [];
    let position = props.position;
    for (const question of selectedQuestions) {
      instrument_questions.push({
        question_id: question.id,
        instrument_id: props.display.instrument_id,
        number_in_instrument: position,
        display_id: props.display.id,
        identifier: question.question_identifier
      });
      position++;
    }
    createInstrumentQuestion(props.projectId, props.display.instrument_id, {
      instrument_questions
    })
      .then(res => {
        props.handleImportCompleted();
      })
      .catch(error => {
        props.handleImportCompleted();
      });
    // props.handleImportCompleted();
  };

  return (
    <Fragment>
      <CenteredH1>Import Questions from Bank</CenteredH1>
      <Tree blockNode checkable onCheck={onCheck}>
        {questionSets.map(questionSet => {
          return (
            <TreeNode
              checkable
              title={questionSet.title}
              key={`${questionSet.title}${questionSet.id}`}
            >
              {questionSet.folders.map(folder => {
                return (
                  <TreeNode
                    title={folder.title}
                    key={`${folder.title}${folder.id}`}
                  >
                    {folder.questions.map(question => {
                      return (
                        <TreeNode
                          checkStrictly
                          checkable
                          title={question.question_identifier}
                          key={`${question.question_identifier}`}
                        />
                      );
                    })}
                  </TreeNode>
                );
              })}
            </TreeNode>
          );
        })}
      </Tree>
      <RightSaveButton handleClick={onSaveSelection} />
    </Fragment>
  );
};

export default ImportInstrumentQuestion;
