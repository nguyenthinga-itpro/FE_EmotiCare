import React, { useEffect, useState, useMemo } from "react";
import { Row, Button, Select, Input } from "antd";
import CharacterCard from "./CharacterCard";
import VideoCard from "./VideoCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllResources } from "../../../redux/Slices/ResourseSlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import "./More.css";
import { Navigate } from "react-router-dom";

const { Option } = Select;

export default function Resources() {
  const dispatch = useDispatch();
  const { paginatedResources, loading, nextCursor, pageSize } = useSelector(
    (s) => s.resource
  );
  const { paginatedCategories } = useSelector((s) => s.category);

  const [selectedType, setSelectedType] = useState("Articles / Tips & Guides"); // news / youtube
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Load categories & resources lần đầu
  useEffect(() => {
    dispatch(getAllCategories({ pageSize: 100 }));
    dispatch(getAllResources({ pageSize }));
  }, [dispatch, pageSize]);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      dispatch(getAllResources({ pageSize, startAfterId: nextCursor }));
    }
  };

  // Filter & search chỉ áp dụng khi đã chọn type
  const filteredResources = useMemo(() => {
    if (!selectedType) return null; // null nghĩa là chưa filter
    return paginatedResources
      .filter((r) => r.type === selectedType)
      .filter((r) =>
        selectedCategory ? r.categoryId === selectedCategory : true
      )
      .filter((r) =>
        searchText
          ? r.title.toLowerCase().includes(searchText.toLowerCase())
          : true
      );
  }, [paginatedResources, selectedType, selectedCategory, searchText]);

  // Chia theo type để render mặc định
  const newsResources = paginatedResources.filter((r) => r.type === "news");
  const videoResources = paginatedResources.filter((r) => r.type === "youtube");

  return (
    <section className="postcards-sections" id="resources">
      <h1 className="about-lineFAQ">Resources</h1>
      <div className="container">
        {/* Filters */}
        <div className="resources-filters">
          {/* Type selector luôn hoạt động */}
          <Select
            placeholder="Select Type"
            style={{ width: 200, marginRight: 10 }}
            onChange={(value) => setSelectedType(value)}
            value={selectedType}
          >
            <Option value="news">Articles / Tips & Guides</Option>
            <Option value="youtube">Videos</Option>
          </Select>

          {/* Filter + Search luôn hiển thị nhưng vô hiệu khi chưa chọn type */}
          <Select
            placeholder="Filter by Category"
            style={{ width: 200, marginRight: 10 }}
            allowClear
            onChange={(value) => setSelectedCategory(value)}
          >
            {paginatedCategories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>

          <Input
            placeholder="Search by title"
            style={{ width: 200, height: 32 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Render resources */}
        <h3 className="sub-resources-title">Articles / Tips & Guides:</h3>
        <Row gutter={16} className="news-card-container">
          {(filteredResources && selectedType === "news"
            ? filteredResources
            : newsResources
          ).map((res) => (
            <CharacterCard
              key={res.id}
              card={{
                img: res.image,
                title: res.title,
                text: res.description,
                link: res.url,
                id: res.id,
              }}
            />
          ))}
        </Row>

        <h3 className="sub-resources-title">Videos:</h3>
        <Row gutter={16} className="videos-card-container ">
          {(filteredResources && selectedType === "youtube"
            ? filteredResources
            : videoResources
          ).map((res) => (
            <VideoCard
              key={res.id}
              video={{
                src: `https://www.youtube.com/embed/${res.videoId}`,
                title: res.title,
                text: res.description,
                link: res.url,
                id: res.id,
              }}
            />
          ))}
        </Row>

        {/* Load More */}
        {nextCursor && (
          <div className="button-resource-container">
            <Button
              className="button-resource"
              onClick={handleLoadMore}
              loading={loading}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
