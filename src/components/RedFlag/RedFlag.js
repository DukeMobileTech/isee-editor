import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";

import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import RedFlagForm from "./RedFlagForm";
import { AddButton } from "../../utils/Buttons";
import { deleteRedFlag, getRedFlags } from "../../utils/api/red_flag";

const { Column } = Table;

const RedFlag = props => {
  const instrumentQuestion = props.instrumentQuestion;
  const [redFlags, setRedFlags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [redFlag, setRedFlag] = useState(null);

  useEffect(() => {
    fetchRedFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRedFlags = () => {
    setLoading(true);
    setRedFlag(null);
    getRedFlags(
      props.projectId,
      instrumentQuestion.instrument_id,
      instrumentQuestion.id
    ).then(results => {
      setRedFlags(results.data);
      setLoading(false);
    });
  };

  const handleRedFlagEdit = rf => {
    setRedFlag(rf);
  };

  const handleRedFlagDelete = rf => {
    deleteRedFlag(props.projectId, instrumentQuestion.instrument_id, rf)
      .then(res => {
        fetchRedFlags();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleNewRedFlag = () => {
    setRedFlag({});
  };

  const handleCancel = () => {
    setRedFlag(null);
  };

  if (redFlag) {
    return (
      <RedFlagForm
        redFlag={redFlag}
        instrumentQuestion={instrumentQuestion}
        projectId={props.projectId}
        handleCancel={handleCancel}
        fetchRedFlags={fetchRedFlags}
      />
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Table dataSource={redFlags} rowKey={rf => rf.id}>
          <Column title="Option" dataIndex="option_identifier" />
          <Column
            title="Instruction"
            dataIndex="description"
            render={(text, rf) => (
              <span
                dangerouslySetInnerHTML={{
                  __html: rf.description
                }}
              />
            )}
          />
          <Column
            title="Selected"
            dataIndex="selected"
            render={(text, rf) => String(rf.selected)}
          />
          <Column
            title="Actions"
            dataIndex="actions"
            render={(_text, rf) => (
              <EditDeleteBtnGroup
                object={rf}
                message={rf.id}
                handleEdit={handleRedFlagEdit}
                handleDelete={handleRedFlagDelete}
              />
            )}
          />
        </Table>
        <AddButton handleClick={handleNewRedFlag} />
      </Spin>
    );
  }
};

export default RedFlag;
