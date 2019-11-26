import { Icon, Layout, Spin, Tabs } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";

import { CenteredH1 } from "../../utils/Styles";
import Display from "../Display/Display";
import { InstructionContext } from "../../context/InstructionContext";
import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";
import InstrumentSider from "./InstrumentSider";
import { OptionSetContext } from "../../context/OptionSetContext";
import { QuestionSetContext } from "../../context/QuestionSetContext";
import ScoreSchemes from "../ScoreScheme/ScoreSchemes";
import Sections from "../Section/Sections";
import { getInstructions } from "../../utils/api/instruction";
import { getInstrument } from "../../utils/api/instrument";
import { getOptionSets } from "../../utils/api/option_set";
import { getQuestionSets } from "../../utils/api/question_set";

const { Content } = Layout;
const { TabPane } = Tabs;

const Instrument = ({ match }) => {
  const projectId = match.params.project_id;
  const instrumentId = match.params.id;
  const [loading, setLoading] = useState(true);
  const [instrument, setInstrument] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [sections, setSections] = useContext(InstrumentSectionContext);
  const [display, setDisplay] = useState(null);
  const [selectedKey, setSelectedKey] = useState("1");
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  // eslint-disable-next-line no-unused-vars
  const [questionSets, setQuestionSets] = useContext(QuestionSetContext);

  useEffect(() => {
    const fetchQuestionSets = async () => {
      const results = await getQuestionSets();
      setQuestionSets(results.data);
    };
    fetchQuestionSets();
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
    const fetchInstrument = async () => {
      const result = await getInstrument(projectId, instrumentId);
      setLoading(false);
      setInstrument(result.data);
    };
    fetchInstrument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  const showQuestions = display => {
    setSelectedKey("2");
    setDisplay(display);
  };

  const InstrumentView = () => {
    return (
      <Tabs defaultActiveKey={selectedKey} onChange={onTabSelection}>
        <TabPane
          tab={
            <span>
              <Icon type="ordered-list" />
              Sections
            </span>
          }
          key="1"
        >
          <Sections instrument={instrument} showQuestions={showQuestions} />
        </TabPane>
        {sections.length > 0 && (
          <TabPane
            tab={
              <span>
                <Icon type="project" />
                Questions
              </span>
            }
            key="2"
          >
            <Display projectId={projectId} display={display} />
          </TabPane>
        )}
        {sections.length > 0 && (
          <TabPane
            tab={
              <span>
                <Icon type="check-square" />
                Scoring Schemes
              </span>
            }
            key="3"
          >
            <ScoreSchemes instrument={instrument} />
          </TabPane>
        )}
      </Tabs>
    );
  };

  return (
    <Fragment>
      <CenteredH1>{instrument.title}</CenteredH1>
      <Layout>
        <InstrumentSider
          projectId={projectId}
          instrumentId={instrumentId}
          showQuestions={showQuestions}
        />
        <Content style={{ padding: "10px" }}>
          <Spin spinning={loading}>
            <InstrumentView />
          </Spin>
        </Content>
      </Layout>
    </Fragment>
  );
};

export default Instrument;
