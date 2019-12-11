import { Collapse, Icon, Tabs, Typography } from "antd";
import React, { useState, Fragment } from "react";

import ExpandedQuestion from "../utils/ExpandedQuestion";
import NextQuestion from "../NextQuestion/NextQuestion";
import MultipleSkip from "../MultipleSkip/MultipleSkip";
import LoopQuestion from "../LoopQuestion/LoopQuestion";

const { TabPane } = Tabs;

const InstrumentLogic = props => {
  const instrumentQuestion = props.instrumentQuestion;
  const [selectedKey, setSelectedKey] = useState("1");

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  return (
    <Fragment>
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
          <LoopQuestion
            instrumentQuestion={instrumentQuestion}
            projectId={props.projectId}
          />
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

export default InstrumentLogic;
