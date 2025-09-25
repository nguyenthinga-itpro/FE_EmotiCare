export const generateColumns = (columnsConfig, toggleEnabled) => {
  return columnsConfig.map((col) => {
    const column = { ...col };

    switch (col.type) {
      case "index":
        column.render = (_, __, index) => index + 1;
        break;

      case "tag":
        column.render = (value) => {
          const color = col.tagColors?.[value] || "default";
          return <Tag color={color}>{value}</Tag>;
        };
        break;

      case "sorter":
        column.sorter = (a, b) => {
          const valA = a[col.dataIndex] || "";
          const valB = b[col.dataIndex] || "";
          if (typeof valA === "string" && typeof valB === "string") {
            return valA.localeCompare(valB);
          }
          if (typeof valA === "number" && typeof valB === "number") {
            return valA - valB;
          }
          return 0;
        };
        break;

      case "switch":
        column.render = (value, record) => {
          // record là object đầy đủ
          return (
            <Switch
              checked={!value}
              onChange={(checked) => toggleEnabled(record, !checked)}
            />
          );
        };
        break;

      default:
        break;
    }

    return column;
  });
};
