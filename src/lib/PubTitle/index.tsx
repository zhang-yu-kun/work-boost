type itmeForMap = {
  small: { box: any; span: any };
  middle: { box: any; span: any };
  large: { box: any; span: any };
};

type PublicTitleProps = {
  text?: string;
  size?: "small" | "middle" | "large";
};

const PubTitle: React.FC<PublicTitleProps> = ({ text, size }) => {
  const map: itmeForMap = {
    small: {
      box: {
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 700,
      },
      span: {
        width: 5,
        height: 18,
        marginRight: 10,
        background: "#0052d9",
      },
    },
    middle: {
      box: {
        display: "flex",
        alignItems: "center",
        marginBottom: 15,
        fontSize: 22,
        fontWeight: 700,
      },
      span: {
        width: 8,
        height: 22,
        marginRight: 15,
        background: "#0052d9",
      },
    },
    large: {
      box: {
        display: "flex",
        alignItems: "center",
        marginBottom: 32,
        fontSize: 32,
        fontWeight: 700,
      },
      span: {
        width: 8,
        height: 32,
        marginRight: 22,
        background: "#0052d9",
      },
    },
  };
  if (!text) return null;
  return (
    <div style={map[size || "small"].box} data-testid="pub-title">
      <span
        style={map[size || "small"].span}
        data-testid="pub-title-marker"
      ></span>
      {text}
    </div>
  );
};

export default PubTitle;
