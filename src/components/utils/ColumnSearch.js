import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Row } from "antd";
import React from "react";
import Highlighter from "react-highlight-words";

export const getColumnSearchProps = (dataIndex, searchText, setSearchText) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => {
    const handleSearch = (selectedKeys, confirm) => {
      confirm();
      setSearchText(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText("");
    };

    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Row type="flex" justify="space-around" align="middle">
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            icon="undo"
            size="small"
          >
            Reset
          </Button>
        </Row>
      </div>
    );
  },
  filterIcon: (filtered) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  render: (text) => (
    <Highlighter
      highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
      searchWords={[searchText]}
      autoEscape
      textToHighlight={text ? text.toString() : ""}
    />
  ),
});
