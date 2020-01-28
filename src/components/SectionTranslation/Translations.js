import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";

import SectionTranslations from "./SectionTranslations";
import { TranslationsHeader } from "../utils/TranslationsHeader";
import { getColumnSearchProps } from "../utils/ColumnSearch";
import { getSectionTranslations } from "../../utils/api/section_translation";

const SectionTable = props => {
  const sections = props.sections;
  const instrument = props.instrument;
  const translations = props.translations;
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Position",
      dataIndex: "position",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("position", searchText, setSearchText)
    },
    searchText === ""
      ? {
          title: "Title",
          dataIndex: "title",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("title", searchText, setSearchText),
          render: (text, section) => (
            <span
              dangerouslySetInnerHTML={{
                __html: section.title
              }}
            />
          )
        }
      : {
          title: "Title",
          dataIndex: "title",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("title", searchText, setSearchText)
        },
    {
      title: "Translations",
      dataIndex: "translations",
      width: "50%",
      sorter: (a, b) => {
        const qta = translations.filter(t => t.section_id === a.id);
        const qtb = translations.filter(t => t.section_id === b.id);
        return qta.length - qtb.length;
      },
      render: (text, section) => {
        const sectionTranslations = translations.filter(
          trans => trans.section_id === section.id
        );
        return (
          <SectionTranslations
            section={section}
            instrument={instrument}
            translations={sectionTranslations}
            language={props.language}
          />
        );
      }
    }
  ];

  return (
    <Table
      bordered
      dataSource={sections}
      rowKey={section => section.id}
      columns={columns}
      size="small"
      pagination={{ defaultPageSize: 25 }}
    />
  );
};

const Translations = props => {
  const sections = props.sections;
  const instrument = props.instrument;
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(null);
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    const fetchSectionTranslations = async () => {
      setLoading(true);
      const result = await getSectionTranslations(
        instrument.project_id,
        instrument.id,
        language
      );
      setTranslations(result.data);
      setLoading(false);
    };
    fetchSectionTranslations();
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
      <SectionTable
        sections={sections}
        instrument={instrument}
        translations={translations}
        language={language}
      />
    </Spin>
  );
};

export default Translations;
