const form_column_map = {
  1: 24,
  2: 12,
  3: 8,
  4: 6,
};

const form_offset_config_map = {
  1: {
    map: [0],
    length: 1,
  },
  2: {
    map: [12, 0],
    length: 2,
  },
  3: {
    map: [16, 8, 0],
    length: 3,
  },
  4: {
    map: [18, 12, 6, 0],
    length: 4,
  },
};

const btn_color_map = {
  techno: {
    bg: "#0052d9",
    border: "#0052d9",
    text: "#fff",
    hover: "#335386",
  },
  natural: {
    bg: "#2ba471",
    border: "#5ad8a4",
    text: "#fff",
    hover: "#5ad8a4",
  },
  fire: {
    bg: "#ff4b2b",
    border: "#ff4941",
    text: "#fff",
    hover: "#d54941",
  },
  ghost: {
    bg: "transparent",
    border: "#010101",
    text: "#010101",
    hover: "#f3f3f3",
  },
};

export { form_column_map, form_offset_config_map, btn_color_map };
