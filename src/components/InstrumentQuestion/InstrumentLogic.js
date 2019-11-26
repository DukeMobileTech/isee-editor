import { Collapse, Icon, Tabs, Typography } from "antd";
import React, { Fragment, useState } from "react";

import ExpandedQuestion from "../utils/ExpandedQuestion";

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
            <ExpandedQuestion iq={instrumentQuestion} />
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
          Select One Skip To
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
          Multiple Skip
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
    </Fragment>
  );
};

export default InstrumentLogic;
