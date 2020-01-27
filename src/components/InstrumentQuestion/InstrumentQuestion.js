import { Modal, Collapse, Icon, Tabs, Typography } from "antd";
import React, { Fragment, useState } from "react";

import { modalWidth } from "../../utils/Constants";
import InstrumentQuestionForm from "./InstrumentQuestionForm";
import ExpandedQuestion from "../utils/ExpandedQuestion";
import NextQuestion from "../NextQuestion/NextQuestion";
import MultipleSkip from "../MultipleSkip/MultipleSkip";
import LoopQuestion from "../LoopQuestion/LoopQuestion";

const { TabPane } = Tabs;

const InstrumentQuestion = props => {
  const instrumentQuestion = props.instrumentQuestion;
  const [selectedKey, setSelectedKey] = useState("1");

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  const onCancel = () => {
    props.handleCancel();
  };

  return (
    <Modal
      title={instrumentQuestion.identifier}
      visible={props.visible}
      footer={null}
      destroyOnClose={true}
      onCancel={onCancel}
      width={modalWidth}
    >
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
                fetchDisplay={props.fetchDisplay}
              />
            </Typography.Paragraph>
          </Collapse.Panel>
        </Collapse>
        <Tabs defaultActiveKey={selectedKey} onChange={onTabSelection}>
          <TabPane
            tab={
              <span>
                <Icon type="form" />
                Question
              </span>
            }
            key="1"
          >
            <InstrumentQuestionForm
              instrumentQuestion={instrumentQuestion}
              projectId={props.projectId}
              fetchDisplay={props.fetchDisplay}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="fast-forward" />
                Skip To
              </span>
            }
            key="2"
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
            key="3"
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
            key="4"
          >
            <LoopQuestion
              instrumentQuestion={instrumentQuestion}
              projectId={props.projectId}
            />
          </TabPane>
        </Tabs>
      </Fragment>
    </Modal>
  );
};

export default InstrumentQuestion;
