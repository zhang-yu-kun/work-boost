import type { TableProps, MenuProps, FormInstance, ButtonProps } from "antd";
import { ComponentType, ReactNode } from "react";
import type { Location, UIMatch, Path } from "react-router";

// 定义一个接口，用于描述表格的公共属性和方法的类型。
export interface PublicTableIF extends TableProps {
  data: TableProps["dataSource"];
  pageOption: PageIF | false;
  rowOption?: RowIF;
  header?: HeaderIF;
  tableChange?: TableProps["onChange"];
}

export interface PageIF {
  isAuto: boolean; // 是否自动分页
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface RowIF {
  isSelect: boolean; // 是否选中
  rowKey?: string; // 行键值
  rowSelects?: React.Key[];
  setRowSelects?: (rowKey: React.Key[]) => React.Key[]; // 设置选中行键值的方法
  setRowSelectsInfo?: (any) => void; // 设置选中行记录的方法
}

export interface HeaderIF {
  isShow?: boolean; // 是否显示抬头信息
  tableTitle?: string;
  HeaderRender?: {
    type?: ButtonProps["type"];
    htmlType?: ButtonProps["htmlType"];
    text: string;
  }[];
}

//定义一个接口，用于描述表单的公共属性和方法的类型。
export interface PublicFormIF {
  form: FormInstance;
  name: string;
  options: OptionItemIF[];
  onFinish: (value) => void;
  formlayout?: {
    labelCol?: {
      span: number;
    };
    wrapperCol?: {
      span: number;
    };
  };
  column?: 1 | 2 | 3 | 4;
  children?: JSX.Element;
}

interface OptionItemIF {
  component: React.ReactElement;
  isFlex?: boolean;
  label?: string;
  field?: string;
  rules?: { required: boolean; message?: string }[];
  labelCol?: { span: number };
  wrapperCol?: { span: number };
}

// export type OptionItemIF = FlexOptionItemIF | DefaultOptionItemIF;

//定义搜索组件的公共属性和方法的类型
interface PublicSearchIF {
  form: FormInstance;
  options: OptionItemIF[];
  onFinish: any;
  collapse?: boolean; //开启search折叠功能 true开启
}

//定义分步表单的公共属性和方法的类型
export interface PublicStepFormIF {
  form: FormInstance;
  steps: { title: string; options: OptionItemIF[] }[];
  onPrev: () => void;
  onNext: (value) => void;
  formlayout?: {
    labelCol?: {
      span: number;
    };
    wrapperCol?: {
      span: number;
    };
  };
  column?: 1 | 2 | 3 | 4;
}

//布局组件的公共属性和方法的类型
export interface PublicLayoutIF {
  menus: MenuProps["items"];
  bread?: boolean;
  children?: JSX.Element;
}

//
export interface PubLoginFormIF {
  form: FormInstance;
  theme: "techno" | "natural" | "fire";
  signInConent: { label: string; field: string }[];
  signUpContent: { label: string; field: string }[];
  onSubmit: (value) => void;
  onForgetPassword: () => void;
}
