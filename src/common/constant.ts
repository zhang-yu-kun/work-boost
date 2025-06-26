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

export { form_column_map, form_offset_config_map };
