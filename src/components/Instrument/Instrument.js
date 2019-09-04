import React, { useState, useEffect } from "react";
import { getInstrument } from "../../utils/API";
import { Layout, Tabs, Icon, Spin } from "antd";
import InstrumentSider from "./InstrumentSider";
import { CenteredH1 } from "../../utils/Styles";
import Display from "../Display/Display";
import InstrumentSections from "../Section/Sections";
import ScoreSchemes from "../ScoreScheme/ScoreSchemes";

const { Content } = Layout;
const { TabPane } = Tabs;

const Instrument = ({ match }) => {
  const projectId = match.params.project_id;
  const instrumentId = match.params.id;
  const [loading, setLoading] = useState(true);
  const [instrument, setInstrument] = useState({});
  const [sections, setSections] = useState([]);
  const [display, setDisplay] = useState(null);
  const [selectedKey, setSelectedKey] = useState("1");

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
          <Display
            projectId={projectId}
            display={display}
            displays={[].concat.apply([], sections.map(sec => sec.displays))}
          />
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
        setDisplay={setDisplay}
        setSections={setSections}
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
