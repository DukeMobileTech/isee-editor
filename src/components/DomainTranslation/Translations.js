import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getDomainTranslations } from "../../utils/api/domain_translation";
import { getColumnSearchProps } from "../utils/ColumnSearch";
import { TranslationsHeader } from "../utils/TranslationsHeader";
import DomainTranslations from "./DomainTranslations";

const DomainTable = (props) => {
  const domains = props.domains;
  const scoreScheme = props.scoreScheme;
  const projectId = props.projectId;
  const translations = props.translations;
  const [searchText, setSearchText] = useState("");
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "10%",
      editable: true,
      ...getColumnSearchProps("title", searchText, setSearchText),
    },
    searchText === ""
      ? {
          title: "Name",
          dataIndex: "name",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("name", searchText, setSearchText),
          render: (text, domain) => (
            <span
              dangerouslySetInnerHTML={{
                __html: domain.name,
              }}
            />
          ),
        }
      : {
          title: "Name",
          dataIndex: "name",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("name", searchText, setSearchText),
        },
    {
      title: "Translations",
      dataIndex: "translations",
      width: "60%",
      render: (text, domain) => {
        const domainTranslations = translations.filter(
          (trans) => trans.domain_id === domain.id
        );
        return (
          <DomainTranslations
            domain={domain}
            projectId={projectId}
            scoreScheme={scoreScheme}
            translations={domainTranslations}
            language={props.language}
          />
        );
      },
    },
  ];

  return (
    <Table
      bordered
      dataSource={domains}
      rowKey={(domain) => domain.id}
      columns={columns}
      size="small"
      pagination={{ defaultPageSize: 25 }}
    />
  );
};

const Translations = (props) => {
  const projectId = props.projectId;
  const domains = props.domains;
  const scoreScheme = props.scoreScheme;
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(null);
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    const fetchDomainTranslations = async () => {
      if (language !== null) {
        setLoading(true);
        const result = await getDomainTranslations(
          projectId,
          scoreScheme,
          language
        );
        setTranslations(result.data);
        setLoading(false);
      }
    };
    fetchDomainTranslations();
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
      <DomainTable
        domains={domains}
        scoreScheme={scoreScheme}
        projectId={projectId}
        translations={translations}
        language={language}
      />
    </Spin>
  );
};

export default Translations;
