import React from "react";
import { HeartOutlined, HeartFilled, MessageOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import Videos from "../../../Constant/Videos";

export default function PostcardItem({
  card,
  categoryDetail,
  flipped,
  onFlip,
  fav,
  onLike,
  onOpenModal,
  commentCount,
}) {
  const musicImageUrl =
    card.music?.images?.[0]?.url ||
    card.music?.images?.[1]?.url ||
    card.music?.images?.[2]?.url;

  return (
    <div
      className={`card-container ${flipped ? "flipped" : ""}`}
      onClick={onFlip}
    >
      {/* Front side */}
      <div className="card-front">
        <img src={card.image} alt={card.title} />
      </div>

      {/* Back side */}
      <div className="card-back">
        <img className="tag-card-back" src={categoryDetail?.image} alt="" />
        <div className="header-card-back">
          <img src={card.image} alt={card.title} className="image-card-back" />
          <h2>{card.title}</h2>
        </div>

        <div className="message-card-back">
          <strong>Message: </strong>
          <div dangerouslySetInnerHTML={{ __html: card.description }}></div>
          <div className="extra-info-card-back">
            <strong>Author: </strong>
            <span>{card?.author}</span>
            <br />
            <strong>Create: </strong>
            <span>{categoryDetail?.createdAt}</span>
          </div>
        </div>

        {/* Music Preview */}
        <div className="music-card-back-container">
          <div className="music-image-card-back">
            {card.music?.images?.length ? (
              <img
                className="music-card-back"
                src={musicImageUrl}
                alt={card.music.name || "Music"}
              />
            ) : (
              <video
                className="music-card-back"
                src={Videos.MusicMp4}
                autoPlay
                loop
                controls
              />
            )}
          </div>
          <div className="extra-info-card-back">
            <strong> Music name: </strong>
            <span> {card.music?.name}</span>
            <br />
            <strong> Artists: </strong>
            <span>
              {card.music?.artists?.length
                ? card.music.artists.join(", ")
                : "Unknown"}
            </span>
          </div>
        </div>

        {/* Spotify Embed */}
        <div>
          {card.music?.external_url ? (
            <div
              style={{
                width: "300px",
                height: "100px",
                overflow: "hidden",
              }}
            >
              <iframe
                title={card.music.name}
                src={`https://open.spotify.com/embed/${
                  card.music.type === "playlist"
                    ? "playlist"
                    : card.music.type === "album"
                    ? "album"
                    : "track"
                }/${card.music.id}?utm_source=generator&theme=0`}
                width="440px"
                height="200px"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{
                  transform: "scale(0.6)",
                  transformOrigin: "top left",
                }}
              />
            </div>
          ) : (
            <video
              className="music-player"
              src={Videos.MusicMp4}
              controls
              autoPlay
              loop
            />
          )}
        </div>

        {/* Action Icons */}
        <Space size="large">
          <Tooltip title="Like">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
            >
              {fav.isFavorite ? (
                <HeartFilled style={{ color: "red" }} />
              ) : (
                <HeartOutlined />
              )}{" "}
              {fav.totalFavorites}
            </span>
          </Tooltip>

          <Tooltip title="Comments">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal();
              }}
            >
              <MessageOutlined /> {commentCount}
            </span>
          </Tooltip>
        </Space>
      </div>
    </div>
  );
}
