import React from "react";
import { isDropDown } from "../../utils/Utils";
import { Menu, Dropdown, Icon } from "antd";

export const DropDown = ({ iq }) => {
  if (!isDropDown(iq)) return null;

  const menu = () => {
    return (
      <Menu>
        {iq.options.map((option, index) => {
          return (
            <Menu.Item>
              <span
                dangerouslySetInnerHTML={{
                  __html: option.text.replace("<p>", "").replace("</p>", "")
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
      <p className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        Dropdown <Icon type="down" />
      </p>
    </Dropdown>
  );
};
