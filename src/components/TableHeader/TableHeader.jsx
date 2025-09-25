import React from "react";
import { Input } from "antd";
import "./TableHeader.css";

export default function TableHeader({
  searchText,
  setSearchText,
  onAddClick,
  addLabel,
}) {
  const placeholder = addLabel ? `Search ${addLabel.toLowerCase()}` : "Search";

  return (
    <div className="table-header">
      <Input.Search
        placeholder={placeholder}
        allowClear
        className="search-input"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {onAddClick && addLabel && (
        <button className="add-button" onClick={onAddClick}>
          + Add {addLabel}
        </button>
      )}
    </div>
  );
}
