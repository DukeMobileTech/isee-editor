import React, { useState, useEffect } from "react";
import { Spin, Table } from "antd";
import { getQuestionTranslations } from "../../utils/api/question_translation";
import {
  getAllQuestions,
  getQuestionSetQuestions,
  getFolderQuestions
} from "../../utils/api/question";
import QuestionTranslations from "./QuestionTranslations";
import { getColumnSearchProps } from "../utils/ColumnSearch";
import { TranslationsHeader } from "../utils/TranslationsHeader";

const QuestionTranslationsTable = props => {
  const questions = props.questions;
  const translations = props.translations;
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Identifier",
      dataIndex: "question_identifier",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("question_identifier", searchText, setSearchText)
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText),
          render: (text, question) => (
            <span
              dangerouslySetInnerHTML={{
                __html: question.text
              }}
            />
          )
        }
      : {
          title: "Text",
          dataIndex: "text",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText)
        },
    {
      title: "Translations",
      dataIndex: "translations",
      width: "50%",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const qta = translations.filter(t => t.question_id === a.id);
        const qtb = translations.filter(t => t.question_id === b.id);
        return qta.length - qtb.length;
      },
      render: (text, question) => {
        const questionTranslations = translations.filter(
          translation => translation.question_id === question.id
        );
        return (
          <QuestionTranslations
            question={question}
            translations={questionTranslations}
            language={props.language}
          />
        );
      }
    }
  ];

  return (
    <Table
      bordered
      dataSource={questions}
      rowKey={question => question.id}
      columns={columns}
      size="small"
      pagination={{ defaultPageSize: 25 }}
    />
  );
};

const Translations = props => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(null);
  const [translations, setTranslations] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (props.questions) {
        setQuestions(props.questions);
      } else {
        setLoading(true);
        if (props.questionSet) {
          const results = await getQuestionSetQuestions(props.questionSet.id);
          setQuestions(results.data);
          setLoading(false);
        } else if (props.folder) {
          const results = await getFolderQuestions(props.folder);
          setQuestions(results.data);
          setLoading(false);
        } else {
          const results = await getAllQuestions();
          setQuestions(results.data);
          setLoading(false);
        }
      }
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchQuestionTranslations = async () => {
      setLoading(true);
      const result = await getQuestionTranslations(language);
      setTranslations(result.data);
      setLoading(false);
    };
    fetchQuestionTranslations();
  }, [language, props.questionSet]);

  const handleChange = value => {
    setLanguage(value);
  };

  return (
    <Spin spinning={loading}>
      <TranslationsHeader
        handleClick={() => props.setShowTranslations(!props.showTranslations)}
        handleChange={handleChange}
      />
      <QuestionTranslationsTable
        questions={questions}
        translations={translations}
        language={language}
      />
    </Spin>
  );
};

export default Translations;
