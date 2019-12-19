import { Row, Table, Typography, Icon, Input, Button } from "antd";
import React, { useState, Fragment, useContext } from "react";
import {
  getOptionSet,
  deleteOptionSet,
  copyOptionSet
} from "../../utils/api/option_set";

import {
  EditButton,
  DeleteButton,
  TranslationAddButtons
} from "../../utils/Utils";
import Highlighter from "react-highlight-words";
import OptionSetTranslations from "./OptionSetTranslations";
import { OptionSetContext } from "../../context/OptionSetContext";
import { InstructionContext } from "../../context/InstructionContext";
import OptionSetForm from "./OptionSetForm";

const OptionSets = () => {
  const [optionSets, setOptionSets] = useContext(OptionSetContext);
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [optionSet, setOptionSet] = useState(null);
  const [showTranslations, setShowTranslations] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [instructions, setInstructions] = useContext(InstructionContext);

  const fetchOptionSet = async id => {
    if (id) {
      const result = await getOptionSet(id);
      let index = optionSets.indexOf(optionSet);
      optionSets.splice(index, 1, result.data);
      setOptionSets([...optionSets]);
    }
    setVisible(false);
  };

  const handleOptionSetForm = os => {
    setOptionSet(os);
    setVisible(true);
  };

  const handleDeleteOptionSet = os => {
    deleteOptionSet(os.id).then(res => {
      let index = optionSets.indexOf(os);
      optionSets.splice(index, 1);
      setOptionSets([...optionSets]);
    });
  };

  const handleShowTranslations = os => {
    setOptionSet(os);
    setShowTranslations(true);
  };

  const handleTranslationsClick = () => {};

  const handleCopyOptionSet = os => {
    copyOptionSet(os.id).then(response => {
      optionSets.unshift(response.data);
      setOptionSets([...optionSets]);
    });
  };

  const optionsToString = array => {
    const searchAttributes = array.map(
      oios => `${oios.option.identifier} ${oios.option.text}`
    );
    return searchAttributes.join(" ");
  };

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
    onFilter: (value, record) => {
      if (dataIndex === "option_in_option_sets") {
        return optionsToString(record[dataIndex])
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else if (dataIndex === "instruction_id") {
        if (record[dataIndex] === null) {
          return false;
        } else {
          return instruction(record[dataIndex])
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      } else {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    )
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  const instruction = id => {
    const inst = instructions.find(ins => ins.id === Number(id));
    return inst ? inst.text : "";
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "15%",
      ...getColumnSearchProps("title")
    },
    searchText === ""
      ? {
          title: "Instructions",
          dataIndex: "instruction_id",
          width: "20%",
          ...getColumnSearchProps("instruction_id"),
          render: (text, os) => {
            return (
              <span
                dangerouslySetInnerHTML={{
                  __html: instruction(os.instruction_id)
                }}
              />
            );
          }
        }
      : {
          title: "Instructions",
          dataIndex: "instruction_id",
          width: "25%",
          ...getColumnSearchProps("instruction_id"),
          render: (text, os) => {
            return <span>{instruction(os.instruction_id)}</span>;
          }
        },
    {
      title: "Options",
      dataIndex: "option_in_option_sets",
      width: "40%",
      ...getColumnSearchProps("option_in_option_sets"),
      render: (text, os) => (
        <Fragment>
          {os.option_in_option_sets.map(oios => {
            return (
              <span key={oios.id}>
                <Typography.Text strong>
                  {`${oios.number_in_question})`}
                </Typography.Text>
                <Typography.Text code>
                  {oios.option && oios.option.text}
                </Typography.Text>
              </span>
            );
          })}
        </Fragment>
      )
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "25%",
      render: (text, record) => (
        <Row gutter={8} type="flex" justify="space-around" align="middle">
          <EditButton handleClick={() => handleOptionSetForm(record)} />
          <Button
            type="primary"
            title="Translations"
            onClick={() => handleShowTranslations(record)}
          >
            <Icon type="global" />
          </Button>
          <Button
            type="primary"
            title="Copy"
            onClick={() => handleCopyOptionSet(record)}
          >
            <Icon type="copy" />
          </Button>
          <DeleteButton
            handleClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete ${record.title}?`
                )
              )
                handleDeleteOptionSet(record);
            }}
          />
        </Row>
      )
    }
  ];

  if (showTranslations) {
    return (
      <OptionSetTranslations
        optionSet={optionSet}
        setShowTranslations={setShowTranslations}
        showTranslations={showTranslations}
      />
    );
  } else if (visible) {
    return (
      <OptionSetForm
        visible={visible}
        optionSet={optionSet}
        setVisible={setVisible}
        fetchOptionSet={fetchOptionSet}
      />
    );
  } else {
    return (
      <Fragment>
        <TranslationAddButtons
          handleTranslationClick={handleTranslationsClick}
          handleAddClick={() =>
            handleOptionSetForm({ option_in_option_sets: [] })
          }
        />
        <Table columns={columns} dataSource={optionSets} rowKey={os => os.id} />
      </Fragment>
    );
  }
};

export default OptionSets;
