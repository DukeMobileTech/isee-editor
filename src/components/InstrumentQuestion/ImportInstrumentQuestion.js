import { LeftCancelButton, RightSaveButton } from "../../utils/Utils";
import React, { Fragment, useEffect, useState } from "react";
import { Spin, Tree } from "antd";

import { CenteredH4 } from "../../utils/Styles";
import { createInstrumentQuestion } from "../../utils/api/instrument_question";
import { getAllQuestions } from "../../utils/api/question";
import { getQuestionSets } from "../../utils/api/question_set";

const { TreeNode } = Tree;

const ImportInstrumentQuestion = props => {
  const [questionSets, setQuestionSets] = useState([]);
  const [questionMap, setQuestionMap] = useState(new Map());
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loadingSets, setLoadingSets] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    const fetchQuestionSets = async () => {
      const results = await getQuestionSets();
      setQuestionSets(results.data);
      setLoadingSets(false);
    };
    fetchQuestionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const qsts = [];
      const results = await getAllQuestions();
      setQuestions(results.data);
      for (const question of results.data) {
        qsts.push([question.question_identifier, question]);
      }
      setQuestionMap(new Map(qsts));
      setLoadingQuestions(false);
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCheck = (checkedKeys, info) => {
    let selected = [];
    for (const key of checkedKeys) {
      if (questionMap.has(key)) {
        selected.push(questionMap.get(key));
      }
    }
    setSelectedQuestions(selected);
  };

  const onSaveSelection = () => {
    const instrument_questions = [];
    let position = props.position + 1;
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
        console.log(error);
        props.handleImportCompleted();
      });
  };

  return (
    <Fragment>
      <CenteredH4>Import Questions from Question Banks</CenteredH4>
      <Spin spinning={loadingSets || loadingQuestions}>
        <Tree checkable onCheck={onCheck} autoExpandParent={false}>
          {questionSets.map(questionSet => {
            return (
              <TreeNode
                checkable
                title={questionSet.title}
                key={`${questionSet.title}-${questionSet.id}`}
              >
                {questionSet.folders.map(folder => {
                  return (
                    <TreeNode
                      title={folder.title}
                      key={`${folder.title}-${folder.id}-${folder.question_set_id}`}
                    >
                      {questions
                        .filter(qst => qst.folder_id === folder.id)
                        .map(question => {
                          return (
                            <TreeNode
                              checkStrictly
                              checkable
                              title={question.question_identifier}
                              key={`${question.question_identifier}`}
                              isLeaf={true}
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
        <LeftCancelButton handleClick={props.handleCancel} />
        <RightSaveButton handleClick={onSaveSelection} />
      </Spin>
    </Fragment>
  );
};

export default ImportInstrumentQuestion;
