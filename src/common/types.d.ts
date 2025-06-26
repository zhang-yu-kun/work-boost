import type { TableProps } from "antd";
import { ComponentType } from "react";

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
  HeaderRender?: JSX.Element;
}

//定义一个接口，用于描述表单的公共属性和方法的类型。
export interface PublicFormIF {
  form: any;
  name: string;
  options: OptionItemIF[];
  onFinish: any;
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

interface FlexOptionItemIF {
  isFlex: true;
  component: JSX.Element | ComponentType<any>;
}

interface DefaultOptionItemIF {
  isFlex?: false | undefined;
  label: string;
  field: string | undefined;
  rules?: [{ required: boolean; message: string }];
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  component: JSX.Element | ComponentType<any>;
}

export type OptionItemIF = FlexOptionItemIF | DefaultOptionItemIF;

//定义搜索组件的公共属性和方法的类型
interface PublicSearchIF {
  form: any;
  options: OptionItemIF[];
  onFinish: any;
  collapse: boolean; //开启search折叠功能 true开启
}
