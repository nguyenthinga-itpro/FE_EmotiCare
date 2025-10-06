import Images from "../../../Constant/Images";
import "./ArticleCard.css";
import { getResourceById } from "../../../redux/Slices/ResourseSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";

export default function More() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const id = state?.id;
  const url = state?.src;
  useEffect(() => {
    // if (!id) {
    //   // Không có ID => quay lại
    //   navigate("/resources");
    //   return;
    // }
    dispatch(getResourceById(id));
  }, [id, dispatch, navigate]);

  const {
    allResourcesMap = {},
    loading,
    error,
  } = useSelector((state) => state.resource);

  const resource = allResourcesMap[id]; // Lấy dữ liệu từ store
  console.log("resource", resource);
  return (
    <main>
      <OverlayLoader loading={loading} />
      {error && <p>Error: {error}</p>}
      {resource && (
        <div className="article-card">
          <div className="article-image">
            {resource.type === "youtube" ? (
              <iframe
                width="100%"
                height="400"
                src={url}
                title={resource.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="article-video"
              />
            ) : resource.url.endsWith(".mp4") ? (
              <video
                src={resource.url}
                controls
                style={{ width: "100%", borderRadius: "8px" }}
              />
            ) : (
              <img
                className="article-image"
                src={resource.image || Images.Breezy}
                alt={resource.title}
              />
            )}
          </div>

          <h3 className="article-title">{resource.title}</h3>
          <p className="article-description">{resource.description}</p>
          <p
            className="article-text"
            dangerouslySetInnerHTML={{ __html: resource.content }}
          />
        </div>
      )}
    </main>
  );
}
