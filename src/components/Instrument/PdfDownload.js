import React, { useState, useEffect } from "react";
import { Spin, Typography, Select, Row, Col } from "antd";
import { getInstrumentPdf } from "../../utils/api/instrument";
import fileDownload from "js-file-download";
import { languages } from "../../utils/Constants";

const PdfDownload = props => {
  const instrument = props.instrument;
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    const fetchPdf = () => {
      if (language !== null) {
        setLoading(true);
        getInstrumentPdf(instrument, language).then(results => {
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
  }, [language]);

  const handleChange = value => {
    setLanguage(value);
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
    </Spin>
  );
};

export default PdfDownload;
