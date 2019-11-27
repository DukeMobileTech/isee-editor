import { Collapse, Icon, Tabs, Typography, Spin } from "antd";
import React, { useState, useContext, useEffect } from "react";

import ExpandedQuestion from "../utils/ExpandedQuestion";
import NextQuestion from "../NextQuestion/NextQuestion";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import { getInstrumentQuestions } from "../../utils/api/instrument_question";
import MultipleSkip from "../MultipleSkip/MultipleSkip";

const { TabPane } = Tabs;

const InstrumentLogic = props => {
  const instrumentQuestion = props.instrumentQuestion;
  const [selectedKey, setSelectedKey] = useState("1");
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );

  useEffect(() => {
    const fetchInstrumentQuestions = () => {
      getInstrumentQuestions(
        props.projectId,
        instrumentQuestion.instrument_id
      ).then(results => {
        setInstrumentQuestions(results.data);
        setLoading(false);
      });
    };
    fetchInstrumentQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  return (
    <Spin spinning={loading}>
      <Collapse>
        <Collapse.Panel header="Question Details" key="1">
          <Typography.Paragraph>
            <Typography.Text strong>Text:</Typography.Text>
            <span
              dangerouslySetInnerHTML={{
                __html: instrumentQuestion.question.text
              }}
            />
          </Typography.Paragraph>
          <Typography.Paragraph>
            <ExpandedQuestion
              question={instrumentQuestion.question}
              options={instrumentQuestion.options}
              specialOptions={instrumentQuestion.special_options}
            />
          </Typography.Paragraph>
        </Collapse.Panel>
      </Collapse>
      <Tabs defaultActiveKey={selectedKey} onChange={onTabSelection}>
        <TabPane
          tab={
            <span>
              <Icon type="fast-forward" />
              Skip To
            </span>
          }
          key="1"
        >
          <NextQuestion
            instrumentQuestion={instrumentQuestion}
            projectId={props.projectId}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="filter" />
              Skip Multiple Nonconsecutive
            </span>
          }
          key="2"
        >
          <MultipleSkip
            instrumentQuestion={instrumentQuestion}
            projectId={props.projectId}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="redo" />
              Loops
            </span>
          }
          key="3"
        >
          Loops
        </TabPane>
      </Tabs>
    </Spin>
  );
};

export default InstrumentLogic;
