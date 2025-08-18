import { Layout, Menu } from "antd";
import type { PublicLayoutIF } from "../../common/types";

const { Header, Content, Sider } = Layout;

export default function PubLayout({
  menus = [],
  TabsContent,
  HeaderContent,
  LogoContent,
  children,
  navigate,
}: PublicLayoutIF) {
  return (
    <Layout
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: "0",
      }}
    >
      <Layout>
        {menus?.length > 0 && (
          <Sider
            theme="light"
            width={200}
            style={{
              height: "100%",
              background: "linear-gradient(to bottom,#fff, #F0F0F0,#E7EDF6)",
            }}
          >
            <div style={{ height: 64 }}>{LogoContent}</div>
            <Menu
              mode="inline"
              style={{
                height: "100%",
                background: "linear-gradient(to bottom,#fff, #F0F0F0,#E7EDF6)",
              }}
              items={menus}
              onSelect={({ key }) => navigate(key)}
            />
          </Sider>
        )}

        <Layout style={{ padding: "0 12px 12px" }}>
          <Header
            style={{
              background:
                "radial-gradient(circle at center, #E7EDF629,#FDFDFD,#fff )",
            }}
          >
            {HeaderContent}
          </Header>
          {TabsContent && (
            <div
              style={{
                borderBottom: "1px solid #e8e8e8",
                margin: "8px 0",
                padding: "0 12px",
              }}
            >
              {TabsContent}
            </div>
          )}
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
