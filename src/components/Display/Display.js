import React, { useState } from "react";
import { Row, Col, Table, List } from "antd";
import { CenteredH3 } from "../../utils/Styles";
import { RightAddButton } from "../../utils/Utils";
import NewInstrumentQuestion from "../InstrumentQuestion/NewInstrumentQuestion";

const { Column } = Table;

const Display = props => {
  const display = props.display;
  const [showForm, setShowForm] = useState(false);
  const [instrumentQuestion, setInstrumentQuestion] = useState(null);

  const handleNewInstrumentQuestion = () => {
    console.log("add new question");
    setShowForm(true);
    setInstrumentQuestion(null);
  };

  const DisplayView = () => {
    if (showForm) {
      return <NewInstrumentQuestion instrumentQuestion={instrumentQuestion} />;
    } else {
      return <InstrumentQuestionList />;
    }
  };

  const InstrumentQuestionList = () => {
    return (
      <React.Fragment>
        <Table dataSource={display.instrument_questions} rowKey={iq => iq.id}>
          <Column title="Position" dataIndex="number_in_instrument" />
          <Column title="Identifier" dataIndex="identifier" />
          <Column title="Question Type" dataIndex="type" />
          <Column
            title="Question Text"
            dataIndex="text"
            render={(text, iq) => (
              <span
                dangerouslySetInnerHTML={{
                  __html: iq.text
                }}
              />
            )}
          />
          <Column
            title="Question Choices"
            dataIndex="options"
            render={(text, iq) =>
              iq.options && (
                <List
                  bordered
                  dataSource={iq.options}
                  renderItem={(option, index) => (
                    <List.Item>{`${index + 1}) ${option.text}`}</List.Item>
                  )}
                />
              )
            }
          />
        </Table>
        <div style={{ marginTop: 10 }}>
          <RightAddButton handleClick={handleNewInstrumentQuestion} />
        </div>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <CenteredH3>
        <Row>
          <Col span={2}>
            <b>{display.position}</b>
          </Col>
          <Col span={12} offset={10}>
            <b>{display.title}</b>
          </Col>
        </Row>
      </CenteredH3>
      <DisplayView />
    </React.Fragment>
  );
};

export default Display;
