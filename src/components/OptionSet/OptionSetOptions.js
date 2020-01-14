import React from "react";
import {
  DRow,
  AlertErrorMessage,
  getListStyle,
  getItemStyle
} from "../../utils/Utils";
import { Col, Select, Icon } from "antd";
import { Field } from "formik";
import { DeleteButton } from "../../utils/Buttons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const OptionSetOptions = ({
  optionSet,
  values,
  setFieldValue,
  instructions,
  handleDeleteOption,
  resetForm
}) => {
  const onDragEnd = result => {
    const copy = [...optionSet.option_in_option_sets];
    copy.splice(
      result.destination.index,
      0,
      copy.splice(result.source.index, 1)[0]
    );
    copy.forEach((oios, index) => {
      oios.number_in_question = index + 1;
    });
    resetForm({
      id: values.id,
      title: values.title,
      instruction_id: values.instruction_id,
      special: values.special,
      option_in_option_sets: copy
    });
  };

  return (
    <div style={{ marginBottom: "5px" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="folder-questions">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {values.option_in_option_sets &&
                values.option_in_option_sets.map((oios, index) => (
                  <Draggable
                    key={oios.option_id}
                    draggableId={oios.option_id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <DRow
                          key={oios.option_id}
                          gutter={16}
                          style={{ marginBottom: 8 }}
                        >
                          <Col span={4}>
                            <Icon type="drag" />
                            {index + 1}
                          </Col>
                          <Col span={6}>
                            {oios.option && (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: oios.option.text
                                }}
                              />
                            )}
                          </Col>
                          <Col span={6}>
                            <Field
                              name={`option_in_option_sets.${index}.instruction_id`}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  showSearch
                                  allowClear
                                  optionFilterProp="children"
                                  onChange={value =>
                                    setFieldValue(
                                      `option_in_option_sets.${index}.instruction_id`,
                                      value
                                    )
                                  }
                                  filterOption={(input, option) =>
                                    option.props.children &&
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  <Select.Option value=""></Select.Option>
                                  {instructions.map(instruction => {
                                    return (
                                      <Select.Option
                                        key={instruction.id}
                                        name={`option_in_option_sets.${index}.instruction_id`}
                                        value={instruction.id}
                                      >
                                        {instruction.title.replace(
                                          /<[^>]+>/g,
                                          ""
                                        )}
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              )}
                            />
                          </Col>
                          <Col span={4}>
                            <Field
                              name={`option_in_option_sets.${index}.allow_text_entry`}
                              type="checkbox"
                              checked={
                                values.option_in_option_sets[index]
                                  .allow_text_entry
                              }
                            />
                            <AlertErrorMessage
                              name={`option_in_option_sets.${index}.allow_text_entry`}
                              type="error"
                            />
                          </Col>
                          <Col span={4}>
                            <DeleteButton
                              handleClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to remove ${oios.option &&
                                      oios.option.text} from the set?`
                                  )
                                )
                                  handleDeleteOption(oios, values, resetForm);
                              }}
                            />
                          </Col>
                        </DRow>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default OptionSetOptions;