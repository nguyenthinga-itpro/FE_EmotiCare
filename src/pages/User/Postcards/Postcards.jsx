import React, { useState } from "react";
import Images from "../../../Constant/Images";
import {
  HeartOutlined,
  ShareAltOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Row, Col, Space, Tooltip, Button, Modal } from "antd";
import "./Postcards.css";
import ExtraHeader from "../../../components/Headers/ExtraHeader";
import ExtraUserFooter from "../../../components/Footers/ExtraUserFooter";

export default function Postcards() {
  const [flipped, setFlipped] = useState(Array(10).fill(false));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  // toggle all cards
  const toggleAll = () => {
    const isAnyFlipped = flipped.some((f) => f); // có thẻ nào đang lật?
    if (isAnyFlipped) {
      // nếu có → đóng hết
      setFlipped(Array(flipped.length).fill(false));
    } else {
      // nếu chưa có → lật hết
      setFlipped(Array(flipped.length).fill(true));
    }
  };

  // dữ liệu cho 10 thẻ
  const cards = [
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=1",
      author: "Robert Fox",
      job: "Web Development",
      title: "Minim dolor in amet nulla laboris",
      date: "September 23, 2025",
      desc: "Minim dolor in amet nulla laboris enim dolore consequat proident fugiat culpa eiusmod...",
      tag: "Music",
      likes: "20k",
      shares: 34,
      comments: 567,
      Imgs: Images.Save,
    },
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=2",
      author: "Jane Cooper",
      job: "UI/UX Designer",
      title: "Consectetur adipiscing elit",
      date: "September 18, 2025",
      desc: "Consectetur magna laboris exercitation est qui. Fugiat culpa eiusmod tempor...",
      tag: "Music",
      likes: "5k",
      shares: 12,
      comments: 120,
    },
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=3",
      author: "Devon Lane",
      job: "Frontend Engineer",
      title: "Proident fugiat culpa eiusmod",
      date: "September 14, 2025",
      desc: "Excepteur amet proident incididunt officia laboris laborum...",
      tag: "Music",
      likes: "15k",
      shares: 25,
      comments: 321,
    },
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=4",
      author: "Esther Howard",
      job: "Digital Marketer",
      title: "Dolor sit amet consectetur",
      date: "September 10, 2025",
      desc: "Amet nulla laboris enim dolore consequat. Officia laboris laborum...",
      tag: "Music",
      likes: "9k",
      shares: 40,
      comments: 210,
    },
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=5",
      author: "Cameron Williamson",
      job: "Photographer",
      title: "Excepteur amet proident",
      date: "September 8, 2025",
      desc: "Enim dolore consequat proident fugiat culpa eiusmod tempor...",
      tag: "Music",
      likes: "3k",
      shares: 18,
      comments: 78,
    },
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=6",
      author: "Theresa Webb",
      job: "Writer",
      title: "Labore incididunt officia",
      date: "September 5, 2025",
      desc: "Magna laboris exercitation est qui. Fugiat culpa eiusmod tempor incididunt...",
      tag: "Music",
      likes: "7k",
      shares: 15,
      comments: 95,
    },
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=7",
      author: "Courtney Henry",
      job: "Content Creator",
      title: "Consectetur magna laboris",
      date: "September 2, 2025",
      desc: "Nulla laboris enim dolore consequat proident fugiat culpa eiusmod...",
      tag: "Music",
      likes: "11k",
      shares: 50,
      comments: 403,
    },
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=8",
      author: "Jacob Jones",
      job: "Fullstack Developer",
      title: "Proident fugiat culpa eiusmod",
      date: "August 30, 2025",
      desc: "Culpa eiusmod tempor incididunt magna laboris exercitation est qui...",
      tag: "Music",
      likes: "25k",
      shares: 70,
      comments: 800,
    },
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=9",
      author: "Brooklyn Simmons",
      job: "Artist",
      title: "Dolor in amet nulla laboris",
      date: "August 28, 2025",
      desc: "Fugiat culpa eiusmod tempor incididunt magna laboris exercitation est qui...",
      tag: "Music",
      likes: "2k",
      shares: 8,
      comments: 40,
    },
    {
      image: Images.SunnyV1,
      avatar: "https://i.pravatar.cc/50?img=10",
      author: "Arlene McCoy",
      job: "Teacher",
      title: "Enim dolore consequat",
      date: "August 25, 2025",
      desc: "Excepteur amet proident incididunt officia laboris laborum...",
      tag: "Music",
      likes: "6k",
      shares: 20,
      comments: 150,
    },
  ];

  return (
    <main>
      <ExtraHeader />

      {/* Breadcrumb */}
      <div className="article-breadcrumb">
        <a href="/">Home</a> / <span>Postcards:</span>
      </div>

      <section className="menu-section">
        <div className="content">
          <img
            className="title-sunny"
            src={Images.Sunnyvibes}
            alt="Sunny vibes"
          />
          <h1 className="title">Sunny Vibes</h1>
        </div>
      </section>

      <Button className="toggle-all-btn" type="dashed" onClick={toggleAll}>
        <span className="toggle-all-text">Toggle All Cards</span>
      </Button>

      {/* Grid 10 thẻ */}
      {/* <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
        {cards.map((card, i) => (
          <Col key={i} flex="1 0 18%" style={{ maxWidth: "18%" }}>
            <div
              className={`card-container ${flipped[i] ? "flipped" : ""}`}
              onClick={() => handleFlip(i)}
            >
             
              <div className="card-front">
                <img src={card.image} alt={card.title} />
              </div>

              <div className="card-back">
                <div className="card-header">
                  <img className="avatar" src={card.avatar} alt="Avatar" />
                  <div>
                    <h4>{card.author}</h4>
                    <span>{card.job}</span>
                  </div>
                  {card.Imgs && (
                    <img className="article-saves" src={card.Imgs} alt="Save" />
                  )}
                </div>

                <h2>{card.title}</h2>
                <p className="date">{card.date}</p>
                <p className="desc">{card.desc}</p>

                
                <div className="card-footer">
                  <span className="tag">{card.tag}</span>

                   <img className="card-viewdetail" src={Images.viewdetail} onClick={(e) => {
                      e.stopPropagation(); 
                      openModal(card);
                    }}/>
                </div>

                <div className="stats">
                  <Space size="large">
                    <Tooltip title="Likes">
                      <span>
                        <HeartOutlined /> {card.likes}
                      </span>
                    </Tooltip>
                    <Tooltip title="Shares">
                      <span>
                        <ShareAltOutlined /> {card.shares}
                      </span>
                    </Tooltip>
                    <Tooltip title="Comments">
                      <span>
                        <MessageOutlined /> {card.comments}
                      </span>
                    </Tooltip>
                  </Space>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row> */}
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
        {cards.map((card, i) => (
          <Col
            key={i}
            xs={24} // Mobile: 1 thẻ full width
            sm={12} // Tablet nhỏ: 2 thẻ / hàng
            md={8} // Tablet lớn: 3 thẻ / hàng
            lg={6} // Desktop vừa: 4 thẻ / hàng
            xl={5} // Desktop lớn: 6 thẻ / hàng
          >
            <div
              className={`card-container ${flipped[i] ? "flipped" : ""}`}
              onClick={() => handleFlip(i)}
            >
                {/* Mặt trước */}
                <div className="card-front">
                  <img src={card.image} alt={card.title} />
                </div>

                {/* Mặt sau */}

        
                  <div className="card-back">
                  <div className="card-header">
                    <img className="avatar" src={card.avatar} alt="Avatar" />
                    <div>
                      <h4>{card.author}</h4>
                      <span>{card.job}</span>
                    </div>
                    {card.Imgs && (
                      <img
                        className="article-saves"
                        src={card.Imgs}
                        alt="Save"
                      />
                    )}
                  </div>

                  <h2>{card.title}</h2>
                  <p className="date">{card.date}</p>
                  <p className="desc">{card.desc}</p>

                  {/* Tag + Button chi tiết */}
                  <div className="card-footer">
                    <span className="tag">{card.tag}</span>
                    <img
                      className="card-viewdetail"
                      src={Images.viewdetail}
                      alt="View Detail"
                      onClick={(e) => {
                        e.stopPropagation(); // tránh lật thẻ
                        openModal(card);
                      }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="stats">
                    <Space size="large">
                      <Tooltip title="Likes">
                        <span>
                          <HeartOutlined /> {card.likes}
                        </span>
                      </Tooltip>
                      <Tooltip title="Shares">
                        <span>
                          <ShareAltOutlined /> {card.shares}
                        </span>
                      </Tooltip>
                      <Tooltip title="Comments">
                        <span>
                          <MessageOutlined /> {card.comments}
                        </span>
                      </Tooltip>
                    </Space>
                  </div>
                </div></div>
              
          </Col>
        ))}
      </Row>

      {/* Modal chi tiết postcard */}
      <Modal
        centered
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        title={selectedCard?.title}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {selectedCard && (
          <scrollView>
            <img
              src={selectedCard.avatar}
              alt={selectedCard.title}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <h3 style={{ marginTop: "1rem" }}>{selectedCard.author}</h3>
            <p>{selectedCard.job}</p>
            <p>
              <b>Date:</b> {selectedCard.date}
            </p>
            <p>{selectedCard.desc}</p>
            <span className="tag">{selectedCard.tag}</span>

            {/* Stats */}
            <div className="stats" style={{ marginTop: "1rem" }}>
              <Space size="large">
                <Tooltip title="Likes">
                  <span>
                    <HeartOutlined /> {selectedCard.likes}
                  </span>
                </Tooltip>
                <Tooltip title="Shares">
                  <span>
                    <ShareAltOutlined /> {selectedCard.shares}
                  </span>
                </Tooltip>
                <Tooltip title="Comments">
                  <span>
                    <MessageOutlined /> {selectedCard.comments}
                  </span>
                </Tooltip>
              </Space>
            </div>
          </scrollView>
        )}
      </Modal>

      <div className="more-sections">
        <button className="btn-mores">More...</button>
      </div>

      <ExtraUserFooter />
    </main>
  );
}
