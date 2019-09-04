import React, { useState } from "react";
import { List, Row, Col, Divider } from "antd";
import { CenteredH3, CenteredH4 } from "../../../utils/Styles";
import DisplayForm from "../../Display/DisplayForm";
import { getSection, deleteDisplay } from "../../../utils/API";
import {
  LeftCancelButton,
  FolderAddButton,
  EditButton,
  DeleteButton
} from "../../../utils/Utils";

const Subsections = props => {
  const [section, setSection] = useState(props.section);
  const [displays, setDisplays] = useState(section.displays);
  const [showForm, setShowForm] = useState(false);
  const [display, setDisplay] = useState(null);

  let lPosition;
  if (section.displays.length > 0) {
    lPosition = section.displays.slice(-1)[0].position;
  } else if (props.sections.length === 1 && section.displays.length === 0) {
    lPosition = 0;
  } else if (props.sections.length > 1) {
    const index = props.sections.indexOf(section);
    lPosition = props.sections[index - 1].displays.slice(-1)[0].position;
  } else {
    lPosition = 0;
  }

  const handleNewDisplay = () => {
    setDisplay(null);
    setShowForm(true);
  };

  const handleEditDisplay = display => {
    setDisplay(display);
    setShowForm(true);
  };

  const handleDeleteDisplay = display => {
    deleteDisplay(
      props.instrument.project_id,
      display.instrument_id,
      display.id
    )
      .then(res => {
        fetchUpdatedDisplays();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const fetchUpdatedDisplays = async () => {
    setShowForm(false);
    const results = await getSection(
      props.instrument.project_id,
      section.instrument_id,
      section.id
    );
    setSection(results.data);
    setDisplays(results.data.displays);
  };

  const FooterButtons = () => {
    return (
      <Row>
        <LeftCancelButton handleClick={props.handleCancel} />
        <FolderAddButton handleClick={handleNewDisplay} />
      </Row>
    );
  };

  const DisplayList = () => {
    return (
      <List
        header={<CenteredH4>Subsections</CenteredH4>}
        footer={<FooterButtons />}
        bordered
        dataSource={displays}
        renderItem={display => (
          <List.Item>
            <Col span={2}>{display.position}</Col>
            <Col span={16}>{display.title}</Col>
            <Col span={6}>
              <EditButton handleClick={() => handleEditDisplay(display)} />
              <Divider type="vertical" />
              <DeleteButton
                handleClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete ${display.title}?`
                    )
                  )
                    handleDeleteDisplay(display);
                }}
              />
            </Col>
          </List.Item>
        )}
      />
    );
  };

  const DisplaysView = () => {
    if (showForm) {
      return (
        <DisplayForm
          instrument={props.instrument}
          section={section}
          display={display}
          lastDisplayPosition={lPosition}
          handleCancel={handleCancel}
          fetchUpdatedDisplays={fetchUpdatedDisplays}
        />
      );
    } else {
      return <DisplayList />;
    }
  };

  return (
    <React.Fragment>
      <CenteredH3>{section.title}</CenteredH3>
      <DisplaysView />
    </React.Fragment>
  );
};

export default Subsections;
