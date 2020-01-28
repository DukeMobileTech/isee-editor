import React, { useState, useEffect } from "react";
import { Spin, Table } from "antd";
import { getInstructionTranslations } from "../../utils/api/instruction_translation";
import InstructionTranslations from "./InstructionTranslations";
import { TranslationsHeader } from "../utils/TranslationsHeader";
import { getColumnSearchProps } from "../utils/ColumnSearch";

const InstructionsTable = props => {
  const instructions = props.instructions;
  const translations = props.translations;
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "15%",
      editable: true,
      ...getColumnSearchProps("title", searchText, setSearchText)
    },
    searchText === ""
      ? {
          title: "Text",
          dataIndex: "text",
          width: "30%",
          editable: true,
          ...getColumnSearchProps("text", searchText, setSearchText),
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
          ...getColumnSearchProps("text", searchText, setSearchText)
        },
    {
      title: "Translations",
      dataIndex: "translations",
      width: "55%",
      sorter: (a, b) => {
        const ita = translations.filter(t => t.instruction_id === a.id);
        const itb = translations.filter(t => t.instruction_id === b.id);
        return ita.length - itb.length;
      },
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
