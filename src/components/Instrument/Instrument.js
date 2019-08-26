import React, { useState, useEffect, useRef } from "react";
import { getInstrument } from "../../utils/API";
import { Layout, Tabs, Icon, Spin } from "antd";
import InstrumentSider from "./InstrumentSider";
import { CenteredH1 } from "../../utils/Styles";
import Display from "../Display/Display";
import InstrumentSections from "../Section/Sections";
import ScoreSchemes from "../ScoringScheme/ScoreSchemes";

const { Content } = Layout;
const { TabPane } = Tabs;

const Instrument = ({ match }) => {
  const projectId = match.params.project_id;
  const instrumentId = match.params.id;
  const [loading, setLoading] = useState(true);
  const [instrument, setInstrument] = useState({});
  const [sections, setSections] = useState([]);
  const [display, setDisplay] = useState([]);
  const [selectedKey, setSelectedKey] = useState("1");
  const currentInstrument = useRef(null);
  const currentDisplays = useRef(null);

  useEffect(() => {
    const fetchInstrument = async () => {
      const result = await getInstrument(projectId, instrumentId);
      setLoading(false);
      setInstrument(result.data);
      currentInstrument.current = result.data;
      setDisplayQuestions(result.data.instrument_questions[0].display_id);
    };
    fetchInstrument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDisplayQuestions = displayId => {
    if (
      displayId &&
      currentInstrument &&
      currentInstrument.current &&
      currentInstrument.current.instrument_questions
    ) {
      const displayQuestions = currentInstrument.current.instrument_questions.filter(
        iq => iq.display_id === Number(displayId)
      );
      const selectedDisplay = currentDisplays.current.find(
        display => display.id === Number(displayId)
      );
      selectedDisplay.instrument_questions = displayQuestions;
      setDisplay(selectedDisplay);
    }
  };

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  const mergeSections = sectionArray => {
    setSections(sectionArray);
    let secDisplays = [];
    sectionArray.forEach(section => {
      secDisplays.push(...section.displays);
    });
    currentDisplays.current = secDisplays;
  };

  const InstrumentView = () => {
    return (
      <Tabs defaultActiveKey={selectedKey} onChange={onTabSelection}>
        <TabPane
          tab={
            <span>
              <Icon type="project" />
              Questions
            </span>
          }
          key="1"
        >
          <Display projectId={projectId} display={display} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="ordered-list" />
              Sections
            </span>
          }
          key="2"
        >
          <InstrumentSections instrument={instrument} sections={sections} />
        </TabPane>
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
      </Tabs>
    );
  };

  return (
    <Layout>
      <InstrumentSider
        projectId={projectId}
        instrumentId={instrumentId}
        mergeSections={mergeSections}
        setDisplayQuestions={setDisplayQuestions}
      />
      <Content style={{ padding: "10px" }}>
        <CenteredH1>{instrument.title}</CenteredH1>
        <Spin spinning={loading}>
          <InstrumentView />
        </Spin>
      </Content>
    </Layout>
  );
};

export default Instrument;
