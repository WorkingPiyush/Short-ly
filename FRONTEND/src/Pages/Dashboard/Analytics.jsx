/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Card from '@/components/Card';
import useInView from '@/Hooks/View';
import DropDownBtn from '@/components/DropDownBtn';
import { useShortAnalytics } from '@/Hooks/useUrl';
import { useParams } from 'react-router-dom';


const timePeriod = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "365 Days", value: 365 },
];

const COLORS = [
  "#14B8A6",
  "#2563EB",
  "#F59E0B",
];

function Analytics() {

  const params = useParams();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(7);

  const { data, isLoading, error } = useShortAnalytics(params.shortCode, selectedTimePeriod);
  console.log(data)
  const totalClicks = data?.totalClicks || 0;
  const engagementData = data?.dailyClicks;

  const locations = data?.topCountries.map((l) => ({
    country: l.country,
    clicks: l.clicks,
    percentage: Number(((l.clicks / totalClicks) * 100).toFixed(1))
  }));
  const devices = data?.topDevices.map((d) => ({
    name: d.device,
    value: d.clicks,
    percentage: Number(((d.clicks / totalClicks) * 100).toFixed(1))
  }));
  const referrers = data?.topReferrer.map((r) => ({
    name: r.referrer,
    value: r.clicks,
    percentage: Number(((r.clicks / totalClicks) * 100).toFixed(1))
  }));
  const { ref, isVisible } = useInView();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl">
              Analytics
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Track and analyze your link performance.
            </p>
          </div>
        </div>
        {/* ENGAGEMENT */}
        <Card>
          <div className="flex justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              Engagements over time
            </h2>

            {/* CALENDER */}
            <div className="flex items-center gap-2 border border-gray-700 px-4 py-2 rounded-xl">
              <Calendar size={16} />
              <DropDownBtn time={timePeriod} state={selectedTimePeriod} setState={setSelectedTimePeriod} />

            </div>
          </div>
          <div ref={ref} className="w-full h-70">
            {isVisible && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={engagementData} barGap="0" margin={{ top: 5, right: 5, left: 2, bottom: 0, }}>
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={10} />
                  <Tooltip cursor={{ fill: "rgba(20,184,166,0.08)" }} formatter={(value) => [value, "Clicks"]} />
                  <Bar dataKey="clicks" fill="#14B8A6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
        {/* LOCATIONS */}
        <Card>
          <div className="flex justify-between mb-8">
            <h2 className="text-3xl font-semibold">
              Locations
            </h2>
            <div className="flex bg-[#111827] rounded-xl p-1">
              <button className="px-4 py-2 bg-black cursor-pointer rounded-lg active:bg-gray-950/10">
                Countries
              </button>
            </div>
            {/* TABLE */}
          </div>
          <Table className="cursor-pointer">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Traffic Share</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations?.length > 0 ? (
                locations.map((item, index) => (
                  <TableRow key={item.country}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.country}</TableCell>
                    <TableCell className="w-full">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className={`h-full bg-blue-500 transition-all duration-800 delay-60 ease-in`} style={{ width: `${isVisible ? ` ${item.percentage}%` : "0%"}` }} />
                      </div>
                    </TableCell>
                    <TableCell>{item.clicks}</TableCell>
                    <TableCell>{item.percentage}%</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <p className="text-sm font-medium">No analytics available</p>
                      <p className="text-xs text-muted-foreground">
                        Data will appear once tracking starts
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* REFERRERS */}
        {referrers?.value > 0 && < DonutSection title="Referrers" data={referrers} />}

        {/* DEVICES */}
        {devices?.length > 0 && <DonutSection title="Devices" data={devices} />}
      </div>
    </div>
  );
}

function DonutSection({ title, data }) {
  const { ref, isVisible } = useInView();
  return (
    <Card>
      <div className="flex justify-between mb-8">
        <h2 className="text-3xl font-semibold">
          {title}
        </h2>
      </div>
      <div ref={ref} className="grid md:grid-cols-2 gap-10 justify-between items-center">
        {
          isVisible && (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data?.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                  <tspan x="50%" dy="-4" className="text-lg font-semibold">
                    {data.reduce((a, b) => a + b?.value, 0)}
                  </tspan>

                  <tspan x="50%" y="50%" className="text-xs fill-muted-foreground">
                    Total
                  </tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          )
        }
        <div className="space-y-6">
          {data?.map((item, index) => (
            <div key={item.name} className="flex justify-between items-center" >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[index], }} />
                {item.name}
              </div>
              <span>{item.percentage}%</span>
            </div>
          ))}
        </div>

      </div>

    </Card>
  );
}

export default Analytics
