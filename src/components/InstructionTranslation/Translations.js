import React, { useState, useEffect } from "react";
import { Spin, Button, Icon, Table, Input } from "antd";
import { getInstructionTranslations } from "../../utils/api/instruction_translation";
import Highlighter from "react-highlight-words";
import InstructionTranslations from "./InstructionTranslations";
import { TranslationsHeader } from "../utils/TranslationsHeader";

const InstructionsTable = props => {
  const instructions = props.instructions;
  const translations = props.translations;
  const [searchText, setSearchText] = useState("");

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    )
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "15%",
      editable: true,
      ...getColumnSearchProps("title")
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("text"),
          render: (text, instruction) => (
            <span
              dangerouslySetInnerHTML={{
                __html: instruction.text
              }}
            />
          )
        }
      : {
          title: "Text",
          dataIndex: "text",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("text")
        },
    {
      title: "Translations",
      dataIndex: "translations",
      width: "55%",
      render: (text, instruction) => {
        const instructionTranslations = translations.filter(
          translation => translation.instruction_id === instruction.id
        );
        return (
          <InstructionTranslations
            instruction={instruction}
            translations={instructionTranslations}
            language={props.language}
          />
        );
      }
    }
  ];

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  return (
    <Table
      bordered
      dataSource={instructions}
      rowKey={instruction => instruction.id}
      columns={columns}
      size="small"
      pagination={{
        defaultPageSize: 25
      }}
    />
  );
};

const Translations = props => {
  const instructions = props.instructions;
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(null);
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    const fetchInstructionTranslations = async () => {
      setLoading(true);
      const result = await getInstructionTranslations(language);
      setTranslations(result.data);
      setLoading(false);
    };
    fetchInstructionTranslations();
  }, [language]);

  const handleChange = value => {
    setLanguage(value);
  };

  return (
    <Spin spinning={loading}>
      <TranslationsHeader
        handleClick={() => props.setShowTranslations(!props.showTranslations)}
        handleChange={handleChange}
      />
      <InstructionsTable
        instructions={instructions}
        translations={translations}
        language={language}
      />
    </Spin>
  );
};

export default Translations;
