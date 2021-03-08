import {
  FastForwardOutlined,
  FilterOutlined,
  FormOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { Collapse, Modal, Tabs, Typography } from "antd";
import React, { Fragment, useState } from "react";
import { modalWidth } from "../../utils/Constants";
import ConditionSkip from "../ConditionSkip/ConditionSkip";
import LoopQuestion from "../LoopQuestion/LoopQuestion";
import MultipleSkip from "../MultipleSkip/MultipleSkip";
import NextQuestion from "../NextQuestion/NextQuestion";
import ExpandedQuestion from "../utils/ExpandedQuestion";
import InstrumentQuestionForm from "./InstrumentQuestionForm";

const { TabPane } = Tabs;

const InstrumentQuestion = (props) => {
  const instrumentQuestion = props.instrumentQuestion;
  const [selectedKey, setSelectedKey] = useState("1");

  const onTabSelection = (key) => {
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
      destroyOnClose
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
                  __html: instrumentQuestion.question.text,
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
                <FormOutlined />
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
                <FastForwardOutlined />
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
                <FilterOutlined />
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
                <RedoOutlined />
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
          <TabPane
            tab={
              <span>
                <FastForwardOutlined />
                Multiple Questions Skip To
              </span>
            }
            key="5"
          >
            <ConditionSkip
              instrumentQuestion={instrumentQuestion}
              projectId={props.projectId}
              display={props.display}
            />
          </TabPane>
        </Tabs>
      </Fragment>
    </Modal>
  );
};

export default InstrumentQuestion;
