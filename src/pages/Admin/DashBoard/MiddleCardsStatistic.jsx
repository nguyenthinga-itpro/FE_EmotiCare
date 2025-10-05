import { Row, Col, Card } from "antd";


export default function MiddleCards() {
  return (
    <Row gutter={16} className="mt-6 middle-card-statistic">
      <Col span={12} className="container-middle-card-statistic">
        <Card className="card-middle-card-statistic">
          <h3 className="first-title-middle-card-statistic">
            Express Your Feelings
          </h3>
          <h2 className="second-title-middle-card-statistic">Chat with AI</h2>
          <p className="first-content-middle-card-statistic">
            Users can chat directly with AI to express emotions, get positive
            advice, and receive guidance for emotional healing.
          </p>
        </Card>
      </Col>
      <Col span={12} className="container-middle-card-statistic">
        <Card className="card-middle-card-statistic">
          <h3 className="first-title-middle-card-statistic">
            Explore Resources & Postcards
          </h3>
          <p className="first-content-middle-card-statistic">
            Discover curated Resources and Postcards designed to uplift your
            spirit, promote healing, and create a positive experience in daily
            life.
          </p>
        </Card>
      </Col>
    </Row>
  );
}
