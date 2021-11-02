let distinct = prop => arr =>
    Array.from(
      arr.reduce((acc, item) => (
        item && item[prop] && acc.set(item[prop], item),
        acc
      ), // using map (preserves ordering)
      new Map()
    ).values()
  );