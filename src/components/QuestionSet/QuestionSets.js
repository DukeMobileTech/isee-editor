/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment, useContext } from "react";
import { Divider, Collapse, Spin, Row, Pagination, Col } from "antd";
import {
  deleteQuestionSet,
  getQuestionSets,
  getOptionSets,
  getInstructions,
  getQuestionSetCount
} from "../../utils/API";
import { FolderAddButton, EditButton, DeleteButton } from "../../utils/Utils";
import QuestionSetForm from "./QuestionSetForm";
import QuestionSet from "./QuestionSet";
import { OptionSetContext } from "../../context/OptionSetContext";
import { InstructionContext } from "../../context/InstructionContext";
import { QuestionSetContext } from "../../context/QuestionSetContext";

const { Panel } = Collapse;

const QuestionSets = () => {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [questionSet, setQuestionSet] = useState(null);
  const [questionSets, setQuestionSets] = useState([]);
  const [current, setCurrent] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    getQuestionSetCount().then(res => setTotal(res.data));
  }, []);

  useEffect(() => {
    fetchQuestionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, perPage]);

  const fetchQuestionSets = async () => {
    setShowForm(false);
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
    setShowForm(true);
  };

  const handleNewQuestionSet = () => {
    setQuestionSet(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setQuestionSet(null);
  };

  const View = () => {
    if (showForm) {
      return (
        <QuestionSetForm
          questionSet={questionSet}
          fetchQuestionSets={fetchQuestionSets}
          handleCancel={handleCancel}
        />
      );
    } else {
      return (
        <Fragment>
          {questionSets &&
            questionSets.map(questionSet => {
              return (
                <Fragment key={`${questionSet.id}`}>
                  <Row>
                    <Col offset={10} span={8}>
                      <strong>{questionSet.title}</strong>
                    </Col>
                    <Col span={6}>
                      <EditButton
                        handleClick={event => {
                          event.stopPropagation();
                          handleEditQuestionSet(questionSet);
                        }}
                      />
                      <Divider type="vertical" />
                      <DeleteButton
                        handleClick={event => {
                          event.stopPropagation();
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${questionSet.title}?`
                            )
                          )
                            handleDeleteQuestionSet(questionSet);
                        }}
                      />
                    </Col>
                  </Row>
                  <br />
                  <QuestionSet questionSet={questionSet} />
                </Fragment>
              );
            })}
        </Fragment>
      );
    }
  };

  const onChange = page => {
    setCurrent(page);
  };

  return (
    <Spin spinning={loading}>
      <FolderAddButton handleClick={handleNewQuestionSet} />
      <View />
      <Row type="flex" justify="space-around" align="middle">
        <Pagination
          current={current}
          onChange={onChange}
          total={total}
          defaultPageSize={perPage}
        />
      </Row>
    </Spin>
  );
};

export default QuestionSets;
