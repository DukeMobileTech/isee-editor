import React, { useState } from "react";
import { List, Col, Button, Divider, Icon } from "antd";
import { deleteSection, getSections } from "../../utils/API";
import { CenteredH4 } from "../../utils/Styles";
import SectionForm from "./SectionForm";
import Displays from "../Display/Displays";
import { FolderAddButton, EditButton, DeleteButton } from "../../utils/Utils";

const InstrumentSections = props => {
  const instrument = props.instrument;
  const [sections, setSections] = useState(props.sections);
  const [showForm, setShowForm] = useState(false);
  const [showDisplays, setShowDisplays] = useState(false);
  const [section, setSection] = useState(null);

  const handleDeleteSection = section => {
    deleteSection(instrument.project_id, instrument.id, section.id)
      .then(res => {
        fetchUpdatedSections();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleEditSection = section => {
    setSection(section);
    setShowForm(true);
  };

  const handleNewSection = () => {
    setSection(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowDisplays(false);
  };

  const handleOpenSection = section => {
    setSection(section);
    setShowDisplays(true);
  };

  const fetchUpdatedSections = async () => {
    setShowForm(false);
    const results = await getSections(instrument.project_id, instrument.id);
    setSections(results.data);
  };

  const SectionsView = () => {
    if (showForm) {
      return (
        <SectionForm
          instrument={instrument}
          section={section}
          sectionCount={sections.length}
          fetchUpdatedSections={fetchUpdatedSections}
          handleCancel={handleCancel}
        />
      );
    } else if (showDisplays) {
      return (
        <Displays
          section={section}
          instrument={instrument}
          sections={sections}
          handleCancel={handleCancel}
        />
      );
    } else {
      return <SectionList />;
    }
  };

  const SectionList = () => {
    return (
      <List
        header={<CenteredH4>Sections</CenteredH4>}
        footer={<FolderAddButton handleClick={handleNewSection} />}
        bordered
        dataSource={sections}
        renderItem={section => (
          <List.Item>
            <Col span={2}>{section.position}</Col>
            <Col span={16}>{section.title}</Col>
            <Col span={6}>
              <Button onClick={() => handleOpenSection(section)}>
                <Icon type="folder-open" />
              </Button>
              <Divider type="vertical" />
              <EditButton handleClick={() => handleEditSection(section)} />
              <Divider type="vertical" />
              <DeleteButton
                handleClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete ${section.title}?`
                    )
                  )
                    handleDeleteSection(section);
                }}
              />
            </Col>
          </List.Item>
        )}
      />
    );
  };

  return <SectionsView />;
};

export default InstrumentSections;
