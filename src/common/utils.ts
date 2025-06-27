export interface TreeNode {
  key: string;
  label: string;
  children?: TreeNode[];
}

export type NodeWithoutChildren = Omit<TreeNode, "children">;

export const findPathBFS = (
  nodes: TreeNode[],
  targetKey: string
): NodeWithoutChildren[] => {
  // 创建节点对象（排除children属性）
  const createNodeObject = (node: TreeNode): NodeWithoutChildren => {
    const { children, ...rest } = node;
    return rest;
  };

  // 初始化队列
  const queue = nodes.map((node) => ({
    node,
    path: [createNodeObject(node)],
  }));

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;

    // 找到目标节点
    if (node.key === targetKey) return path;

    // 处理子节点
    for (const child of node.children ?? []) {
      queue.push({
        node: child,
        path: [...path, createNodeObject(child)],
      });
    }
  }

  return []; // 未找到
};
