import { render, screen } from "@testing-library/react";
import PubTitle from "./index";

describe("PubTitle Component", () => {
  it("should render default style (size: s) and text", () => {
    render(<PubTitle text="Default Title" />);

    const container = screen.getByTestId("pub-title");
    const span = screen.getByTestId("pub-title-marker");

    expect(container).toBeInTheDocument(); // 确认容器存在
    expect(container).toHaveTextContent("Default Title"); // 确认文本内容正确
    expect(container).toHaveStyle({
      fontSize: "18px",
      marginBottom: "10px",
      fontWeight: "700px",
    });

    expect(span).toBeInTheDocument(); // 确认 span 存在
    expect(span).toHaveStyle({
      width: "5px",
      height: "18px",
      marginRight: "10px",
    });
  });

  it('should apply small size styles when size is "s"', () => {
    render(<PubTitle text="Small Title" size="s" />);

    const container = screen.getByTestId("pub-title");
    const span = screen.getByTestId("pub-title-marker");

    expect(container).toBeInTheDocument(); // 确认容器存在
    expect(container).toHaveTextContent("Small Title"); // 确认文本内容正确
    expect(container).toHaveStyle({
      fontSize: "18px",
      marginBottom: "10px",
      fontWeight: "700px",
    });

    expect(span).toBeInTheDocument(); // 确认 span 存在
    expect(span).toHaveStyle({
      width: "5px",
      height: "18px",
      marginRight: "10px",
    });
  });

  it('should apply large size styles when size is "l"', () => {
    render(<PubTitle text="Large Title" size="l" />);

    // 使用 queryByTestId 查找元素，它返回 null 而不是抛出异常
    const container = screen.queryByTestId("pub-title");
    const span = screen.queryByTestId("pub-title-marker");

    expect(container).toBeInTheDocument(); // 确认容器存在
    expect(container).toHaveTextContent("Large Title"); // 确认文本内容正确
    expect(container).toHaveStyle({
      fontSize: "22px",
      marginBottom: "15px",
      fontWeight: "700px",
    });

    expect(span).toBeInTheDocument(); // 确认 span 存在
    expect(span).toHaveStyle({
      width: "8px",
      height: "22px",
      marginRight: "15px",
    });
  });

  it("should not render anything when text is empty or undefined", () => {
    const { container } = render(<PubTitle />);
    expect(container.firstChild).toBeNull();
  });
});
