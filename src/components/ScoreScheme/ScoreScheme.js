import {
  DownloadOutlined,
  OrderedListOutlined,
  ProjectOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Row, Spin, Tabs } from "antd";
import fileDownload from "js-file-download";
import React, { Fragment, useEffect, useState } from "react";
import {
  getScoreScheme,
  getScoreSchemeExcel,
} from "../../utils/api/score_scheme";
import { CenteredH3 } from "../../utils/Styles";
import Domains from "../Domain/Domains";
import RedFlags from "../RedFlag/RedFlags";
import ScoreUnits from "./ScoreUnits";

const ScoreScheme = ({ match }) => {
  const projectId = match.params.project_id;
  const instrumentId = match.params.instrument_id;
  const id = match.params.id;
  const [scoreScheme, setScoreScheme] = useState(null);
  const [download, setDownload] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExcel = () => {
      if (download) {
        setLoading(true);
        getScoreSchemeExcel(projectId, instrumentId, id).then((results) => {
          setLoading(false);
          fileDownload(results.data, `${scoreScheme.title}.xlsx`);
        });
      }
    };
    fetchExcel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [download]);

  useEffect(() => {
    const fetchScoreScheme = () => {
      setLoading(true);
      getScoreScheme(projectId, instrumentId, id).then((results) => {
        setScoreScheme(results.data);
        setLoading(false);
      });
    };
    fetchScoreScheme();
  }, [id, instrumentId, projectId]);

  const handleDownload = () => {
    setDownload(true);
  };

  if (scoreScheme === null) {
    return <Spin spinning={loading} />;
  } else {
    return (
      <Fragment>
        <Row style={{ margin: "5px" }}>
          <CenteredH3>{scoreScheme?.title}</CenteredH3>
        </Row>
        <Tabs>
          <Tabs.TabPane
            tab={
              <span>
                <OrderedListOutlined />
                Domains
              </span>
            }
            key="1"
          >
            <Domains
              projectId={projectId}
              instrumentId={instrumentId}
              scoreScheme={scoreScheme}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <ProjectOutlined />
                Score Units
              </span>
            }
            key="2"
          >
            <ScoreUnits
              projectId={projectId}
              instrumentId={instrumentId}
              scoreScheme={scoreScheme}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <DownloadOutlined />
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
                <WarningOutlined />
                Red Flags
              </span>
            }
            key="4"
          >
            <RedFlags
              projectId={projectId}
              instrumentId={instrumentId}
              scoreScheme={scoreScheme}
            />
          </Tabs.TabPane>
        </Tabs>
      </Fragment>
    );
  }
};

export default ScoreScheme;
