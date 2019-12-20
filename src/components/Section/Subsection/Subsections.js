import { Button, Col, Divider, List, Row } from "antd";
import {
  DeleteButton,
  EditButton,
  FolderAddButton,
  LeftCancelButton
} from "../../../utils/Buttons";
import React, { Fragment, useContext, useState } from "react";

import { CenteredH3 } from "../../../utils/Styles";
import { InstrumentSectionContext } from "../../../context/InstrumentSectionContext";
import SubsectionForm from "./SubsectionForm";
import { deleteDisplay } from "../../../utils/api/display";
import { getSections } from "../../../utils/api/section";

const Subsections = props => {
  const section = props.section;
  const displays = section.displays;
  const [showForm, setShowForm] = useState(false);
  const [display, setDisplay] = useState(null);

  let lPosition = 0;
  if (section.displays.length > 0) {
    lPosition = section.displays.slice(-1)[0].position;
  } else if (props.sections.length > 1) {
    const index = props.sections.indexOf(section);
    let prevSec = props.sections.slice(0, index).reverse();
    for (let i = 0; i < prevSec.length; i++) {
      if (prevSec[i].displays.length > 0) {
        lPosition = prevSec[i].displays.slice(-1)[0].position;
        break;
      }
    }
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
