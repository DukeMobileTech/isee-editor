import React, { useState, Fragment } from "react";
import { CenteredH1 } from "../../utils/Styles";
import { Button, Icon } from "antd";
import ImportInstrumentQuestion from "./ImportInstrumentQuestion";

const NewInstrumentQuestion = props => {
  const [showImport, setShowImport] = useState(false);

  const handleImport = () => {
    setShowImport(true);
  };

  const handleImportCompleted = () => {
    setShowImport(false);
    props.fetchUpdatedDisplay();
  };

  const NewInstrumentQuestionView = () => {
    if (showImport) {
      return (
        <ImportInstrumentQuestion
          projectId={props.projectId}
          display={props.display}
          position={props.position}
          handleImportCompleted={handleImportCompleted}
        />
      );
    } else {
      return <DefaultView />;
    }
  };

  const DefaultView = () => {
    return (
      <Fragment>
        <CenteredH1>New Instrument Question</CenteredH1>
        <Button type="primary" onClick={handleImport}>
          <Icon type="import" />
        </Button>
      </Fragment>
    );
  };

  return <NewInstrumentQuestionView />;
};

export default NewInstrumentQuestion;
