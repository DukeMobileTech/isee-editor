import { Icon, Layout, Spin, Tabs } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";

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
import PdfDownload from "./PdfDownload";
import { getInstrumentQuestions } from "../../utils/api/instrument_question";
import { InstrumentQuestionContext } from "../../context/InstrumentQuestionContext";
import { ProjectContext } from "../../context/ProjectContext";
import { ProjectHeader, InstrumentHeader } from "../Headers";

const { Content } = Layout;
const { TabPane } = Tabs;

const Instrument = ({ match }) => {
  const projectId = match.params.project_id;
  const projects = useContext(ProjectContext);
  const project = projects.find(project => project.id === Number(projectId));
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
  // eslint-disable-next-line no-unused-vars
  const [instrumentQuestions, setInstrumentQuestions] = useContext(
    InstrumentQuestionContext
  );
  const [showDisplays, setShowDisplays] = useState(false);
  const [section, setSection] = useState(null);

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

  const onTabSelection = key => {
    setSelectedKey(key);
  };

  const showQuestions = display => {
    setSelectedKey("2");
    setDisplay(display);
  };

  const handleOpenSection = section => {
    setSelectedKey("1");
    setSection(section);
    setShowDisplays(true);
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
          <Sections
            instrument={instrument}
            showQuestions={showQuestions}
            handleOpenSection={handleOpenSection}
            section={section}
            setSection={setSection}
            showDisplays={showDisplays}
            setShowDisplays={setShowDisplays}
          />
        </TabPane>
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
        <TabPane
          tab={
            <span>
              <Icon type="layout" />
              PDF
            </span>
          }
          key="4"
        >
          <PdfDownload instrument={instrument} />
        </TabPane>
      </Tabs>
    );
  };

  return (
    <Fragment>
      <ProjectHeader project={project} />
      <InstrumentHeader instrument={instrument} />
      <Layout>
        <InstrumentSider
          projectId={projectId}
          instrumentId={instrumentId}
          showQuestions={showQuestions}
          handleOpenSection={handleOpenSection}
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
