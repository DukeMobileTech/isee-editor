import {
  CheckSquareOutlined,
  LayoutOutlined,
  OrderedListOutlined,
  TabletOutlined,
} from "@ant-design/icons";
import { Layout, Spin, Tabs } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { InstructionContext } from "../../context/InstructionContext";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import { OptionSetContext } from "../../context/OptionSetContext";
import { QuestionSetContext } from "../../context/QuestionSetContext";
import { getInstructions } from "../../utils/api/instruction";
import { getInstrument } from "../../utils/api/instrument";
import { getInstrumentQuestions } from "../../utils/api/instrument_question";
import { getOptionSets } from "../../utils/api/option_set";
import { getQuestionSets } from "../../utils/api/question_set";
import { InstrumentHeader } from "../Headers";
import InstrumentQuestions from "../InstrumentQuestion/InstrumentQuestions";
import ScoreSchemes from "../ScoreScheme/ScoreSchemes";
import Sections from "../Section/Sections";
import PdfDownload from "./PdfDownload";

const { Content } = Layout;
const { TabPane } = Tabs;

const Instrument = ({ match }) => {
  const projectId = match.params.project_id;
  const instrumentId = match.params.id;
  const [loading, setLoading] = useState(true);
  const [instrument, setInstrument] = useState({});
  const [selectedKey, setSelectedKey] = useState("1");
  // eslint-disable-next-line no-unused-vars
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);
  // eslint-disable-next-line no-unused-vars
  const [questionSets, setQuestionSets] = useContext(QuestionSetContext);
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );

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
      setLoading(true);
      const result = await getInstrument(projectId, instrumentId);
      setInstrument(result.data);
      setLoading(false);
    };
    fetchInstrument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchInstrumentQuestions = async () => {
      setLoading(true);
      const results = await getInstrumentQuestions(projectId, instrumentId);
      setInstrumentQuestions(results.data);
      setLoading(false);
    };
    fetchInstrumentQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTabSelection = (key) => {
    setSelectedKey(key);
  };

  return (
    <Fragment>
      <InstrumentHeader instrument={instrument} />
      <Layout>
        <Content style={{ padding: "10px" }}>
          <Spin spinning={loading}>
            <Tabs defaultActiveKey={selectedKey} onTabClick={onTabSelection}>
              <TabPane
                tab={
                  <span>
                    <OrderedListOutlined />
                    Sections
                  </span>
                }
                key="1"
              >
                <Sections
                  instrument={instrument}
                  projectId={projectId}
                  instrumentId={instrumentId}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <TabletOutlined />
                    Preview
                  </span>
                }
                key="2"
              >
                <InstrumentQuestions
                  instrument={instrument}
                  onTabSelection={onTabSelection}
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <LayoutOutlined />
                    PDF
                  </span>
                }
                key="3"
              >
                <PdfDownload instrument={instrument} />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <CheckSquareOutlined /> Score Schemes
                  </span>
                }
                key="4"
              >
                <ScoreSchemes projectId={projectId} instrument={instrument} />
              </TabPane>
            </Tabs>
          </Spin>
        </Content>
      </Layout>
    </Fragment>
  );
};

export default Instrument;
