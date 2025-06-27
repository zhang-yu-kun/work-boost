import PubLayout from "../lib/PubLayout";

export default function App() {
  const menus = [
    {
      key: "1",
      label: "首页",
    },

    {
      key: "2",
      label: "购物车",
      children: [
        {
          key: "3",
          label: "购物车",
        },
        {
          key: "4",
          label: "我的订单",
        },
      ],
    },
    {
      key: "5",
      label: "我的",
      children: [
        {
          key: "6",
          label: "4-1",
        },
        {
          key: "7",
          label: "4-2",
          children: [
            {
              key: "8",
              label: "关于我们",
            },
            {
              key: "9",
              label: "更多",
            },
          ],
        },
      ],
    },
  ];
  return <PubLayout menus={menus} />;
}
