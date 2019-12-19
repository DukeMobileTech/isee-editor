import { Row, Spin, Table, Icon, Input, Button } from "antd";
import React, { useEffect, useState } from "react";
import {
  getAllQuestions,
  copyQuestion,
  deleteFolderQuestion,
  getFolderQuestions,
  getQuestionSetQuestions
} from "../../utils/api/question";
import Highlighter from "react-highlight-words";
import {
  TranslationAddButtons,
  EditButton,
  DeleteButton,
  customExpandIcon
} from "../../utils/Utils";
import Question from "../QuestionSet/Question";
import Translations from "../QuestionTranslation/Translations";
import Attributes from "./Attributes";
import { useLocation } from "react-router-dom";

const Questions = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [visible, setVisible] = useState(false);
  const [question, setQuestion] = useState(null);
  const [showTranslations, setShowTranslations] = useState(false);
  const [showQuestionTranslations, setShowQuestionTranslations] = useState(
    false
  );
  const location = useLocation();

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuestions = async () => {
    setVisible(false);
    setLoading(true);
    if (location && location.state && location.state.folder) {
      const results = await getFolderQuestions(location.state.folder);
      setQuestions(results.data);
      setLoading(false);
    } else if (location && location.state && location.state.questionSet) {
      const results = await getQuestionSetQuestions(
        location.state.questionSet.id
      );
      setQuestions(results.data);
      setLoading(false);
    } else {
      const results = await getAllQuestions();
      setQuestions(results.data);
      setLoading(false);
    }
  };

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
    onFilter: (value, record) => {
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    )
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Question Set",
      dataIndex: "question_set_title",
      width: "15%",
      ...getColumnSearchProps("question_set_title"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.question_set_title.localeCompare(b.question_set_title)
    },
    {
      title: "Folder",
      dataIndex: "folder_title",
      width: "15%",
      ...getColumnSearchProps("folder_title"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.folder_title.localeCompare(b.folder_title)
    },
    {
      title: "Identifier",
      dataIndex: "question_identifier",
      width: "10%",
      ...getColumnSearchProps("question_identifier")
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "40%",
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
          width: "40%",
          ...getColumnSearchProps("text")
        },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "20%",
      render: (text, question) => (
        <Row gutter={8} type="flex" justify="space-around" align="middle">
          <EditButton handleClick={() => handleEditQuestion(question)} />
          <Button
            type="primary"
            title="Translations"
            onClick={() => handleShowTranslations(question)}
          >
            <Icon type="global" />
          </Button>
          <Button
            type="primary"
            title="Copy"
            onClick={() => handleCopyQuestion(question)}
          >
            <Icon type="copy" />
          </Button>
          <DeleteButton
            handleClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete ${question.question_identifier}?`
                )
              )
                handleDeleteQuestion(question);
            }}
          />
        </Row>
      )
    }
  ];

  const handleEditQuestion = question => {
    setQuestion(question);
    setVisible(true);
  };

  const handleDeleteQuestion = question => {
    deleteFolderQuestion(question)
      .then(res => {
        fetchQuestions();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCopyQuestion = question => {
    copyQuestion(question.id).then(response => {
      questions.unshift(response.data);
      setQuestions([...questions]);
    });
  };

  const handleShowTranslations = question => {
    setQuestion(question);
    setShowQuestionTranslations(!showQuestionTranslations);
  };

  const handleQuestionAdd = () => {
    setVisible(true);
    setQuestion(null);
  };

  const handleTranslationsClick = () => {
    setShowTranslations(!showTranslations);
  };

  if (showTranslations) {
    return (
      <Translations
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
        questions={questions}
      />
    );
  } else if (showQuestionTranslations) {
    return (
      <Translations
        setShowTranslations={setShowQuestionTranslations}
        showTranslations={showQuestionTranslations}
        questions={[question]}
      />
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Question
          visible={visible}
          setVisible={setVisible}
          question={question}
          folder={null}
          fetchQuestions={fetchQuestions}
        />
        <TranslationAddButtons
          handleTranslationClick={handleTranslationsClick}
          handleAddClick={handleQuestionAdd}
        />
        <Table
          columns={columns}
          dataSource={questions}
          rowKey={question => question.id}
          pagination={{ defaultPageSize: 25 }}
          expandedRowRender={question => <Attributes question={question} />}
          expandIcon={props => customExpandIcon(props)}
        />
      </Spin>
    );
  }
};

export default Questions;
