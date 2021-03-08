import { Typography } from "antd";
import React from "react";
import { CenteredH4 } from "../utils/Styles";

const { Text } = Typography;

const Error = () => {
  return (
    <CenteredH4>
      <Text type="danger">Error: Path does not exist!!!</Text>
    </CenteredH4>
  );
};

export default Error;
