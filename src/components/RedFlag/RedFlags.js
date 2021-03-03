import React, { useState, useEffect, Fragment } from "react";
import { Button, Spin, Table, Row, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { getColumnSearchProps } from "../utils/ColumnSearch";
import RedFlagForm from "./RedFlagForm";
import { EditDeleteBtnGroup } from "../utils/EditDeleteBtnGroup";
import { deleteRedFlag, getRedFlags } from "../../utils/api/red_flag";

const RedFlags = props => {
  const projectId = props.projectId;
  const instrumentId = props.instrumentId;
  const scoreScheme = props.scoreScheme;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [redFlags, setRedFlags] = useState([]);
  const [redFlag, setRedFlag] = useState(null);
  const [visible, setVisible] = useState(false);

  const columns = [
    {
      title: "Section",
      dataIndex: "section_title",
      ...getColumnSearchProps("section_title", searchText, setSearchText)
    },
    {
      title: "Display",
      dataIndex: "display_title",
      ...getColumnSearchProps("display_title", searchText, setSearchText)
    },
    {
      title: "QID",
      dataIndex: "iq_identifier",
      ...getColumnSearchProps("iq_identifier", searchText, setSearchText),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.iq_identifier.localeCompare(b.iq_identifier)
    },
    searchText === ""
      ? {
          title: "Question Text",
          dataIndex: "iq_text",
          ...getColumnSearchProps("iq_text", searchText, setSearchText),
          render: (text, redFlag) => (
            <span
              dangerouslySetInnerHTML={{
                __html: redFlag.iq_text
              }}
            />
          )
        }
      : {
          title: "Question Text",
          dataIndex: "iq_text",
          ...getColumnSearchProps("iq_text", searchText, setSearchText),
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.iq_text.localeCompare(b.iq_text)
        },
    searchText === ""
      ? {
          title: "Option",
          dataIndex: "option_text",
          ...getColumnSearchProps("option_text", searchText, setSearchText),
          render: (text, redFlag) => (
            <span
              dangerouslySetInnerHTML={{
                __html: redFlag.option_text
              }}
            />
          )
        }
      : {
          title: "Option",
          dataIndex: "option_text",
          ...getColumnSearchProps("option_text", searchText, setSearchText),
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.option_text.localeCompare(b.option_text)
        },
    searchText === ""
      ? {
          title: "Description",
          dataIndex: "description",
          ...getColumnSearchProps("description", searchText, setSearchText),
          render: (text, redFlag) => (
            <span
              dangerouslySetInnerHTML={{
                __html: redFlag.description
              }}
            />
          )
        }
      : {
          title: "Description",
          dataIndex: "description",
          ...getColumnSearchProps("description", searchText, setSearchText),
          sortDirections: ["descend", "ascend"],
          sorter: (a, b) => a.description.localeCompare(b.description)
        },
    {
      title: "Selected",
      dataIndex: "selected",
      render: (text, redFlag) => String(redFlag.selected)
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_text, rf) => (
        <EditDeleteBtnGroup
          object={rf}
          message={rf.id}
          handleEdit={handleRedFlagEdit}
          handleDelete={handleRedFlagDelete}
        />
      )
    }
  ];

  useEffect(() => {
    fetchRedFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRedFlags = async () => {
    setLoading(true);
    const result = await getRedFlags(projectId, instrumentId, scoreScheme.id);
    setRedFlags(result.data);
    setLoading(false);
    handleCancel();
  };

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const onNewRedFlag = () => {
    setVisible(true);
  };

  const handleRedFlagEdit = rf => {
    setRedFlag(rf);
    setVisible(true);
  };

  const handleRedFlagDelete = rf => {
    deleteRedFlag(projectId, instrumentId, scoreScheme.id, rf)
      .then(res => {
        fetchRedFlags();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    setVisible(false);
    setRedFlag(null);
  };

  return (
    <Spin spinning={loading}>
      <Fragment>
        <Row>
          <Button
            title="New Red Flag"
            style={{ float: "right", margin: "5px" }}
            type="primary"
            onClick={onNewRedFlag}
          >
            <PlusOutlined />
          </Button>
        </Row>
        <Table
          columns={columns}
          dataSource={redFlags}
          rowKey={redFlag => redFlag.id}
          pagination={{
            defaultPageSize: 100,
            onChange: onPageChange,
            current: currentPage
          }}
        />
        <Drawer
          title={redFlag === null ? "New Red Flag" : redFlag.iq_identifier}
          placement={"right"}
          width={720}
          closable={false}
          onClose={handleCancel}
          visible={visible}
          key={"right"}
          destroyOnClose={true}
        >
          <RedFlagForm
            redFlag={redFlag}
            projectId={projectId}
            instrumentId={instrumentId}
            scoreScheme={scoreScheme}
            handleCancel={handleCancel}
            fetchRedFlags={fetchRedFlags}
          />
        </Drawer>
      </Fragment>
    </Spin>
  );
};

export default RedFlags;
