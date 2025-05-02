"use client"
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  stack?: boolean
}

export function BarChart({ data, index, categories, colors, valueFormatter, yAxisWidth, stack }: ChartProps) {
  return (
    <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={index} />
      <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
      <Tooltip formatter={(value) => [valueFormatter ? valueFormatter(value as number) : value, ""]} />
      <Legend />
      {categories.map((category, i) => (
        <Bar key={category} dataKey={category} stackId={stack ? "a" : undefined} fill={colors[i % colors.length]} />
      ))}
    </RechartsBarChart>
  )
}

export function LineChart({ data, index, categories, colors, valueFormatter, yAxisWidth }: ChartProps) {
  return (
    <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={index} />
      <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
      <Tooltip formatter={(value) => [valueFormatter ? valueFormatter(value as number) : value, ""]} />
      <Legend />
      {categories.map((category, i) => (
        <Line
          key={category}
          type="monotone"
          dataKey={category}
          stroke={colors[i % colors.length]}
          activeDot={{ r: 8 }}
        />
      ))}
    </RechartsLineChart>
  )
}

export function AreaChart({ data, index, categories, colors, valueFormatter, yAxisWidth }: ChartProps) {
  return (
    <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={index} />
      <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
      <Tooltip formatter={(value) => [valueFormatter ? valueFormatter(value as number) : value, ""]} />
      {categories.map((category, i) => (
        <Area
          key={category}
          type="monotone"
          dataKey={category}
          stroke={colors[i % colors.length]}
          fill={colors[i % colors.length]}
        />
      ))}
    </RechartsAreaChart>
  )
}

interface PieChartProps {
  data: any[]
  index: string
  category: string
  colors: string[]
  valueFormatter?: (value: number) => string
}

export function PieChart({ data, index, category, colors, valueFormatter }: PieChartProps) {
  return (
    <RechartsPieChart width={400} height={400}>
      <Pie data={data} dataKey={category} nameKey={index} cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
        {data.map((entry, i) => (
          <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value, name) => [valueFormatter ? valueFormatter(value as number) : value, name]} />
      <Legend />
    </RechartsPieChart>
  )
}
