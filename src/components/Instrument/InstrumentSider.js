import React, { useEffect, useState, useContext } from "react";
import { Layout, Menu, Icon, Spin } from "antd";
import { getSections } from "../../utils/API";
import { CenteredH4 } from "../../utils/Styles";
import { InstrumentSectionContext } from "../../context/InstrumentSectionContext";

const { SubMenu } = Menu;
const { Sider } = Layout;

const InstrumentSider = props => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useContext(InstrumentSectionContext);
  const [displays, setDisplays] = useState([]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      const results = await getSections(props.projectId, props.instrumentId);
      setLoading(false);
      setSections(results.data);
      const ids = results.data.map(section => `${section.id}`);
      setRootSubmenuKeys(ids);
      setDisplays([].concat.apply([], results.data.map(sec => sec.displays)));
    };
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisplayClick = items => {
    props.showQuestions(
      displays.find(display => display.id === Number(items.key))
    );
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
