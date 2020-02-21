import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";

import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import {
  deleteMultipleSkip,
  getMultipleSkips
} from "../../utils/api/multiple_skip";
import MultipleSkipForm from "./MultipleSkipForm";
import { AddButton } from "../../utils/Buttons";
import IQForm from "./IQForm";
import NewMultipleSkipForm from "./NewMultipleSkipForm";

const { Column } = Table;

const MultipleSkip = props => {
  const instrumentQuestion = props.instrumentQuestion;
  const [multipleSkips, setMultipleSkips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multipleSkip, setMultipleSkip] = useState(null);
  const [create, setCreate] = useState(false);

  useEffect(() => {
    fetchMultipleSkips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMultipleSkips = () => {
    setLoading(true);
    handleCancel();
    getMultipleSkips(
      props.projectId,
      instrumentQuestion.instrument_id,
      instrumentQuestion.id
    ).then(results => {
      setMultipleSkips(results.data);
      setLoading(false);
    });
  };

  const handleMultipleSkipEdit = ms => {
    setMultipleSkip(ms);
  };

  const handleMultipleSkipDelete = ms => {
    deleteMultipleSkip(props.projectId, instrumentQuestion.instrument_id, ms)
      .then(res => {
        fetchMultipleSkips();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleNewMultipleSkip = () => {
    setCreate(true);
  };

  const handleCancel = () => {
    setMultipleSkip(null);
    setCreate(false);
  };

  if (create) {
    return (
      <NewMultipleSkipForm
        instrumentQuestion={instrumentQuestion}
        projectId={props.projectId}
        handleCancel={handleCancel}
        fetchMultipleSkips={fetchMultipleSkips}
      />
    );
  } else if (multipleSkip) {
    return (
      <MultipleSkipForm
        multipleSkip={multipleSkip}
        instrumentQuestion={instrumentQuestion}
        projectId={props.projectId}
        handleCancel={handleCancel}
        fetchMultipleSkips={fetchMultipleSkips}
      />
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Table dataSource={multipleSkips} rowKey={nq => nq.id}>
          <Column title="Option" dataIndex="option_identifier" />
          <Column title="Value Operator" dataIndex="value_operator" />
          <Column title="Value" dataIndex="value" />
          <Column
            title="Question To Skip"
            dataIndex="skip_question_identifier"
          />
          <Column
            title="Actions"
            dataIndex="actions"
            render={(_text, ms) => (
              <EditDeleteBtnGroup
                object={ms}
                message={ms.id}
                handleEdit={handleMultipleSkipEdit}
                handleDelete={handleMultipleSkipDelete}
              />
            )}
          />
        </Table>
        <AddButton handleClick={handleNewMultipleSkip} />
        <IQForm
          instrumentQuestion={instrumentQuestion}
          projectId={props.projectId}
          multipleSkips={multipleSkips}
        />
      </Spin>
    );
  }
};

export default MultipleSkip;
