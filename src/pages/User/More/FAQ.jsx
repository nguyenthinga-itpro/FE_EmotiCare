import React, { useEffect, useMemo } from "react";
import { Menu, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllFaqs } from "../../../redux/Slices/FAQSlice";
import "./More.css";

export default function FAQSection() {
  const dispatch = useDispatch();
  const { paginatedFaqs, loading, nextCursor, pageSize } = useSelector(
    (state) => state.faq
  );

  // Load FAQ lần đầu
  useEffect(() => {
    dispatch(getAllFaqs({ pageSize: 100 }));
  }, [dispatch, pageSize]);

  // Chia theo category để render Menu
  const faqsByCategory = useMemo(() => {
    const map = {};
    if (paginatedFaqs) {
      paginatedFaqs.forEach((faq) => {
        if (!map[faq.category]) map[faq.category] = [];
        map[faq.category].push({
          key: faq.id,
          label: <span className="panel-gradient">{faq.question}</span>,
          children: [
            {
              key: faq.id + "-answer",
              label: <div dangerouslySetInnerHTML={{ __html: faq.answer }} />,
            },
          ],
        });
      });
    }
    return map;
  }, [paginatedFaqs]);

  // const handleLoadMore = () => {
  //   if (nextCursor && !loading) {
  //     dispatch(getAllFaqs({ pageSize, startAfterId: nextCursor }));
  //   }
  // };

  return (
    <section className="faq-lines" id="faq">
      <h1 className="about-lineFAQ">FAQ</h1>
      <div className="faq-columns" style={{ display: "flex", gap: 50 }}>
        {/* Cột 1 */}
        <div style={{ flex: 1 }}>
          {["general", "privacy"].map((cat) => {
            const items = faqsByCategory[cat] || [];
            if (!items.length) return null; // không render nếu rỗng
            return (
              <div key={cat}>
                <h3>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                <Menu
                  mode="inline"
                  items={items}
                  expandIcon={({ isOpen }) => (
                    <span
                      className={`menu-arrow ${isOpen ? "open" : ""}`}
                    ></span>
                  )}
                />
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1 }}>
          {["chatbox", "support"].map((cat) => {
            const items = faqsByCategory[cat] || [];
            if (!items.length) return null; // không render nếu rỗng
            return (
              <div key={cat}>
                <h3>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                <Menu
                  mode="inline"
                  items={items}
                  expandIcon={({ isOpen }) => (
                    <span
                      className={`menu-arrow ${isOpen ? "open" : ""}`}
                    ></span>
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Load More nếu còn */}
      {/* {nextCursor && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button onClick={handleLoadMore} loading={loading}>
            Load More
          </Button>
        </div>
      )} */}
    </section>
  );
}
