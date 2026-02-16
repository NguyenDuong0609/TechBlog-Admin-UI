"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    Legend,
} from "recharts";

export interface ChartDataPoint {
    name: string;
    views: number;
    reads: number;
}

interface TrafficChartProps {
    data: ChartDataPoint[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
    return (
        <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                        dy={10}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                    />
                    <ChartTooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            border: "1px solid #f1f5f9",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                            fontSize: "12px"
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="views"
                        name="Exposure (Impressions)"
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 2 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                        animationDuration={1000}
                    />
                    <Line
                        type="monotone"
                        dataKey="reads"
                        name="Reading (Engaged)"
                        stroke="var(--chart-3)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
