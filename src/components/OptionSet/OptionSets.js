import React, { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import { getOptionSets, getOptions, getInstructions } from "../../utils/API";
import { FolderAddButton } from "../../utils/Utils";
import OptionSet from "./OptionSet";
import NewOptionSet from "./NewOptionSet";

const OptionSets = () => {
  const [loading, setLoading] = useState(true);
  const [optionSets, setOptionSets] = useState([]);
  const [options, setOptions] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchOptionSets();
    fetchOptions();
    fetchInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOptionSets = async () => {
    const results = await getOptionSets();
    setLoading(false);
    setOptionSets(results.data);
  };

  const fetchOptions = async () => {
    const results = await getOptions();
    setOptions(results.data);
  };

  const fetchInstructions = async () => {
    const results = await getInstructions();
    setInstructions(results.data);
  };

  const handleNewOptionSet = () => {
    setVisible(true);
  };

  return (
    <div style={{ background: "#ECECEC", padding: "30px" }}>
      <Spin spinning={loading}>
        <FolderAddButton handleClick={handleNewOptionSet} />
        <br></br>
        <NewOptionSet
          visible={visible}
          setVisible={setVisible}
          options={options}
          instructions={instructions}
          fetchOptionSets={fetchOptionSets}
        />
        <Row gutter={16}>
          {optionSets &&
            optionSets.map(optionSet => (
              <Col key={optionSet.id} span={8}>
                <OptionSet
                  optionSet={optionSet}
                  options={options}
                  instructions={instructions}
                  setOptionSets={setOptionSets}
                  optionSets={optionSets}
                />
              </Col>
            ))}
        </Row>
      </Spin>
    </div>
  );
};

export default OptionSets;
