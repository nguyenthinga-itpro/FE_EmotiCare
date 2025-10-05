import React, { useEffect, useRef } from "react";
import { Pagination, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Images from "../../../Constant/Images";
import "./Home.css";
import { getAllChats } from "../../../redux/Slices/ChatAISlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRightOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // lấy state từ redux
  const {
    paginatedChats = [],
    loading,
    error,
    pageSize,
  } = useSelector((s) => s.chat);
  const { paginatedCategories = [] } = useSelector((s) => s.category);

  // gọi API chats
  useEffect(() => {
    dispatch(getAllChats({ pageSize: 100 }));
  }, [dispatch, pageSize]);

  // gọi API categories
  useEffect(() => {
    dispatch(getAllCategories({ pageSize: 100 }));
  }, [dispatch]);

  // lọc bỏ disabled
  const chats = paginatedChats.filter((c) => c.isDisabled === false);
  const categories = paginatedCategories.filter((c) => c.isDisabled === false);
  console.log("categories", categories);
  const postcardHandle = (category) => {
    navigate("/user/postcards", { state: { category } });
  };
  const profileRefs = useRef({});

  const scrollToProfile = (chatId) => {
    const profileEl = profileRefs.current[chatId];
    if (profileEl)
      profileEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        scrollToProfile(location.state.scrollTo);
      }, 300); // delay nhẹ để DOM render xong
    }
  }, [location, chats]);


  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>
            <span className="highlight">EmotiCare: </span>
            <span className="highlights"> Where mood meets companion.</span>
          </h1>
          <span className="highlight-margin-left">
            You speak, we listen — every emotion matters.
          </span>
          <div className="cta1-button-login">
            <Link to="/login">
              <button className="cta-button">Get Started</button>
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img src={Images.Care} alt="Care" />
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section">
        <div className="content">
          <p className="subtitle">WHAT WE DO</p>
          <h1 className="title">Chat Buddy</h1>
        </div>
      </section>

      {/* Characters Section */}
      <section className="chat-container">
        {loading && <p>Loading chats...</p>}
        {error && <p style={{ color: "red" }}>Error loading chats: {error}</p>}
        {!loading && chats.length === 0 && <p>No chats available</p>}

        {chats.length > 0 && (
          <Slider {...sliderSettings}>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="chat-card-home-container"
                onClick={() =>
                  navigate("/user/Chatbox", { state: { scrollTo: chat.id } })
                }
              >
                <div className="chat-card-home">
                  <h3>{chat.name}</h3>
                  <img src={chat.image} alt={chat.name} />
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* Postcards Section */}
      <section className="postcards-section-home">
        <div className="container-postcards-section-home">
          <h2 className="subtitle">LARGE HEALING POSTCARD COLLECTION</h2>
          <h1 className="titles">POST CARDS</h1>

          <div className="card-grid">
            {categories.map((c) => (
              <div key={c.id} className="card-home">
                <div className="icon">
                  <img src={c.image || Images.DefaultPostcard} alt={c.name} />
                </div>
                <h3>{c.name}</h3>
                <p
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: c.description }}
                />
                <div                   className="arrow-card-home-container"
>
                <Button
                  className="arrow-card-home"
                  icon={<ArrowRightOutlined />}
                  onClick={() => postcardHandle({ name: c.name })}
                >
                  {/* <ArrowRightOutlined  /> */}
                </Button>
              </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image">
            <img src={Images.About} alt="About" />
          </div>

          <div className="about-content">
            <span className="subtitles">ABOUT US</span>
            <h2 className="title">Welcome to EmotiCare!</h2>
            <p className="titles">
              EmotiCare is a place to talk, chat, and connect about your
              feelings. We create a safe, friendly, and fun space where every
              mood is embraced — from happy, sad, to silly, mindless moments.
            </p>
            <button
              className="cta-button"
              onClick={() => {
                navigate("/user/more");
                window.scrollTo(0, 0);
              }}
            >
              About us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
