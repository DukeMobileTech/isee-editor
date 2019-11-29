import React, { useState, useEffect } from "react";
import {
  Spin,
  Col,
  Button,
  Icon,
  Select,
  Typography,
  Table,
  Input
} from "antd";
import { DRow } from "../../utils/Utils";
import { languages } from "../../utils/Constants";
import Highlighter from "react-highlight-words";
import { getQuestionTranslations } from "../../utils/api/question_translation";
import {
  getAllQuestions,
  getQuestionSetQuestions
} from "../../utils/api/question";
import QuestionTranslations from "./QuestionTranslations";

const QuestionTranslationsTable = props => {
  const questions = props.questions;
  const translations = props.translations;
  const [searchText, setSearchText] = useState("");

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    )
  });

  const columns = [
    {
      title: "Identifier",
      dataIndex: "question_identifier",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("question_identifier")
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("text"),
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
          ...getColumnSearchProps("text")
        },
    {
      title: "Translations",
      dataIndex: "translations",
      width: "50%",
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

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  return (
    <Table
      bordered
      dataSource={questions}
      rowKey={question => question.id}
      columns={columns}
      size="small"
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
      <DRow>
        <Col span={12}>
          <Button
            type="primary"
            onClick={() => props.setShowTranslations(!props.showTranslations)}
          >
            <Icon type="rollback" />
          </Button>
        </Col>
        <Col span={6}>
          <Typography.Text strong>Translation Language</Typography.Text>
        </Col>
        <Col span={6}>
          <Select style={{ width: 120 }} onChange={handleChange}>
            {languages.map(language => {
              return (
                <Select.Option
                  key={language.code}
                  name="language"
                  value={language.code}
                >
                  {language.name}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
      </DRow>
      <QuestionTranslationsTable
        questions={questions}
        translations={translations}
        language={language}
      />
    </Spin>
  );
};

export default Translations;
