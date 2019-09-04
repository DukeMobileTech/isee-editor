import React, { useState } from "react";
import { Table, Row, Col } from "antd";
import { LeftCancelButton, DeleteButton } from "../../utils/Utils";
import { CenteredH4, CenteredH3 } from "../../utils/Styles";
import { deleteOptionScore } from "../../utils/API";

const { Column } = Table;

const ScoreUnit = props => {
  const scoreUnit = props.scoreUnit;
  const [optionScores, setOptionScores] = useState(
    props.scoreUnit.option_scores
  );

  const handleDeleteOptionScore = optionScore => {
    deleteOptionScore(
      props.instrument,
      props.scoreSchemeId,
      scoreUnit,
      optionScore.id
    )
      .then(res => {
        let index = optionScores.indexOf(optionScore);
        optionScores.splice(index, 1);
        setOptionScores([...optionScores]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <CenteredH3>{scoreUnit.title}</CenteredH3>
      <Row>
        <Col span={8}>
          <b>Title</b>
          <span> {scoreUnit.title}</span>
        </Col>
        <Col span={8}>
          <b>Type</b>
          <span> {scoreUnit.score_type}</span>
        </Col>
        <Col span={8}>
          <b>Weight</b>
          <span> {scoreUnit.weight}</span>
        </Col>
      </Row>
      <CenteredH4>Options and their score values</CenteredH4>
      <Table dataSource={optionScores} rowKey={optionScore => optionScore.id}>
        <Column title="Option Identifier" dataIndex="option_identifier" />
        <Column title="Option Score" dataIndex="value" />
        <Column title="Follow-up Question" dataIndex="follow_up_qid" />
        <Column
          title="Action"
          key="action"
          render={(text, optionScore) => (
            <DeleteButton
              handleClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${optionScore.option_identifier}?`
                  )
                )
                  handleDeleteOptionScore(optionScore);
              }}
            />
          )}
        />
      </Table>
      <LeftCancelButton handleClick={props.handleCancel} />
      <br />
    </div>
  );
};

export default ScoreUnit;
