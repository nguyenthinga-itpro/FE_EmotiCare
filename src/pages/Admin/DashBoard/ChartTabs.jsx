import React, { useState, useEffect } from "react";
import { Card, Tabs, DatePicker, Button, Space } from "antd";
import { Column } from "@ant-design/charts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "./Dashboard.css";
dayjs.extend(isoWeek);

const { RangePicker } = DatePicker;

export default function ChartTabs({ statsByPeriod, onFetchStats }) {
  const [period, setPeriod] = useState("week");
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const tabMap = {
    1: "users",
    2: "chatSessions",
    3: "emotionSessions",
  };

  const handlePeriodChange = (name) => {
    setPeriod(name.toLowerCase());
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  const handleRangeChange = (dates, pickerPeriod) => {
    if (!dates || !dates[0] || !dates[1]) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    let start, end;
    switch (pickerPeriod) {
      case "week":
        start = dates[0].startOf("week").toDate();
        end = dates[1].endOf("week").toDate();
        break;
      case "month":
        start = dates[0].startOf("month").toDate();
        end = dates[1].endOf("month").toDate();
        break;
      case "year":
        start = dates[0].startOf("year").toDate();
        end = dates[1].endOf("year").toDate();
        break;
    }

    setStartDate(start);
    setEndDate(end);
  };
  useEffect(() => {
    onFetchStats({
      type: tabMap[activeTabKey],
      period,
      start: startDate,
      end: endDate,
    });
  }, [period, activeTabKey, startDate, endDate]);

  const currentDataArray = (() => {
    if (!statsByPeriod?.data) return [];

    if (activeTabKey === "1") {
      // users
      return Object.entries(statsByPeriod.data).map(([key, value]) => ({
        date: key,
        Current: value.Current,
      }));
    } else if (activeTabKey === "2") {
      // chatSessions
      return Object.entries(statsByPeriod.data).flatMap(([week, aiCounts]) => {
        return Object.entries(statsByPeriod.aiDetails || {}).map(
          ([aiId, chatAI]) => ({
            date: week,
            name: chatAI.name,
            Current: aiCounts[aiId] || 0,
          })
        );
      });
    } else if (activeTabKey === "3") {
      return Object.entries(statsByPeriod.data).flatMap(
        ([week, emotiCounts]) => {
          return Object.entries(statsByPeriod.emotionDetails || {}).map(
            ([emotionId, emotion]) => ({
              date: week,
              name: emotion.name,
              emoji: emotion.emoji,
              Current: emotiCounts[emotionId] || 0,
            })
          );
        }
      );
    }

    return [];
  })();
  console.log("currentDataArray", currentDataArray);
  const createCurrentConfig = (data) => ({
    data: data.flatMap((d) =>
      activeTabKey === "3" || activeTabKey === "2"
        ? [{ ...d, type: d.name, value: d.Current }]
        : [{ ...d, type: "Current", value: d.Current }]
    ),
    xField: "date",
    yField: "value",
    seriesField: activeTabKey === "3" ? "type" : "type",
    isGroup: true,
    label: { position: "top" },
    colorField: "type",
    legend: { position: "top-left" },
  });

  return (
    
    <Card className="chart-tabs-dashboard">
      <Tabs
        activeKey={activeTabKey}
        onChange={handleTabChange}
        className="conainer-chart-tabs-dashboard"
        tabBarExtraContent={
          <div className="container-Dashboard-Style">
            <Space>
              {["Week", "Month", "Year"].map((name) => (
                <Button
                  key={name}
                  type={period === name.toLowerCase() ? "primary" : "default"}
                  onClick={() => handlePeriodChange(name)}
                >
                  {name}
                </Button>
              ))}
            </Space>

            {period === "week" && (
  <RangePicker
    className="custom-range-picker"
    picker="week"
    disabledDate={(current) => {
      const currentYear = dayjs().year();
      const minYear = currentYear - 5;
      const year = current.year();
      return year < minYear || year > currentYear;
    }}
    onChange={(dates) => handleRangeChange(dates, "week")}
  />
)}

{period === "month" && (
  <RangePicker
    className="custom-range-picker"
    picker="month"
    disabledDate={(current) => {
      const currentYear = dayjs().year();
      const minYear = currentYear - 5;
      const year = current.year();
      return year < minYear || year > currentYear;
    }}
    onChange={(dates) => handleRangeChange(dates, "month")}
  />
)}

{period === "year" && (
  <RangePicker
    className="custom-range-picker"
    picker="year"
    disabledDate={(current) => {
      const currentYear = dayjs().year();
      const minStartYear = currentYear - 5;
      const year = current.year();
      return year > currentYear || year < minStartYear;
    }}
    onChange={(dates) => handleRangeChange(dates, "year")}
  />
)}

          </div>
        }
        items={[
          {
            key: "1",
            label: "Real users",
            children: <Column {...createCurrentConfig(currentDataArray)} />,
          },
          {
            key: "2",
            label: "Sessions chatAIs",
            children: <Column {...createCurrentConfig(currentDataArray)} />,
          },
          {
            key: "3",
            label: " Type Emotions ",
            children: <Column {...createCurrentConfig(currentDataArray)} />,
          },
        ]}
      />
    </Card>
  );
}
