import PubLayout from "../lib/PubLayout";
import { ItemA, ItemB, ItemC, ItemD, ItemE, ItemF } from "./Item";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router";
import Login from "./Login";

const mockMenus = [
  // 场景1: 有子菜单的菜单项
  {
    key: "/dashboard",
    label: "控制台",
    children: [
      { key: "/dashboard/itemA", label: "模块A" },
      { key: "/dashboard/itemB", label: "模块B" },
    ],
  },
  // 场景2: 多级嵌套菜单
  {
    key: "/settings",
    label: "设置",
    children: [
      {
        key: "/user",
        label: "用户",
        children: [
          { key: "/settings/user/itemC", label: "模块C" },
          { key: "/settings/user/itemD", label: "模块D" },
        ],
      },
      {
        key: "/settings/itemE",
        label: "模块E",
      },
    ],
  },
  // 场景3: 无子菜单的菜单项
  {
    key: "/help",
    label: "帮助",
  },
];

const router = createBrowserRouter([
  { index: true, element: <Navigate to="/login" replace /> },
  {
    path: "/",
    element: (
      <PubLayout menus={mockMenus} bread={true}>
        <Outlet />
      </PubLayout>
    ),
    children: [
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <Navigate to="itemA" replace />,
          },
          {
            path: "itemA",
            element: <ItemA />,
          },
          {
            path: "itemB",
            element: <ItemB />,
          },
        ],
      },
      {
        path: "settings",
        children: [
          {
            index: true,
            element: <Navigate to="user" replace />,
          },
          {
            path: "user",
            children: [
              {
                index: true,
                element: <Navigate to="itemC" replace />,
              },
              { path: "itemC", element: <ItemC /> },
              { path: "itemD", element: <ItemD /> },
            ],
          },
          {
            path: "itemE",
            element: <ItemE />,
          },
        ],
      },
      {
        path: "help",
        element: <ItemF />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
