import { findPathBFS, TreeNode, NodeWithoutChildren } from "../common/utils";

describe("findPathBFS", () => {
  // 测试树结构
  const testTree: TreeNode[] = [
    {
      key: "1",
      label: "Root 1",
      children: [
        {
          key: "1-1",
          label: "Child 1-1",
          children: [
            { key: "1-1-1", label: "Grandchild 1-1-1" },
            { key: "target", label: "TARGET" }, // 测试目标节点
          ],
        },
        { key: "1-2", label: "Child 1-2" },
      ],
    },
    {
      key: "2",
      label: "Root 2",
      children: [
        { key: "2-1", label: "Child 2-1" },
        { key: "2-2", label: "Child 2-2" },
      ],
    },
  ];

  // 测试相同 key 的树结构
  const duplicateKeyTree: TreeNode[] = [
    {
      key: "A",
      label: "Level 1",
      children: [
        { key: "duplicate", label: "Should NOT find this" }, // 深层节点
      ],
    },
    { key: "duplicate", label: "Should find this" }, // 浅层节点 (BFS 优先找到)
  ];

  // 1. 找到目标节点（多层级）
  it("应返回从根到目标节点的路径", () => {
    const result = findPathBFS(testTree, "target");
    const expected: NodeWithoutChildren[] = [
      { key: "1", label: "Root 1" },
      { key: "1-1", label: "Child 1-1" },
      { key: "target", label: "TARGET" },
    ];
    expect(result).toEqual(expected);
  });

  // 2. 目标节点在根层级
  it("应找到根节点", () => {
    const result = findPathBFS(testTree, "2");
    expect(result).toEqual([{ key: "2", label: "Root 2" }]);
  });

  // 3. 目标不存在
  it("未找到时应返回空数组", () => {
    const result = findPathBFS(testTree, "non-existent");
    expect(result).toEqual([]);
  });

  // 4. 空树测试
  it("处理空树", () => {
    const result = findPathBFS([], "any");
    expect(result).toEqual([]);
  });

  // 5. 测试 BFS 特性（优先返回浅层节点）
  it("当存在重复 key 时应优先返回浅层节点", () => {
    const result = findPathBFS(duplicateKeyTree, "duplicate");
    expect(result).toEqual([{ key: "duplicate", label: "Should find this" }]);
  });

  // 6. 验证路径节点不包含 children
  it("路径节点不应包含 children 属性", () => {
    const result = findPathBFS(testTree, "1-1");
    result.forEach((node) => {
      expect(node).not.toHaveProperty("children");
      expect(node).toEqual(
        expect.objectContaining({
          key: expect.any(String),
          label: expect.any(String),
        })
      );
    });
  });

  // 7. 目标在第二个子树中
  it("应在第二个根节点的子树中找到节点", () => {
    const result = findPathBFS(testTree, "2-1");
    const expected: NodeWithoutChildren[] = [
      { key: "2", label: "Root 2" },
      { key: "2-1", label: "Child 2-1" },
    ];
    expect(result).toEqual(expected);
  });
});
