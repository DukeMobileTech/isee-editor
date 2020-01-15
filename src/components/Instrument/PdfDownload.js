import React, { useState, useEffect } from "react";
import { Spin, Typography, Select, Row, Col } from "antd";
import { getInstrumentPdf } from "../../utils/api/instrument";
import fileDownload from "js-file-download";
import { languages } from "../../utils/Constants";

const PdfDownload = props => {
  const instrument = props.instrument;
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(null);
  const [columnCount, setColumnCount] = useState(null);

  useEffect(() => {
    const fetchPdf = () => {
      if (language !== null && columnCount !== null) {
        setLoading(true);
        getInstrumentPdf(instrument, language, columnCount).then(results => {
          setLoading(false);
          fileDownload(
            results.data,
            `${instrument.title}_${language}_${instrument.current_version_number}.pdf`
          );
        });
      }
    };
    fetchPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, columnCount]);

  const handleChange = value => {
    setLanguage(value);
  };

  const handleColumnChange = count => {
    setColumnCount(count);
  };

  return (
    <Spin spinning={loading}>
      <Row type="flex" align="middle">
        <Col span={6}></Col>
        <Col span={6}>
          <Typography.Text strong style={{ margin: "5px" }}>
            PDF Language
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Select style={{ width: 250 }} onChange={handleChange}>
            {languages.map(language => {
              return (
                <Select.Option
                  key={language.code}
                  name="language"
                  value={language.code}
                >
                  {language.name}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
        <Col span={6}></Col>
      </Row>
      <Row type="flex" align="middle">
        <Col span={6}></Col>
        <Col span={6}>
          <Typography.Text strong style={{ margin: "5px" }}>
            Number of columns
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Select style={{ width: 250 }} onChange={handleColumnChange}>
            <Select.Option key={1} name="column_count" value={1}>
              1
            </Select.Option>
            <Select.Option key={2} name="column_count" value={2}>
              2
            </Select.Option>
            <Select.Option key={3} name="column_count" value={3}>
              3
            </Select.Option>
          </Select>
        </Col>
        <Col span={6}></Col>
      </Row>
    </Spin>
  );
};

export default PdfDownload;
