import React, { useRef } from "react";
import { Table } from "antd";

export default function InfiniteScrollTable({
  data = [],
  columns = [],
  total = 0,
  rowClassName,
  loading,
  onLoadMore,
}) {
  const scrollRef = useRef(null);
  const hasMore = total ? data.length < total : false;

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 120 && hasMore && !loading) {
      onLoadMore?.();
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{
        height: "60vh",
        overflow: "auto",
        padding: 8,
        borderRadius: 8,
      }}
    >
      <Table
        className="user-table"
        dataSource={data}
        columns={columns}
        pagination={false}
        bordered
        rowClassName={rowClassName}
      />

      <div
        style={{
          textAlign: "center",
          padding: 12,
          color: "#888",
          fontStyle: "italic",
        }}
      >
        {!hasMore ? "No more data" : "Scroll to load more"}
      </div>
    </div>
  );
}
