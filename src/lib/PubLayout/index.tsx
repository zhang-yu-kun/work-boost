import { Layout, Menu, type MenuProps } from "antd";
import Provider from "../../common/Provider";
import { useEffect, useMemo, useState } from "react";
import type { PublicLayoutIF } from "../../common/types";
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export default function PubLayout({
  menus,
  tabsRouter,
  children,
  navigate,
  matches,
}: PublicLayoutIF) {
  const [siderMenu, setSiderMenu] = useState<MenuItem[]>([]);

  const menusFirst = useMemo(
    () =>
      menus?.map((item: any) => ({
        key: item.key,
        label: item.label,
      })),
    [menus]
  );

  useEffect(() => {
    if (matches.length > 1) {
      const key = matches[1].pathname;
      getSecondMenu(key);
    }
  }, [matches]);

  //获取二级菜单列表
  const getSecondMenu = (key: string) => {
    // 使用可选链查找菜单项
    const siderMenu = menus?.find((item) => item?.key === key);
    if (!siderMenu) {
      setSiderMenu([]);
      return;
    }
    if ("children" in siderMenu) {
      setSiderMenu(siderMenu.children as MenuItem[]);
    } else {
      setSiderMenu([]);
    }
  };
  return (
    <Provider>
      <div>
        <Layout
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            margin: "0",
          }}
        >
          <Header
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="demo-logo" />
            <Menu
              theme="light"
              mode="horizontal"
              items={menusFirst}
              style={{ flex: 1, minWidth: 0, background: "#fefefe" }}
              onSelect={({ key }) => navigate(key)}
            />
          </Header>
          <Layout>
            {siderMenu.length > 0 && (
              <Sider theme="light" width={200}>
                <Menu
                  mode="inline"
                  style={{
                    height: "100%",

                    background:
                      "linear-gradient(to bottom,#fff, #F0F0F0,#E7EDF6)",
                  }}
                  items={siderMenu}
                  onSelect={({ key }) => navigate(key)}
                />
              </Sider>
            )}

            <Layout style={{ padding: "0 24px 24px" }}>
              {tabsRouter}
              <Content>{children}</Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    </Provider>
  );
}
