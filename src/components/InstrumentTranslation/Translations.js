import React, { useState, useEffect, Fragment } from "react";
import { TranslationsHeader } from "../utils/TranslationsHeader";
import { Spin, Table } from "antd";
import { getColumnSearchProps } from "../utils/ColumnSearch";
import QuestionTranslations from "./QuestionTranslations";
import { getQuestions } from "../../utils/api/question";
import OptionTranslations from "./OptionTranslations";

const OptionsTable = props => {
  const options = props.options;
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Identifier",
      dataIndex: "identifier",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("identifier", searchText, setSearchText)
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText),
          render: (text, option) => (
            <span
              dangerouslySetInnerHTML={{
                __html: option.text
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
      sorter: (a, b) => {
        const qta = a.option_translations.filter(
          t => t.language === props.language
        );
        const qtb = b.option_translations.filter(
          t => t.language === props.language
        );
        return qta.length - qtb.length;
      },
      render: (text, option) => {
        const translations = option.option_translations.filter(
          translation => translation.language === props.language
        );
        return (
          <OptionTranslations
            option={option}
            translations={translations}
            language={props.language}
          />
        );
      }
    }
  ];

  return (
    <Table
      bordered
      dataSource={options}
      rowKey={option => option.id}
      columns={columns}
      size="small"
      pagination={false}
    />
  );
};

const TranslationsTable = props => {
  const questions = props.questions;
  const language = props.language;
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
      sorter: (a, b) => {
        const qta = a.question_translations.filter(
          t => t.language === props.language
        );
        const qtb = b.question_translations.filter(
          t => t.language === props.language
        );
        return qta.length - qtb.length;
      },
      render: (text, question) => {
        const translations = question.question_translations.filter(
          translation => translation.language === props.language
        );
        return (
          <QuestionTranslations
            question={question}
            translations={translations}
            language={props.language}
            fetchQuestions={props.fetchQuestions}
          />
        );
      }
    }
  ];

  const expandedRowRender = props => {
    if (props.options.length > 0) {
      return <OptionsTable options={props.options} language={language} />;
    } else {
      return <Fragment />;
    }
  };

  return (
    <Table
      bordered
      dataSource={questions}
      rowKey={question => question.id}
      columns={columns}
      size="small"
      pagination={{ defaultPageSize: 25 }}
      expandedRowRender={expandedRowRender}
    />
  );
};

const Translations = props => {
  const questionIds = props.questionIds;
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (questionIds && language) {
      fetchQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIds, language]);

  const fetchQuestions = async () => {
    setLoading(true);
    const result = await getQuestions(
      props.projectId,
      props.instrumentId,
      questionIds,
      language
    );
    const ordered = [];
    questionIds.forEach(id => {
      ordered.push(result.data.find(qst => qst.id === id));
    });
    setQuestions(ordered);
    setLoading(false);
  };

  function handleChange(value) {
    setLanguage(value);
  }

  return (
    <Spin spinning={loading}>
      <TranslationsHeader
        handleClick={() => props.setShowTranslations(!props.showTranslations)}
        handleChange={handleChange}
      />
      <TranslationsTable
        questions={questions}
        language={language}
        fetchQuestions={fetchQuestions}
      />
    </Spin>
  );
};

export default Translations;
