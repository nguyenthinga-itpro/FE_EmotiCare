import React from "react";
import { Tag, Switch } from "antd";

/**
 * Hàm sinh columns từ config JSON
 * @param {Array} config - JSON config cột
 * @param {Function} toggleCallback - callback cho switch
 * @param {Array} paginatedCategories - danh sách categories từ store (optional)
 */
export const generateColumns = (
  config,
  toggleCallback,
  paginatedCategories = []
) => {
  // Colors xoay vòng
  const colors = ["geekblue", "green", "volcano", "purple", "cyan", "pink"];

  // Map categoryId -> { name, color } nếu có paginatedCategories
  const categoryMap = paginatedCategories.reduce((acc, c, i) => {
    acc[c.id] = {
      name: c.name,
      color: colors[i % colors.length],
    };
    return acc;
  }, {});

  return config.map((col) => {
    const column = {
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.key,
      width: col.width,
    };

    switch (col.type) {
      case "index":
        column.render = (_, __, index) => index + 1;
        break;

      case "switch":
        column.render = (value, record) => (
          <Switch
            checked={value}
            onChange={(checked) =>
              toggleCallback && toggleCallback(record, checked)
            }
          />
        );
        break;

      case "tag":
        // Nếu có paginatedCategories, sử dụng để map các tag
        if (paginatedCategories.length > 0) {
          column.filters = paginatedCategories.map((c) => ({
            text: c.name,
            value: c.id,
          }));
          column.onFilter = (val, record) => record[col.dataIndex] === val;

          column.render = (value) => {
            const cat = categoryMap[value];
            if (!cat) return <Tag>{value}</Tag>;
            return <Tag color={cat.color}>{cat.name}</Tag>;
          };
        } else {
          // Nếu không có paginatedCategories, sử dụng filters trực tiếp từ cột
          column.filters = col.filters?.map((f) => ({ text: f, value: f }));
          column.onFilter = (val, record) => record[col.dataIndex] === val;

          column.render = (value) => (
            <Tag color={col.tagColors?.[value] || "default"}>{value}</Tag>
          );
        }
        break;

      case "filter":
        column.filters = col.filters?.map((f) => ({ text: f, value: f }));
        column.onFilter = (val, record) => record[col.dataIndex] === val;
        break;

      case "sorter":
        column.sorter = (a, b) => {
          const valA = a[col.dataIndex] || "";
          const valB = b[col.dataIndex] || "";
          return valA.toString().localeCompare(valB.toString());
        };
        break;

      default:
        break;
    }

    return column;
  });
};
