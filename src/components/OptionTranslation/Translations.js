import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";

import { getOptionTranslations } from "../../utils/api/option_translation";
import OptionTranslations from "./OptionTranslations";
import { TranslationsHeader } from "../utils/TranslationsHeader";
import { getColumnSearchProps } from "../utils/ColumnSearch";

const OptionsTable = props => {
  const options = props.options;
  const translations = props.translations;
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Identifier",
      dataIndex: "identifier",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("identifier", searchText, setSearchText)
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText),
          render: (text, option) => (
            <span
              dangerouslySetInnerHTML={{
                __html: option.text
              }}
            />
          )
        }
      : {
          title: "Text",
          dataIndex: "text",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText)
        },
    {
      title: "Translations",
      dataIndex: "translations",
      width: "50%",
      sorter: (a, b) => {
        const ota = translations.filter(t => t.option_id === a.id);
        const otb = translations.filter(t => t.option_id === b.id);
        return ota.length - otb.length;
      },
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

  return (
    <Table
      bordered
      dataSource={options}
      rowKey={option => option.id}
      columns={columns}
      size="small"
      pagination={{ defaultPageSize: 25 }}
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
      <TranslationsHeader
        handleClick={() => props.setShowTranslations(!props.showTranslations)}
        handleChange={handleChange}
      />
      <OptionsTable
        options={options}
        translations={translations}
        language={language}
      />
    </Spin>
  );
};

export default Translations;
