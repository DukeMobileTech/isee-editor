import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getDisplayTranslations } from "../../utils/api/display_translation";
import { getColumnSearchProps } from "../utils/ColumnSearch";
import { TranslationsHeader } from "../utils/TranslationsHeader";
import DisplayTranslations from "./DisplayTranslations";

const DisplayTable = (props) => {
  const displays = props.displays;
  const instrument = props.instrument;
  const translations = props.translations;
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Position",
      dataIndex: "position",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("position", searchText, setSearchText),
    },
    searchText === ""
      ? {
          title: "Title",
          dataIndex: "title",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("title", searchText, setSearchText),
          render: (text, display) => (
            <span
              dangerouslySetInnerHTML={{
                __html: display.title,
              }}
            />
          ),
        }
      : {
          title: "Title",
          dataIndex: "title",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("title", searchText, setSearchText),
        },
    {
      title: "Translations",
      dataIndex: "translations",
      width: "50%",
      sorter: (a, b) => {
        const qta = translations.filter((t) => t.display_id === a.id);
        const qtb = translations.filter((t) => t.display_id === b.id);
        return qta.length - qtb.length;
      },
      render: (text, display) => {
        const displayTranslations = translations.filter(
          (trans) => trans.display_id === display.id
        );
        return (
          <DisplayTranslations
            display={display}
            instrument={instrument}
            translations={displayTranslations}
            language={props.language}
          />
        );
      },
    },
  ];

  return (
    <Table
      bordered
      dataSource={displays}
      rowKey={(display) => display.id}
      columns={columns}
      size="small"
      pagination={{ defaultPageSize: 25 }}
    />
  );
};

export const Translations = (props) => {
  const displays = props.displays;
  const instrument = props.instrument;
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(null);
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    const fetchDisplayTranslations = async () => {
      setLoading(true);
      const result = await getDisplayTranslations(
        instrument.project_id,
        instrument.id,
        language
      );
      setTranslations(result.data);
      setLoading(false);
    };
    fetchDisplayTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <DisplayTable
        displays={displays}
        instrument={instrument}
        translations={translations}
        language={language}
      />
    </Spin>
  );
};
