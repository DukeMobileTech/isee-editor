import { Spin, Tree } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { QuestionSetContext } from "../../context/QuestionSetContext";
import { createInstrumentQuestion } from "../../utils/api/instrument_question";
import { getAllQuestions } from "../../utils/api/question";
import { LeftCancelButton, RightSaveButton } from "../../utils/Buttons";

const { TreeNode } = Tree;

const ImportInstrumentQuestion = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [questionSets, setQuestionSets] = useContext(QuestionSetContext);
  const [questionMap, setQuestionMap] = useState(new Map());
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const qsts = [];
      const results = await getAllQuestions();
      setQuestions(results.data);
      for (const question of results.data) {
        qsts.push([question.question_identifier, question]);
      }
      setQuestionMap(new Map(qsts));
      setLoading(false);
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
    const instrumentQuestions = [];
    let position = props.display.instrument_questions_count + 1;
    for (const question of selectedQuestions) {
      instrumentQuestions.push({
        question_id: question.id,
        instrument_id: props.display.instrument_id,
        position: position,
        display_id: props.display.id,
        identifier: question.question_identifier,
      });
      position++;
    }
    createInstrumentQuestion(props.projectId, props.display.instrument_id, {
      instrument_questions: instrumentQuestions,
    })
      .then((res) => {
        props.handleImportCompleted();
      })
      .catch((error) => {
        console.log(error);
        props.handleImportCompleted();
      });
  };

  return (
    <Spin spinning={loading}>
      <Tree checkable onCheck={onCheck} autoExpandParent={false}>
        {questionSets.map((questionSet) => {
          return (
            <TreeNode
              checkable
              title={questionSet.title}
              key={`${questionSet.title}-${questionSet.id}`}
            >
              {questionSet.folders.map((folder) => {
                return (
                  <TreeNode
                    title={folder.title}
                    key={`${folder.title}-${folder.id}-${folder.question_set_id}`}
                  >
                    {questions
                      .filter((qst) => qst.folder_id === folder.id)
                      .map((question) => {
                        return (
                          <TreeNode
                            checkStrictly
                            checkable
                            title={question.question_identifier}
                            key={`${question.question_identifier}`}
                            isLeaf
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
  );
};

export default ImportInstrumentQuestion;
