import React, { useState, Fragment, useContext } from "react";
import { List, Row, Col, Divider, Button } from "antd";
import { CenteredH3 } from "../../../utils/Styles";
import SubsectionForm from "./SubsectionForm";
import { deleteDisplay, getSections } from "../../../utils/API";
import {
  LeftCancelButton,
  FolderAddButton,
  EditButton,
  DeleteButton
} from "../../../utils/Utils";
import { InstrumentSectionContext } from "../../../context/InstrumentSectionContext";

const Subsections = props => {
  const section = props.section;
  const displays = section.displays;
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
  // eslint-disable-next-line no-unused-vars
  const [sections, setSections] = useContext(InstrumentSectionContext);

  const fetchSections = async () => {
    setShowForm(false);
    const results = await getSections(
      props.instrument.project_id,
      props.instrument.id
    );
    setSections(results.data);
  };

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
        fetchSections();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const FooterButtons = () => {
    return (
      <Row>
        <LeftCancelButton handleClick={props.handleCancel} />
        <FolderAddButton handleClick={handleNewDisplay} />
      </Row>
    );
  };

  const DisplaysView = () => {
    if (showForm) {
      return (
        <SubsectionForm
          instrument={props.instrument}
          section={section}
          display={display}
          lastDisplayPosition={lPosition}
          handleCancel={handleCancel}
          fetchSections={fetchSections}
        />
      );
    } else {
      return (
        <List
          footer={<FooterButtons />}
          bordered
          dataSource={displays}
          renderItem={display => (
            <List.Item>
              <Col span={2}>{display.position}</Col>
              <Col span={16}>
                <Button
                  type="link"
                  onClick={() => props.showQuestions(display)}
                >
                  {display.title}
                </Button>
              </Col>
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
    }
  };

  return (
    <Fragment>
      <CenteredH3>{section.title}</CenteredH3>
      <DisplaysView />
    </Fragment>
  );
};

export default Subsections;
