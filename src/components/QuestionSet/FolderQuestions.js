import React, { useEffect, useState } from "react";
import { Tag, Spin, Table, Button, Typography } from "antd";
import { getQuestions, deleteQuestion } from "../../utils/API";
import { AddButton, EditDeleteBtnGroup } from "../../utils/Utils";
import Question from "./Question";

const { Column } = Table;
const { Text } = Typography;

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
        expandedRowRender={question => (
          <span>
            {question.instructions && (
              <p style={{ margin: 1 }}>
                <Text strong>Instructions: </Text>
                <span
                  dangerouslySetInnerHTML={{
                    __html: question.instructions
                  }}
                />
              </p>
            )}
            {question.options.length > 0 && (
              <p style={{ margin: 1 }}>
                <Text strong>Options: </Text>
                {question.options.map((option, index) => (
                  <Text code key={option.id}>{`${index + 1}) ${
                    option.text
                  }`}</Text>
                ))}
              </p>
            )}
            {question.special_options.length > 0 && (
              <p style={{ margin: 1 }}>
                <Text strong>Special Options: </Text>
                {question.special_options.map((option, index) => (
                  <Tag key={option.id}>{`${index + 1}) ${option.text}`}</Tag>
                ))}
              </p>
            )}
            {question.identifies_survey && (
              <p style={{ margin: 1 }}>
                <Text strong>Identifies Survey: </Text>
                {question.identifies_survey.toString()}
              </p>
            )}
          </span>
        )}
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
      <AddButton handleClick={handleQuestionAdd} />
    </Spin>
  );
};

export default FolderQuestions;
