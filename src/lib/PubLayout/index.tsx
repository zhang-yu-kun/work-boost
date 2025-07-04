import { Breadcrumb, Layout, Menu, type MenuProps } from "antd";
import Provider from "../../common/Provider";
import { useEffect, useMemo, useState } from "react";
import { findPathBFS, type TreeNode } from "../../common/utils";
import { useLocation, useMatches, useNavigate } from "react-router";
import type { PublicLayoutIF } from "../../common/types";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

type breadlist = { title: string };

export default function PubLayout({ menus, bread, children }: PublicLayoutIF) {
  const [siderMenu, setSiderMenu] = useState<MenuItem[]>([]);
  const [breadList, setBreadList] = useState<breadlist[]>([]);

  //router
  const nevigate = useNavigate();
  const matches = useMatches();
  const location = useLocation();
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

  useEffect(() => {
    const path = location.pathname;
    const allPathToBread = findPathBFS(menus as TreeNode[], path).map(
      (item) => ({
        title: item.label,
      })
    );
    setBreadList(allPathToBread);
  }, [location]);

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
      <Layout>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <div className="demo-logo" />
          <Menu
            theme="light"
            mode="horizontal"
            items={menusFirst}
            style={{ flex: 1, minWidth: 0 }}
            onSelect={({ key }) => nevigate(key)}
          />
        </Header>
        <Layout>
          {siderMenu.length > 0 && (
            <Sider theme="light" width={200}>
              <Menu
                mode="inline"
                style={{ height: "100%", borderRight: 0 }}
                items={siderMenu}
                onSelect={({ key }) => nevigate(key)}
              />
            </Sider>
          )}

          <Layout style={{ padding: "0 24px 24px" }}>
            {bread && (
              <Breadcrumb items={breadList} style={{ margin: "16px 0" }} />
            )}

            <Content>{children}</Content>
          </Layout>
        </Layout>
      </Layout>
    </Provider>
  );
}
