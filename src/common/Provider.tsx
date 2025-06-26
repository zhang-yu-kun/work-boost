import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
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
        },
      }}
      locale={zhCN}
    >
      {children}
    </ConfigProvider>
  );
}
