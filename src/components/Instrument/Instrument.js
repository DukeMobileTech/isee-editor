import React, { useState, useEffect, useContext, Fragment } from "react";
import { getInstrument } from "../../utils/API";
import { Layout, Tabs, Icon, Spin } from "antd";
import InstrumentSider from "./InstrumentSider";
import { CenteredH1 } from "../../utils/Styles";
import Display from "../Display/Display";
import Sections from "../Section/Sections";
import ScoreSchemes from "../ScoreScheme/ScoreSchemes";
import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";

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
