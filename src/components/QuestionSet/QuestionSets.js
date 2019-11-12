import React, { useState, useEffect, Fragment, useContext } from "react";
import { Divider, Spin, Row, Pagination, Button, Icon } from "antd";
import {
  deleteQuestionSet,
  getQuestionSets,
  getQuestionSetCount,
  getOptionSets,
  getInstructions
} from "../../utils/API";
import { FolderAddButton } from "../../utils/Utils";
import QuestionSetForm from "./QuestionSetForm";
import QuestionSet from "./QuestionSet";
import FolderForm from "./FolderForm";
import { OptionSetContext } from "../../context/OptionSetContext";
import { InstructionContext } from "../../context/InstructionContext";
import { QuestionSetContext } from "../../context/QuestionSetContext";

const QuestionSets = () => {
  const [loading, setLoading] = useState(true);
  const [showQsForm, setShowQsForm] = useState(false);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [questionSet, setQuestionSet] = useState(null);
  const [questionSets, setQuestionSets] = useState([]);
  const [current, setCurrent] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [perPage, setPerPage] = useState(5);
  const [total, setTotal] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  // eslint-disable-next-line no-unused-vars
  const [sets, setSets] = useContext(QuestionSetContext);

  useEffect(() => {
    const fetchSets = async () => {
      const results = await getQuestionSets();
      setSets(results.data);
    };
    fetchSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchOptionSets = async () => {
      const results = await getOptionSets();
      setOptionSets(results.data);
    };
    fetchOptionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchInstructions = async () => {
      const results = await getInstructions();
      setInstructions(results.data);
    };
    fetchInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getQuestionSetCount().then(res => setTotal(res.data));
  }, []);

  useEffect(() => {
    fetchQuestionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, perPage]);

  const fetchQuestionSets = async () => {
    setShowQsForm(false);
    setShowFolderForm(false);
    const results = await getQuestionSets(current, perPage);
    setQuestionSets(results.data);
    setLoading(false);
  };

  const handleDeleteQuestionSet = questionSet => {
    deleteQuestionSet(questionSet.id)
      .then(res => {
        fetchQuestionSets();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleEditQuestionSet = questionSet => {
    setQuestionSet(questionSet);
    setShowQsForm(true);
  };

  const handleNewQuestionSet = () => {
    setQuestionSet(null);
    setShowQsForm(true);
  };

  const handleNewFolder = questionSet => {
    setQuestionSet(questionSet);
    setShowFolderForm(true);
  };

  const handleCancel = () => {
    setShowQsForm(false);
    setShowFolderForm(false);
    setQuestionSet(null);
  };

  const onChange = page => {
    setCurrent(page);
  };

  if (showQsForm) {
    return (
      <QuestionSetForm
        questionSet={questionSet}
        fetchQuestionSets={fetchQuestionSets}
        handleCancel={handleCancel}
      />
    );
  } else if (showFolderForm) {
    return (
      <FolderForm
        folder={null}
        questionSet={questionSet}
        fetchFolders={fetchQuestionSets}
        handleCancel={handleCancel}
      />
    );
  } else {
    return (
      <Spin spinning={loading}>
        <FolderAddButton handleClick={handleNewQuestionSet} />
        {questionSets.map(qs => {
          return (
            <Fragment key={`${qs.id}`}>
              <div style={{ margin: 5 }}>
                <span style={{ padding: 5 }}>
                  <strong>{qs.title}</strong>
                </span>
                <span style={{ padding: 5 }}>
                  <Button
                    title={`Edit ${qs.title}`}
                    type="link"
                    onClick={event => {
                      event.stopPropagation();
                      handleEditQuestionSet(qs);
                    }}
                  >
                    <Icon type="edit" />
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    style={{ color: "red" }}
                    title={`Delete ${qs.title}`}
                    type="link"
                    onClick={event => {
                      event.stopPropagation();
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${qs.title}?`
                        )
                      )
                        handleDeleteQuestionSet(qs);
                    }}
                  >
                    <Icon type="delete" />
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    title={`Add folder to ${qs.title}`}
                    type="link"
                    onClick={event => {
                      event.stopPropagation();
                      handleNewFolder(qs);
                    }}
                  >
                    <Icon type="folder-add" />
                  </Button>
                </span>
              </div>
              <QuestionSet questionSet={qs} />
            </Fragment>
          );
        })}
        <Row
          style={{ marginTop: 10 }}
          type="flex"
          justify="space-around"
          align="middle"
        >
          <Pagination
            current={current}
            onChange={onChange}
            total={total}
            defaultPageSize={perPage}
          />
        </Row>
      </Spin>
    );
  }
};

export default QuestionSets;
