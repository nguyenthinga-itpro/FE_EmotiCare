import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashboardStats,
  getStatsByPeriod,
} from "../../../redux/Slices/UserSlice";
import TopStats from "./TopStatistic";
import MiddleCards from "./MiddleCardsStatistic";
import ChartTabs from "./ChartTabs";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
export default function Dashboard() {
  const dispatch = useDispatch();
  const { dashboardStats, statsByPeriod, loading } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getStatsByPeriod({ type: "users", period: "week" }));
  }, [dispatch]);

  return (
    <div className="p-6 main-dashboard">
      <TopStats stats={dashboardStats} />
      <MiddleCards />
      <ChartTabs
        statsByPeriod={statsByPeriod}
        onFetchStats={(payload) => dispatch(getStatsByPeriod(payload))}
      />
      <OverlayLoader loading={loading} />
    </div>
  );
}
