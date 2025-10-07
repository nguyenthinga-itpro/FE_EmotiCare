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
  allOpen,
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
        {allOpen ? "Close All Cards" : "Show All Cards"}
      </Button>

      <Input.Search
        className="search-postcard"
        placeholder="Search music..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 170 }}
        allowClear
      />

      <Select
        value={categoryFilter}
        onChange={(value) => setCategoryFilter(value || "")}
        style={{ width: 150 }}
        placeholder="Category"
        allowClear
        dropdownRender={(menu) => (
          <>
            {menu}
            <div style={{ padding: 8, borderTop: "1px solid #eee" }}>
              <Checkbox
                checked={favoriteFilter}
                onChange={(e) => setFavoriteFilter(e.target.checked)}
                className="favorite-check-box"
              >
                Only Favorites
              </Checkbox>
            </div>
          </>
        )}
      >
        <Select.Option value="">All</Select.Option>
        {paginatedCategories.map((c) => (
          <Select.Option key={c.id} value={c.name}>
            {c.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
