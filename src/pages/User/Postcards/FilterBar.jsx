import { Button, Input, Select, Checkbox } from "antd";

export default function FilterBar({
  searchText,
  setSearchText,
  categoryFilter,
  setCategoryFilter,
  favoriteFilter,
  setFavoriteFilter,
  toggleAll,
  paginatedCategories = [],
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Button type="dashed" onClick={toggleAll}>
        Toggle All Cards
      </Button>

      <Input.Search
        placeholder="Search music..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 200 }}
        allowClear
      />

      <Select
        value={categoryFilter}
        onChange={(value) => setCategoryFilter(value || "")}
        style={{ width: 220 }}
        placeholder="Category"
        allowClear
      >
        <Select.Option value="">All</Select.Option>
        {paginatedCategories.map((c) => (
          <Select.Option key={c.id} value={c.name}>
            {c.name}
          </Select.Option>
        ))}
      </Select>

      {/* ✅ Thêm nút lọc Favorites */}
      <Checkbox
        checked={favoriteFilter}
        onChange={(e) => setFavoriteFilter(e.target.checked)}
      >
        ⭐ Only Favorites
      </Checkbox>
    </div>
  );
}
