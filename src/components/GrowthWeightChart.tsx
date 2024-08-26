"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { childData } from "data/childData";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceDot,
  XAxis,
  YAxis,
} from "recharts";

const chartData = childData.boy;

const chartConfig = {
  age_in_months: {
    label: "Age",
  },
  height_cm: {
    label: "Height (in cm)",
    color: "hsl(var(--chart-1))",
  },
  weight_kg: {
    label: "Weight (in kgs)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const GrowthWeightChart = ({
  age,
  height,
  weight,
  heightStatus,
  weightStatus,
}: {
  age: number;
  height: number;
  weight: number;
  weightStatus: string;
  heightStatus: string;
}) => {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("height_cm");

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["height_cm", "weight_kg"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${activeChart})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${activeChart})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="age_in_months"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return `${value} months`;
              }}
            />
            <YAxis
              dataKey={activeChart === "height_cm" ? "height_cm" : "weight_kg"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return `${value} ${activeChart === "height_cm" ? "cm" : "kg"}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => value}
                />
              }
            />
            <Area
              dataKey={activeChart}
              type="natural"
              fill="url(#fill)"
              fillOpacity={0.4}
              stroke={`var(--color-${activeChart})`}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ReferenceDot
              x={age}
              y={activeChart === "height_cm" ? height : weight}
              r={5}
              fill="red"
              stroke="none"
            >
              {activeChart === "height_cm" && (
                <Label
                  value={`Height: ${height} cm`}
                  position="left"
                  fill="red"
                />
              )}
              {activeChart === "height_cm" && (
                <Label
                  value={`Status: ${heightStatus}`}
                  position="right"
                  fill="red"
                />
              )}
              {activeChart === "weight_kg" && (
                <Label
                  value={`Weight: ${weight} kg`}
                  position="left"
                  fill="red"
                />
              )}
              {activeChart === "weight_kg" && (
                <Label
                  value={`Status: ${weightStatus}`}
                  position="right"
                  fill="red"
                />
              )}
              <Label
                value={`Age: ${age} months`}
                position="bottom"
                fill="red"
              />
            </ReferenceDot>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
