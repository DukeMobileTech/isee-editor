import React, { useEffect, useState } from "react";
import { Card, Descriptions, Tag, Spin } from "antd";
import { getQuestions } from "../../utils/API";

const FolderQuestions = props => {
  const folder = props.folder;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuestions = async () => {
    const results = await getQuestions(folder);
    setQuestions(results.data);
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div style={{ background: "#ECECEC", padding: "30px" }}>
        {questions &&
          questions.map(question => {
            return (
              <Card key={question.id} title={question.question_identifier}>
                <Descriptions>
                  {question.instructions && (
                    <Descriptions.Item label="Instructions">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: question.instructions
                        }}
                      />
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Text">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: question.text
                      }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Type">
                    {question.question_type}
                  </Descriptions.Item>
                  {question.options && question.options.length > 0 && (
                    <Descriptions.Item label="Options">
                      {question.options.map((option, index) => (
                        <Tag key={option.id} color="geekblue">{`${index + 1}) ${
                          option.text
                        }`}</Tag>
                      ))}
                    </Descriptions.Item>
                  )}
                  {question.special_options && (
                    <Descriptions.Item label="Special Options">
                      {question.special_options.map((option, index) => (
                        <Tag key={option.id} color="blue">{`${index + 1}) ${
                          option.text
                        }`}</Tag>
                      ))}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            );
          })}
      </div>
    </Spin>
  );
};

export default FolderQuestions;
