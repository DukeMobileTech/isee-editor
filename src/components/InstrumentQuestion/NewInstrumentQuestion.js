import React, { useContext, useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import QuestionForm from "../QuestionSet/QuestionForm";
import { OptionSetContext } from "../../context/OptionSetContext";
import { InstructionContext } from "../../context/InstructionContext";
import {
  getOptionSets,
  getInstructions,
  getQuestionSets,
  createInstrumentQuestion
} from "../../utils/API";
import { QuestionSetContext } from "../../context/QuestionSetContext";

const NewInstrumentQuestion = props => {
  const modalWidth = window.innerWidth * 0.75;
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  // eslint-disable-next-line no-unused-vars
  const [questionSets, setQuestionSets] = useContext(QuestionSetContext);
  const [loadingOs, setLoadingOs] = useState(true);
  const [loadingIs, setLoadingIs] = useState(true);
  const [loadingQs, setLoadingQs] = useState(true);

  useEffect(() => {
    const fetchOptionSets = async () => {
      const results = await getOptionSets();
      setOptionSets(results.data);
      setLoadingOs(false);
    };
    fetchOptionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchInstructions = async () => {
      const results = await getInstructions();
      setInstructions(results.data);
      setLoadingIs(false);
    };
    fetchInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchQuestionSets = async () => {
      const results = await getQuestionSets();
      setQuestionSets(results.data);
      setLoadingQs(false);
    };
    fetchQuestionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancel = () => {
    props.handleCancel();
  };

  const onCreateQuestion = question => {
    const instrument_questions = [];
    instrument_questions.push({
      question_id: question.id,
      instrument_id: props.display.instrument_id,
      number_in_instrument: props.position + 1,
      display_id: props.display.id,
      identifier: question.question_identifier
    });
    createInstrumentQuestion(props.projectId, props.display.instrument_id, {
      instrument_questions
    })
      .then(res => {
        props.fetchDisplay();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Modal
      title="New Question"
      visible={props.visible}
      footer={null}
      destroyOnClose={true}
      onCancel={onCancel}
      width={modalWidth}
    >
      <Spin spinning={loadingOs || loadingIs || loadingQs}>
        <QuestionForm
          question={null}
          folder={null}
          fetchQuestions={onCreateQuestion}
          returnValue={true}
        />
      </Spin>
    </Modal>
  );
};

export default NewInstrumentQuestion;
