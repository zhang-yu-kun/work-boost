import { Breadcrumb, Layout, Menu, type MenuProps } from "antd";
import Provider from "../../common/Provider";
import { useEffect, useMemo, useState } from "react";
import { findPathBFS, type TreeNode } from "../../common/utils";
import type { PublicLayoutIF } from "../../common/types";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

type breadlist = { title: string };

export default function PubLayout({ menus, goTo }: PublicLayoutIF) {
  const [item2, setItem2] = useState<MenuItem[]>([]);
  const [currentNode, setCurrentNode] = useState("");
  const [breadList, setBreadList] = useState<breadlist[]>([]);

  const menusFirst = useMemo(
    () =>
      menus?.map((item: any) => ({
        key: item.key,
        label: item.label,
      })),
    [menus]
  );

  //面包屑导航路径变化时，更新当前节点信息
  useEffect(() => {
    if (currentNode) {
      const path = findPathBFS(menus as TreeNode[], currentNode);
      const n_path: breadlist[] = path.map((item) => ({ title: item.label }));
      goTo?.(n_path);
      setBreadList(n_path || []);
    }
  }, [currentNode]);

  //获取二级菜单列表
  const getSecondMenu = (key: string) => {
    // 使用可选链查找菜单项
    const item2 = menus?.find((item) => item?.key === key);

    if (!item2) {
      setItem2([]);
      return;
    }
    if ("children" in item2) {
      setItem2(item2.children as MenuItem[]);
      const endKey = getListEndNode(item2 as unknown as TreeNode[], key);
      setCurrentNode(endKey);
    } else {
      setItem2([]);
    }
  };

  //递归找到fist下最后一个节点
  const getListEndNode = (list: TreeNode[], key: string): string => {
    // 添加类型保护，确保访问前检查类型
    if (
      Array.isArray(list) &&
      list.length > 0 &&
      typeof list[0] === "object" &&
      list[0] !== null
    ) {
      const firstItem = list[0];

      // 检查是否有children属性
      if ("children" in firstItem && Array.isArray(firstItem.children)) {
        // 保持您的原始递归逻辑
        return getListEndNode(
          firstItem.children as unknown as TreeNode[],
          firstItem.key
        );
      }
    }

    // 如果任何条件不满足，返回原始key
    return key;
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
            onSelect={({ key }) => {
              getSecondMenu(key);
              setCurrentNode(key);
            }}
          />
        </Header>
        <Layout>
          {item2.length > 0 && (
            <Sider theme="light" width={200}>
              <Menu
                mode="inline"
                style={{ height: "100%", borderRight: 0 }}
                items={item2}
                onSelect={({ key }) => setCurrentNode(key)}
              />
            </Sider>
          )}

          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb items={breadList} style={{ margin: "16px 0" }} />
            <Content></Content>
          </Layout>
        </Layout>
      </Layout>
    </Provider>
  );
}
