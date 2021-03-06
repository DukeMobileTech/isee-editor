import { Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getSubdomainTranslations } from "../../utils/api/subdomain_translation";
import { getColumnSearchProps } from "../utils/ColumnSearch";
import { TranslationsHeader } from "../utils/TranslationsHeader";
import SubdomainTranslations from "./SubdomainTranslations";

const SubdomainTable = (props) => {
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "10%",
    },
    searchText === ""
      ? {
          title: "Name",
          dataIndex: "name",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("name", searchText, setSearchText),
          render: (text, subdomain) => (
            <span
              dangerouslySetInnerHTML={{
                __html: subdomain.name,
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
      render: (text, subdomain) => {
        const subdomainTranslations = props.translations.filter(
          (trans) => trans.subdomain_id === subdomain.id
        );
        return (
          <SubdomainTranslations
            subdomain={subdomain}
            projectId={props.projectId}
            instrumentId={props.instrumentId}
            translations={subdomainTranslations}
            language={props.language}
            domain={props.domain}
          />
        );
      },
    },
  ];

  return (
    <Table
      bordered
      dataSource={props.subdomains}
      rowKey={(subdomain) => subdomain.id}
      columns={columns}
      size="small"
      pagination={{ defaultPageSize: 25 }}
    />
  );
};

const Translations = (props) => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(null);
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    const fetchSubdomainTranslations = async () => {
      if (language !== null) {
        setLoading(true);
        const result = await getSubdomainTranslations(
          props.projectId,
          props.instrumentId,
          props.domain,
          language
        );
        setTranslations(result.data);
        setLoading(false);
      }
    };
    fetchSubdomainTranslations();
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
      <SubdomainTable
        projectId={props.projectId}
        instrumentId={props.instrumentId}
        domain={props.domain}
        translations={translations}
        language={language}
        subdomains={props.subdomains}
      />
    </Spin>
  );
};

export default Translations;
