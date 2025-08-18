import { ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";
import zhCN from "antd/locale/zh_CN";
export default function Provider({
  theme,
  children,
}: {
  theme?: ThemeConfig;
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={
        theme || {
          token: {
            colorPrimary: "#0052d9",
            colorInfo: "#0052d9",
            colorSuccess: "#2ba471",
            colorWarning: "#e37318",
            colorError: "#d54941",
            colorPrimaryHover: "#366ef4",
            colorPrimaryBorderHover: "#366ef4",
            colorPrimaryActive: "#003cab",
            colorPrimaryBorder: "#5885ff",
            colorPrimaryBg: "#f2f3ff",
            colorPrimaryBgHover: "#d9e1ff",
            colorPrimaryTextActive: "#003cab",
            colorPrimaryTextHover: "#366ef4",
          },
          components: {
            Button: {
              borderRadius: 4,
            },
            Layout: {
              /* 这里是你的组件 token */
              headerBg: "#fefefe",
              lightSiderBg: "#f0f2f5",
              bodyBg: "linear-gradient(to right, #F0F0F0,#ECF1F750,#F5F5F5)",
            },
            Form: {
              itemMarginBottom: 0,
            },
          },
        }
      }
      locale={zhCN}
    >
      {children}
    </ConfigProvider>
  );
}
