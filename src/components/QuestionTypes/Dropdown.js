import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import React from "react";
import { isDropDown } from "../../utils/Utils";

export const DropDown = ({ iq }) => {
  if (!isDropDown(iq)) return null;

  const menu = () => {
    return (
      <Menu>
        {iq.options.map((option, index) => {
          return (
            <Menu.Item key={option.identifier}>
              <span
                dangerouslySetInnerHTML={{
                  __html: option.text.replace("<p>", "").replace("</p>", ""),
                }}
              />
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={menu}>
      <p className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        Dropdown <DownOutlined />
      </p>
    </Dropdown>
  );
};
