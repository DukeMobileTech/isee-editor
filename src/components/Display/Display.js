import React, { useState } from "react";
import { Row, Col, Table, List } from "antd";
import { CenteredH3 } from "../../utils/Styles";
import { FolderAddButton } from "../../utils/Utils";
import NewInstrumentQuestion from "../InstrumentQuestion/NewInstrumentQuestion";
import { getDisplay } from "../../utils/API";

const { Column } = Table;

let position = 1;
const setPosition = display => {
  if (display.instrument_questions && display.instrument_questions.length > 0) {
    position = display.instrument_questions.slice(-1)[0].number_in_instrument;
  }
};

const Display = props => {
  const [display, setDisplay] = useState(props.display);
  const [showForm, setShowForm] = useState(false);
  setPosition(props.display);

  const handleNewInstrumentQuestion = () => {
    setShowForm(true);
  };

  const fetchUpdatedDisplay = async () => {
    setShowForm(false);
    const results = await getDisplay(
      props.projectId,
      display.instrument_id,
      display.id
    );
    setDisplay(results.data);
    setPosition(results.data);
  };

  const DisplayView = () => {
    if (showForm) {
      return (
        <NewInstrumentQuestion
          projectId={props.projectId}
          display={display}
          position={position}
          fetchUpdatedDisplay={fetchUpdatedDisplay}
        />
      );
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
          <FolderAddButton handleClick={handleNewInstrumentQuestion} />
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
