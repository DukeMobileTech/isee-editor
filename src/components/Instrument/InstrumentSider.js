import React, { useEffect, useState } from "react";
import { Layout, Menu, Icon, Spin } from "antd";
import { getSections } from "../../utils/API";
import { CenteredH4 } from "../../utils/Styles";

const { SubMenu } = Menu;
const { Sider } = Layout;

const InstrumentSider = props => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      const results = await getSections(props.projectId, props.instrumentId);
      setLoading(false);
      setSections(results.data);
      props.mergeSections(results.data);
      const ids = results.data.map(section => `${section.id}`);
      setRootSubmenuKeys(ids);
      setOpenKeys([ids[0]]);
      results.data[0] &&
        results.data[0].displays[0] &&
        props.setDisplayQuestions(results.data[0].displays[0].id);
    };
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisplayClick = items => {
    props.setDisplayQuestions(items.key);
  };

  const onOpenChange = openKeys => {
    const latestOpenKey = openKeys.slice(-1)[0];
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeys);
    } else {
      latestOpenKey ? setOpenKeys([latestOpenKey]) : setOpenKeys([]);
    }
  };

  return (
    <Sider width={250} style={{ background: "#fff" }}>
      <CenteredH4>
        <Icon type="container" />
        Sections
      </CenteredH4>
      <Spin spinning={loading}>
        {sections.map(section => {
          return (
            <Menu
              key={section.title}
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={[`${sections[0].id}`]}
              onClick={handleDisplayClick}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
            >
              <SubMenu
                key={`${section.id}`}
                title={`${section.position}: ${section.title}`}
              >
                {section.displays.map(display => {
                  return (
                    <Menu.Item
                      key={`${display.id}`}
                    >{`${display.position}: ${display.title}`}</Menu.Item>
                  );
                })}
              </SubMenu>
            </Menu>
          );
        })}
      </Spin>
    </Sider>
  );
};

export default InstrumentSider;
