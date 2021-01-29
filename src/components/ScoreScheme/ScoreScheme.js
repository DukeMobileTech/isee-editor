import { Icon, Tabs, Row, Button, Spin } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import ScoreUnits from "./ScoreUnits";
import { CenteredH3 } from "../../utils/Styles";
import Domains from "../Domain/Domains";
import { LeftCancelButton } from "../../utils/Buttons";
import { getScoreSchemeExcel } from "../../utils/api/score_scheme";
import fileDownload from "js-file-download";
import RedFlags from "../RedFlag/RedFlags";

const ScoreScheme = props => {
  const project = props.project;
  const instrument = props.instrument;
  const scoreScheme = props.scoreScheme;
  const [download, setDownload] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExcel = () => {
      if (download) {
        setLoading(true);
        getScoreSchemeExcel(instrument, scoreScheme).then(results => {
          setLoading(false);
          fileDownload(results.data, `${scoreScheme.title}.xlsx`);
        });
      }
    };
    fetchExcel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [download]);

  const handleDownload = () => {
    setDownload(true);
  };

  return (
    <Fragment>
      <Row style={{ margin: "5px" }}>
        <LeftCancelButton handleClick={props.handleCancel} />
        <CenteredH3>{scoreScheme.title}</CenteredH3>
      </Row>
      <Tabs>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="ordered-list" />
              Domains
            </span>
          }
          key="1"
        >
          <Domains
            project={project}
            instrument={instrument}
            scoreScheme={scoreScheme}
            handleCancel={props.handleCancel}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="project" />
              Score Units
            </span>
          }
          key="2"
        >
          <ScoreUnits
            project={project}
            instrument={instrument}
            scoreScheme={scoreScheme}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="download" />
              Download
            </span>
          }
          key="3"
        >
          <Spin spinning={loading}>
            <Row type="flex" justify="center">
              <Button
                title="Domain Excel Download"
                type="primary"
                onClick={handleDownload}
              >
                Download
              </Button>
            </Row>
          </Spin>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type="warning" />
              Red Flags
            </span>
          }
          key="4"
        >
          <RedFlags
            project={project}
            instrument={instrument}
            scoreScheme={scoreScheme}
          />
        </Tabs.TabPane>
      </Tabs>
    </Fragment>
  );
};

export default ScoreScheme;
