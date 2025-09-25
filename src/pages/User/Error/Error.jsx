import React from "react";
import { message } from "antd";
import "./Error.css";
import "antd/dist/reset.css"; // antd v5
import Videos from "../../../Constant/Videos";

export default function Error() {
  // ✅ Khởi tạo message hook
  const [messageApi, contextHolder] = message.useMessage();


  const handleBack = () => {
    // Thông báo đầu tiên
    messageApi.success("😎 Đợi 5s để click vào ok để load lại trang nhé!");

    // Sau 5 giây mới chạy handleBacks
    setTimeout(() => {
      handleBacks();
    }, 5000);
  };

  const handleBacks = () => {
    messageApi.success("Bịp đấy đợi xíu!");
    setTimeout(() => {
      window.location.href = "/";
    }, 4000); // thêm 2s để thấy message rồi mới redirect
  };

  return (
    <section className="page_404">
      {contextHolder}
      <div className="container">
        <div className="row four_zero_four">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center">404</h1>
              </div>

              <video autoPlay loop muted className="Error">
                <source src={Videos.Error} type="video/mp4" />
              </video>

              <div className="contant_box_404">
                <h3 className="h2-lost">Look like you're lost</h3>
                <p>The page you are looking for is not available!</p>

                <a
                  href="/"
                  className="link_404"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBack();
                  }}
                >
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>

    </section>
  );
}
