import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Pagination } from "antd";
import { getOptionSets, getOptionSetCount } from "../../utils/API";
import { FolderAddButton } from "../../utils/Utils";
import OptionSet from "./OptionSet";
import NewOptionSet from "./NewOptionSet";

const OptionSets = () => {
  const [loading, setLoading] = useState(true);
  const [optionSets, setOptionSets] = useState([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(10);

  useEffect(() => {
    getOptionSetCount().then(res => setTotal(res.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchOptionSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, perPage]);

  const fetchOptionSets = async () => {
    const results = await getOptionSets(current, perPage);
    setLoading(false);
    setOptionSets(results.data);
  };

  const handleNewOptionSet = () => {
    setVisible(true);
  };

  const onChange = page => {
    setCurrent(page);
  };

  const onShowSizeChange = (current, pageSize) => {
    setPerPage(pageSize);
  };

  return (
    <div style={{ background: "#ECECEC", padding: "30px" }}>
      <Spin spinning={loading}>
        <FolderAddButton handleClick={handleNewOptionSet} />
        <br />
        <NewOptionSet
          visible={visible}
          setVisible={setVisible}
          fetchOptionSets={fetchOptionSets}
        />
        <Row gutter={16} type="flex">
          {optionSets &&
            optionSets.map(optionSet => (
              <Col
                style={{ marginBottom: 5 }}
                key={optionSet.id}
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
              >
                <OptionSet
                  optionSet={optionSet}
                  setOptionSets={setOptionSets}
                  optionSets={optionSets}
                />
              </Col>
            ))}
        </Row>
        <Row type="flex" justify="space-around" align="middle">
          <Pagination
            current={current}
            onChange={onChange}
            total={total}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
          />
        </Row>
      </Spin>
    </div>
  );
};

export default OptionSets;
