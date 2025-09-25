import { Row, Col, Card } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
export default function TopStats({ stats }) {
  // Hàm tính % tăng/giảm
  const calcPercent = (current, prev) => {
    if (!prev) return current ? "+100%" : "0%";
    const diff = current - prev;
    const percent = Math.abs(((diff / prev) * 100).toFixed(0));
    return diff > 0 ? `+${percent}%` : diff < 0 ? `-${percent}%` : "0%";
  };
  // Hàm render % với màu
  const renderPercent = (current, prev) => {
    const percent = calcPercent(current, prev);

    const isIncrease = percent.startsWith("+");
    const isDecrease = percent.startsWith("-");

    const color = isIncrease ? "yellow" : isDecrease ? "red" : "gray";

    return (
      <span
        style={{
          color,
        }}
        className="render-percent-top-statictis"
      >
        {isIncrease && <ArrowUpOutlined />}
        {isDecrease && <ArrowDownOutlined />}
        {percent}
      </span>
    );
  };

  return (
    <Row gutter={16} className="top-statictis">
      <Col span={6} className="container-top-statictis">
        <Card className="card-total-users-top-statictis">
          <p className="title-top-statictis">Total Users</p>
          <h2 className="value-top-statictis">
            {stats?.totalUsers || 0}
            {renderPercent(stats?.totalUsers, stats?.totalUsersPrev)}
          </h2>
        </Card>
      </Col>
      <Col span={6} className="container-top-statictis">
        <Card className="card-today-users-top-statictis">
          <p className="title-top-statictis"> Today's Users</p>
          <h2 className="value-top-statictis">
            {stats?.todaysUsers || 0}
            {renderPercent(stats?.todaysUsers, stats?.todaysUsersPrev)}
          </h2>
        </Card>
      </Col>
      <Col span={6} className="container-top-statictis">
        <Card className="card-total-chatsession-top-statictis">
          <p className="title-top-statictis">Total Chat Sessions</p>
          <h2 className="value-top-statictis">
            {stats?.totalChatSessions || 0}
            {renderPercent(
              stats?.totalChatSessions,
              stats?.totalChatSessionsPrev
            )}
          </h2>
        </Card>
      </Col>
      <Col span={6} className="container-top-statictis">
        <Card className="card-total-newchatsession-top-statictis">
          <p className="title-top-statictis">Today's New Chat Sessions</p>
          <h2 className="value-top-statictis">
            {stats?.todaysNewChatSessions || 0}
            {renderPercent(
              stats?.todaysNewChatSessions,
              stats?.todaysNewChatSessionsPrev
            )}
          </h2>
        </Card>
      </Col>
    </Row>
  );
}
