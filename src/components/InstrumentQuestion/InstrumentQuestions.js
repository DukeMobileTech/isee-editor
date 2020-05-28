import { Spin, List } from "antd";
import React, { useEffect, useState } from "react";

import { getAllInstrumentQuestions } from "../../utils/api/instrument_question";
import { isInstruction } from "../../utils/Utils";
import { SelectOne } from "../QuestionTypes/SelectOne";
import { Special } from "../QuestionTypes/Special";
import { DropDown } from "../QuestionTypes/Dropdown";
import { Other } from "../QuestionTypes/Other";
import { BoxList } from "../QuestionTypes/BoxList";
import { SelectMultiple } from "../QuestionTypes/SelectMultiple";
import { QuestionText } from "../QuestionTypes/QuestionText";
import { Identifier } from "../QuestionTypes/Identifier";
import InfiniteScroll from "react-infinite-scroller";

const InstrumentQuestions = props => {
  const projectId = props.instrument.project_id;
  const instrumentId = props.instrument.id;
  const [loading, setLoading] = useState(false);
  const [instrumentQuestions, setInstrumentQuestions] = useState([]);

  useEffect(() => {
    fetchInstrumentQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInstrumentQuestions = async () => {
    setLoading(true);
    const results = await getAllInstrumentQuestions(projectId, instrumentId);
    setInstrumentQuestions(results.data);
    setLoading(false);
  };

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
          renderItem={iq => {
            return (
              <List.Item
                style={{
                  margin: "10px",
                  padding: "10px"
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
