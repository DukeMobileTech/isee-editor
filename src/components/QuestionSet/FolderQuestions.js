import { Button, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { deleteQuestion, getQuestions } from "../../utils/api/question";

import { AddButton } from "../../utils/Utils";
import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import ExpandedQuestion from "../utils/ExpandedQuestion";
import Question from "./Question";

const { Column } = Table;

const FolderQuestions = props => {
  const folder = props.folder;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuestions = async () => {
    setVisible(false);
    setLoading(true);
    const results = await getQuestions(folder);
    setQuestions(results.data);
    setLoading(false);
  };

  const handleQuestionAdd = () => {
    setVisible(true);
    setQuestion(null);
  };

  const handleQuestionEdit = question => {
    setQuestion(question);
    setVisible(true);
  };

  const handleQuestionDelete = question => {
    deleteQuestion(question)
      .then(res => {
        fetchQuestions();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Spin spinning={loading}>
      <Question
        visible={visible}
        setVisible={setVisible}
        question={question}
        folder={folder}
        fetchQuestions={fetchQuestions}
      />
      <Table
        dataSource={questions}
        size="middle"
        rowKey={question => question.id}
        expandedRowRender={question => <ExpandedQuestion question={question} />}
      >
        <Column
          title="Identifier"
          dataIndex="question_identifier"
          render={text => <Button type="link">{text}</Button>}
        />
        <Column title="Type" dataIndex="question_type" />
        <Column
          title="Text"
          dataIndex="text"
          render={(text, question) => (
            <span
              dangerouslySetInnerHTML={{
                __html: question.text
              }}
            />
          )}
        />
        <Column
          title="Actions"
          dataIndex="actions"
          render={(text, question) => (
            <EditDeleteBtnGroup
              object={question}
              message={question.question_identifier}
              handleEdit={handleQuestionEdit}
              handleDelete={handleQuestionDelete}
            />
          )}
        />
      </Table>
      <br />
      <AddButton handleClick={handleQuestionAdd} />
    </Spin>
  );
};

export default FolderQuestions;
