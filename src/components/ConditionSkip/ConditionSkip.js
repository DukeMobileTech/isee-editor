import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";

import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import { AddButton } from "../../utils/Buttons";
import ConditionSkipForm from "./ConditionSkipForm";
import {
  getConditionSkips,
  deleteConditionSkip
} from "../../utils/api/condition_skip";

const { Column } = Table;

const ConditionSkip = props => {
  const instrumentQuestion = props.instrumentQuestion;
  const [conditionSkips, setConditionSkips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conditionSkip, setConditionSkip] = useState(null);

  useEffect(() => {
    fetchConditionSkips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConditionSkips = () => {
    setLoading(true);
    setConditionSkip(null);
    getConditionSkips(
      props.projectId,
      instrumentQuestion.instrument_id,
      instrumentQuestion.id
    ).then(results => {
      setConditionSkips(results.data);
      setLoading(false);
    });
  };

  const handleConditionSkipEdit = nq => {
    setConditionSkip(nq);
  };

  const handleConditionSkipDelete = nq => {
    deleteConditionSkip(props.projectId, instrumentQuestion.instrument_id, nq)
      .then(res => {
        fetchConditionSkips();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleNewConditionSkip = () => {
    setConditionSkip({});
  };

  const handleCancel = () => {
    setConditionSkip(null);
  };

  if (conditionSkip) {
    return (
      <ConditionSkipForm
        conditionSkip={conditionSkip}
        instrumentQuestion={instrumentQuestion}
        projectId={props.projectId}
        handleCancel={handleCancel}
        fetchConditionSkips={fetchConditionSkips}
        display={props.display}
      />
    );
  } else {
    return (
      <Spin spinning={loading}>
        <Table dataSource={conditionSkips} rowKey={nq => nq.id}>
          <Column
            title="Question Identifiers"
            dataIndex="question_identifiers"
          />
          <Column title="Option IDs" dataIndex="option_ids" />
          <Column title="Value Operators" dataIndex="value_operators" />
          <Column title="Values" dataIndex="values" />
          <Column title="Next Question" dataIndex="next_question_identifier" />
          <Column
            title="Actions"
            dataIndex="actions"
            render={(_text, nq) => (
              <EditDeleteBtnGroup
                object={nq}
                message={nq.id}
                handleEdit={handleConditionSkipEdit}
                handleDelete={handleConditionSkipDelete}
              />
            )}
          />
        </Table>
        <AddButton handleClick={handleNewConditionSkip} />
      </Spin>
    );
  }
};

export default ConditionSkip;
