import { Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  copyQuestion,
  deleteFolderQuestion,
  getAllQuestions,
  getFolderQuestions,
  getQuestionSetQuestions,
} from "../../utils/api/question";
import {
  CopyButton,
  DeleteButton,
  EditButton,
  TranslationAddButtons,
  TranslationButton,
  TranslationOrderAddButtons,
} from "../../utils/Buttons";
import { customExpandIcon } from "../../utils/Utils";
import Translations from "../QuestionTranslation/Translations";
import { getColumnSearchProps } from "../utils/ColumnSearch";
import Attributes from "./Attributes";
import QuestionForm from "./QuestionForm";
import QuestionReorder from "./QuestionReorder";

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
  const [folder, setFolder] = useState(null);
  const [questionSet, setQuestionSet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reorder, setReorder] = useState(false);

  const fetchQuestions = async () => {
    setVisible(false);
    setLoading(true);
    if (location && location.state && location.state.folder) {
      setFolder(location.state.folder);
      const results = await getFolderQuestions(location.state.folder);
      setQuestions(results.data);
      setLoading(false);
    } else if (location && location.state && location.state.questionSet) {
      setQuestionSet(location.state.questionSet);
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

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditQuestion = (question) => {
    setQuestion(question);
    setVisible(true);
  };

  const handleDeleteQuestion = (question) => {
    deleteFolderQuestion(question)
      .then((res) => {
        fetchQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCopyQuestion = (question) => {
    copyQuestion(question.id).then((response) => {
      questions.unshift(response.data);
      setQuestions([...questions]);
    });
  };

  const handleShowTranslations = (question) => {
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

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleReorder = () => {
    setReorder(!reorder);
  };

  const columns = [
    {
      title: "Question Set",
      dataIndex: "question_set_title",
      width: "15%",
      ...getColumnSearchProps("question_set_title", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.question_set_title.localeCompare(b.question_set_title),
    },
    {
      title: "Folder",
      dataIndex: "folder_title",
      width: "15%",
      ...getColumnSearchProps("folder_title", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.folder_title.localeCompare(b.folder_title),
    },
    {
      title: "Identifier",
      dataIndex: "question_identifier",
      width: "10%",
      ...getColumnSearchProps("question_identifier", searchText, setSearchText),
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "40%",
          ...getColumnSearchProps("text", searchText, setSearchText),
          render: (text, question) => (
            <span
              dangerouslySetInnerHTML={{
                __html: question.text,
              }}
            />
          ),
        }
      : {
          title: "Text",
          dataIndex: "text",
          width: "40%",
          ...getColumnSearchProps("text", searchText, setSearchText),
        },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "20%",
      render: (text, question) => (
        <Row gutter={8} type="flex" justify="space-around" align="middle">
          <EditButton handleClick={() => handleEditQuestion(question)} />
          <TranslationButton
            handleClick={() => handleShowTranslations(question)}
          />
          <CopyButton handleClick={() => handleCopyQuestion(question)} />
          <DeleteButton
            handleClick={() => {
              if (
                // eslint-disable-next-line no-alert
                window.confirm(
                  `Are you sure you want to delete ${question.question_identifier}?`
                )
              )
                handleDeleteQuestion(question);
            }}
          />
        </Row>
      ),
    },
  ];

  if (reorder) {
    return (
      <QuestionReorder
        questions={questions}
        fetchQuestions={fetchQuestions}
        folder={folder}
        reorder={reorder}
        setReorder={setReorder}
      />
    );
  } else if (visible) {
    return (
      <QuestionForm
        visible={visible}
        setVisible={setVisible}
        question={question}
        folder={folder}
        questionSet={questionSet}
        fetchQuestions={fetchQuestions}
      />
    );
  } else if (showTranslations) {
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
        {!folder && (
          <TranslationAddButtons
            handleTranslationClick={handleTranslationsClick}
            handleAddClick={handleQuestionAdd}
          />
        )}
        {folder && (
          <TranslationOrderAddButtons
            handleTranslationClick={handleTranslationsClick}
            handleAddClick={handleQuestionAdd}
            handleReorderClick={handleReorder}
          />
        )}
        <Table
          columns={columns}
          dataSource={questions}
          rowKey={(question) => question.id}
          pagination={{
            defaultPageSize: 25,
            onChange: onPageChange,
            current: currentPage,
          }}
          expandedRowRender={(question) => <Attributes question={question} />}
          expandIcon={(props) => customExpandIcon(props)}
        />
      </Spin>
    );
  }
};

export default Questions;
