import { List, Spin } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { getAllInstrumentQuestions } from "../../utils/api/instrument_question";
import { isInstruction } from "../../utils/Utils";
import { BoxList } from "../QuestionTypes/BoxList";
import { DropDown } from "../QuestionTypes/Dropdown";
import { Identifier } from "../QuestionTypes/Identifier";
import { Other } from "../QuestionTypes/Other";
import { QuestionText } from "../QuestionTypes/QuestionText";
import { SelectMultiple } from "../QuestionTypes/SelectMultiple";
import { SelectOne } from "../QuestionTypes/SelectOne";
import { Special } from "../QuestionTypes/Special";

const InstrumentQuestions = (props) => {
  const projectId = props.instrument.project_id;
  const instrumentId = props.instrument.id;
  const [loading, setLoading] = useState(false);
  const [instrumentQuestions, setInstrumentQuestions] = useState([]);

  const fetchInstrumentQuestions = async () => {
    setLoading(true);
    const results = await getAllInstrumentQuestions(projectId, instrumentId);
    setInstrumentQuestions(results.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInstrumentQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="infinite-container">
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={() => {}}
        hasMore={!loading}
        useWindow={false}
      >
        <List
          itemLayout="vertical"
          bordered
          dataSource={instrumentQuestions}
          renderItem={(iq) => {
            return (
              <List.Item
                style={{
                  margin: "10px",
                  padding: "10px",
                }}
              >
                <Identifier iq={iq} />
                <QuestionText iq={iq} />
                <SelectOne iq={iq} />
                <SelectMultiple iq={iq} />
                <DropDown iq={iq} />
                <BoxList iq={iq} />
                <Other iq={iq} />

                {!isInstruction(iq) && <br />}

                <Special iq={iq} />
              </List.Item>
            );
          }}
        >
          <Spin spinning={loading} />
        </List>
      </InfiniteScroll>
    </div>
  );
};

export default InstrumentQuestions;
