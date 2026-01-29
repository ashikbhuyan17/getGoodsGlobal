"use client";

import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from "recharts";

function AnalyticsVisitors() {
  const data = [
    { date: "Apr 05", mobile: 120, desktop: 90, bounce: 0.42, timeOnSite: 63 },
    { date: "Apr 12", mobile: 200, desktop: 160, bounce: 0.38, timeOnSite: 71 },
    { date: "Apr 19", mobile: 260, desktop: 210, bounce: 0.35, timeOnSite: 76 },
    { date: "Apr 26", mobile: 220, desktop: 190, bounce: 0.4, timeOnSite: 68 },

    { date: "May 03", mobile: 300, desktop: 270, bounce: 0.33, timeOnSite: 82 },
    { date: "May 10", mobile: 420, desktop: 400, bounce: 0.29, timeOnSite: 89 },
    { date: "May 17", mobile: 455, desktop: 420, bounce: 0.28, timeOnSite: 92 },
    { date: "May 24", mobile: 495, desktop: 455, bounce: 0.27, timeOnSite: 95 },
    {
      date: "May 31",
      mobile: 510,
      desktop: 462,
      bounce: 0.26,
      timeOnSite: 100,
    },

    { date: "Jun 07", mobile: 470, desktop: 430, bounce: 0.3, timeOnSite: 84 },
    {
      date: "Jun 14",
      mobile: 520,
      desktop: 480,
      bounce: 0.25,
      timeOnSite: 101,
    },
    {
      date: "Jun 21",
      mobile: 540,
      desktop: 500,
      bounce: 0.24,
      timeOnSite: 106,
    },
    { date: "Jun 28", mobile: 450, desktop: 430, bounce: 0.29, timeOnSite: 88 },

    {
      date: "Jul 05",
      mobile: 580,
      desktop: 520,
      bounce: 0.23,
      timeOnSite: 110,
    },
    {
      date: "Jul 12",
      mobile: 620,
      desktop: 550,
      bounce: 0.21,
      timeOnSite: 118,
    },
    { date: "Jul 19", mobile: 650, desktop: 575, bounce: 0.2, timeOnSite: 120 },
    {
      date: "Jul 26",
      mobile: 700,
      desktop: 610,
      bounce: 0.19,
      timeOnSite: 125,
    },

    {
      date: "Aug 02",
      mobile: 720,
      desktop: 630,
      bounce: 0.19,
      timeOnSite: 128,
    },
    {
      date: "Aug 09",
      mobile: 755,
      desktop: 660,
      bounce: 0.18,
      timeOnSite: 132,
    },
    {
      date: "Aug 16",
      mobile: 790,
      desktop: 700,
      bounce: 0.17,
      timeOnSite: 135,
    },
    {
      date: "Aug 23",
      mobile: 820,
      desktop: 720,
      bounce: 0.17,
      timeOnSite: 138,
    },
    {
      date: "Aug 30",
      mobile: 780,
      desktop: 690,
      bounce: 0.18,
      timeOnSite: 133,
    },

    { date: "Sep 06", mobile: 760, desktop: 680, bounce: 0.2, timeOnSite: 126 },
    {
      date: "Sep 13",
      mobile: 795,
      desktop: 705,
      bounce: 0.18,
      timeOnSite: 130,
    },
    {
      date: "Sep 20",
      mobile: 830,
      desktop: 735,
      bounce: 0.17,
      timeOnSite: 137,
    },
    {
      date: "Sep 27",
      mobile: 860,
      desktop: 760,
      bounce: 0.16,
      timeOnSite: 143,
    },
    {
      date: "Oct 04",
      mobile: 700,
      desktop: 630,
      bounce: 0.21,
      timeOnSite: 118,
    },
    { date: "Oct 11", mobile: 745, desktop: 670, bounce: 0.2, timeOnSite: 124 },
    {
      date: "Oct 18",
      mobile: 900,
      desktop: 840,
      bounce: 0.15,
      timeOnSite: 150,
    },
    {
      date: "Oct 25",
      mobile: 680,
      desktop: 610,
      bounce: 0.23,
      timeOnSite: 112,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis dataKey="date" stroke="#888" />
        <Tooltip
          contentStyle={{ background: "#111", border: "1px solid #333" }}
          labelStyle={{ color: "#fff" }}
        />

        <Area
          type="monotone"
          dataKey="mobile"
          stroke="#fff"
          fill="url(#fillVisitors)"
          strokeWidth={2}
        />

        <Area
          type="monotone"
          dataKey="desktop"
          stroke="#aaa"
          fillOpacity={0}
          strokeWidth={1.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default AnalyticsVisitors;
