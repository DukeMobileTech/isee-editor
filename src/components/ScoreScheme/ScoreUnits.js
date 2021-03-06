import { Drawer, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getScoreSchemeUnits } from "../../utils/api/score_scheme";
import { EditButton } from "../../utils/Buttons";
import { customExpandIcon } from "../../utils/Utils";
import EditScoreUnit from "../ScoreUnit/EditScoreUnit";
import { getColumnSearchProps } from "../utils/ColumnSearch";

const ScoreUnits = (props) => {
  const projectId = props.projectId;
  const instrumentId = props.instrumentId;
  const scoreScheme = props.scoreScheme;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [scoreUnits, setScoreUnits] = useState([]);
  const [scoreUnit, setScoreUnit] = useState(null);
  const [editScoreUnit, setEditScoreUnit] = useState(false);

  const fetchScoreUnits = async (status = false, unit = null) => {
    setLoading(true);
    const result = await getScoreSchemeUnits(
      projectId,
      instrumentId,
      scoreScheme.id
    );
    setScoreUnits(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchScoreUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancelEdit = () => {
    setEditScoreUnit(false);
    setScoreUnit(null);
  };

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleEditScoreUnit = (unit) => {
    setScoreUnit(unit);
    setEditScoreUnit(true);
  };

  const columns = [
    {
      title: "Domain",
      dataIndex: "domain_title",
      ...getColumnSearchProps("domain_title", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.domain_title.localeCompare(b.domain_title),
    },
    {
      title: "Domain",
      dataIndex: "domain_name",
      ...getColumnSearchProps("domain_name", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.domain_name.localeCompare(b.domain_name),
    },
    {
      title: "Subdomain",
      dataIndex: "subdomain_title",
      ...getColumnSearchProps("subdomain_title", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.subdomain_title.localeCompare(b.subdomain_title),
    },
    {
      title: "Subdomain",
      dataIndex: "subdomain_name",
      ...getColumnSearchProps("subdomain_name", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.subdomain_name.localeCompare(b.subdomain_name),
    },
    {
      title: "Title",
      dataIndex: "title",
      ...getColumnSearchProps("title", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Weight",
      dataIndex: "weight",
      ...getColumnSearchProps("weight", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.weight - b.weight,
    },
    {
      title: "Score Type",
      dataIndex: "score_type",
      ...getColumnSearchProps("score_type", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.score_type.localeCompare(b.score_type),
    },
    {
      title: "Base Score",
      dataIndex: "base_point_score",
      ...getColumnSearchProps("base_point_score", searchText, setSearchText),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, unit) => (
        <EditButton handleClick={() => handleEditScoreUnit(unit)} />
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={scoreUnits}
        rowKey={(scoreUnit) => scoreUnit.id}
        pagination={{
          defaultPageSize: 100,
          onChange: onPageChange,
          current: currentPage,
        }}
        expandedRowRender={(scoreUnit) => (
          <Table
            dataSource={scoreUnit.option_scores}
            rowKey={(optionScore) => optionScore.id}
            pagination={{
              defaultPageSize: 100,
            }}
          >
            <Table.Column title="Identifier" dataIndex="option_identifier" />
            <Table.Column title="Score" dataIndex="value" />
          </Table>
        )}
        expandIcon={(props) => customExpandIcon(props)}
      />
      <Drawer
        title={scoreUnit && scoreUnit.title}
        placement={"right"}
        width={1080}
        closable={false}
        onClose={onCancelEdit}
        visible={editScoreUnit}
        key="edit"
        destroyOnClose
      >
        <EditScoreUnit
          scoreUnit={scoreUnit}
          projectId={projectId}
          instrumentId={instrumentId}
          scoreSchemeId={scoreScheme.id}
          fetchScoreUnits={fetchScoreUnits}
          visible={editScoreUnit}
          setVisible={setEditScoreUnit}
        />
      </Drawer>
    </Spin>
  );
};

export default ScoreUnits;
