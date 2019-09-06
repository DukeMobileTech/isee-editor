import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Icon,
  Spin,
  Table,
  Select,
  Col,
  Typography
} from "antd";
import Highlighter from "react-highlight-words";
import { DRow } from "../../utils/Utils";
import { languages } from "../../utils/Constants";
import { getOptionTranslations } from "../../utils/API";
import OptionTranslations from "./OptionTranslations";

const { Option } = Select;
const { Text } = Typography;

const OptionsTable = props => {
  const options = props.options;
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
      title: "Identifier",
      dataIndex: "identifier",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("identifier")
    },
    {
      title: "Text",
      dataIndex: "text",
      width: "30%",
      editable: true,
      ...getColumnSearchProps("text")
    },
    {
      title: "Translations",
      dataIndex: "translations",
      width: "50%",
      render: (text, option) => {
        const optionTranslations = translations.filter(
          trans => trans.option_id === option.id
        );
        return (
          <OptionTranslations
            option={option}
            translations={optionTranslations}
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
      dataSource={options}
      rowKey={option => option.id}
      columns={columns}
      size="small"
    />
  );
};

const Translations = props => {
  const options = props.options;
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(null);
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      const result = await getOptionTranslations(language);
      setTranslations(result.data);
      setLoading(false);
    };
    fetchOptions();
  }, [language]);

  function handleChange(value) {
    setLanguage(value);
  }

  return (
    <Spin spinning={loading}>
      <DRow>
        <Col span={12}>
          <Button
            type="primary"
            onClick={() => props.setShowTranslations(!props.showTranslations)}
          >
            <Icon type="rollback" />
          </Button>
        </Col>
        <Col span={6}>
          <Text strong>Translation Language</Text>
        </Col>
        <Col span={6}>
          <Select style={{ width: 120 }} onChange={handleChange}>
            {languages.map(language => {
              return (
                <Option
                  key={language.code}
                  name="language"
                  value={language.code}
                >
                  {language.name}
                </Option>
              );
            })}
          </Select>
        </Col>
      </DRow>
      <OptionsTable
        options={options}
        translations={translations}
        language={language}
      />
    </Spin>
  );
};

export default Translations;
