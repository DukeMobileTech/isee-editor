import React, { useState, useEffect } from "react";
import { getInstrument, getDisplay } from "../../utils/API";
import { Layout } from "antd";
import InstrumentSider from "./InstrumentSider";
import { CenteredH1 } from "../../utils/Styles";
import Display from "../Display/Display";
import InstrumentSections from "../Section/Sections";

const { Content } = Layout;

const Instrument = ({ match }) => {
  const projectId = match.params.project_id;
  const instrumentId = match.params.id;
  const [showSections, setShowSections] = useState(false);
  const [instrument, setInstrument] = useState({});
  const [sections, setSections] = useState([]);
  const [display, setDisplay] = useState([]);

  useEffect(() => {
    const fetchInstrument = async () => {
      const result = await getInstrument(projectId, instrumentId);
      setInstrument(result.data);
      if (result.data.display_count === 0) {
        setShowSections(true);
      }
    };
    fetchInstrument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDisplay = async displayId => {
    const result = await getDisplay(projectId, instrumentId, displayId);
    setDisplay(result.data);
  };

  const onClickSettings = sections => {
    setSections(sections);
    setShowSections(!showSections);
  };

  const InstrumentView = () => {
    if (showSections) {
      return <InstrumentSections instrument={instrument} sections={sections} />;
    } else {
      return <Display projectId={projectId} display={display} />;
    }
  };

  return (
    <Layout>
      <InstrumentSider
        projectId={projectId}
        instrumentId={instrumentId}
        fetchDisplay={fetchDisplay}
        onClickSettings={onClickSettings}
      />
      <Content style={{ padding: "10px" }}>
        <CenteredH1>{instrument.title}</CenteredH1>
        <InstrumentView />
      </Content>
    </Layout>
  );
};

export default Instrument;
