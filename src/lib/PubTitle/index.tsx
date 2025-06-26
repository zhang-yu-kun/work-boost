export default function PubTitle({
  text,
  size,
}: {
  text?: string;
  size?: "s" | "l";
}) {
  const map: { s: { box: any; span: any }; l: { box: any; span: any } } = {
    s: {
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
    l: {
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
  };
  if (!text) return null;
  return (
    <div style={map[size || "s"].box} data-testid="pub-title">
      <span style={map[size || "s"].span} data-testid="pub-title-marker"></span>
      {text}
    </div>
  );
}
