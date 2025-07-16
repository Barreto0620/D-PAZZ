// project/src/components/Admin/ChartComponent.tsx
import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext'; // Importar useTheme

interface ChartDataKey {
  name: string;
  color: string;
}

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: any[];
  xAxisDataKey?: string;
  dataKeys?: ChartDataKey[]; // Para Line e Bar charts
  pieDataKey?: string; // Para Pie chart
  nameKey?: string; // Para Pie chart (o que será exibido na legenda)
}

const ChartComponent: React.FC<ChartProps> = ({
  type,
  title,
  data,
  xAxisDataKey,
  dataKeys,
  pieDataKey,
  nameKey
}) => {
  const { theme } = useTheme(); // Use o hook de tema
  const textColor = theme === 'dark' ? '#cbd5e1' : '#4b5563'; // Cor para texto do eixo e legenda
  const gridColor = theme === 'dark' ? '#4a5568' : '#e2e8f0'; // Cor da grade
  const tooltipBg = theme === 'dark' ? '#1f2937' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#4b5563' : '#d1d5db';

  return (
    <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'line' && (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xAxisDataKey} stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                color: textColor
              }}
              labelStyle={{ color: textColor }}
              itemStyle={{ color: textColor }}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            {dataKeys?.map((key, index) => (
              <Line key={index} type="monotone" dataKey={key.name} stroke={key.color} activeDot={{ r: 8 }} />
            ))}
          </LineChart>
        )}

        {type === 'bar' && (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xAxisDataKey} stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                color: textColor
              }}
              labelStyle={{ color: textColor }}
              itemStyle={{ color: textColor }}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            {dataKeys?.map((key, index) => (
              <Bar key={index} dataKey={key.name} fill={key.color} />
            ))}
          </BarChart>
        )}

        {type === 'pie' && pieDataKey && nameKey && (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey={pieDataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={dataKeys ? dataKeys[index % dataKeys.length].color : '#8884d8'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                color: textColor
              }}
              labelStyle={{ color: textColor }}
              itemStyle={{ color: textColor }}
            />
            <Legend 
              wrapperStyle={{ color: textColor, marginTop: '10px' }} 
              formatter={(value, entry) => {
                const dataEntry = data.find(d => d[nameKey] === value);
                return `${value} (${dataEntry ? dataEntry[pieDataKey] : ''})`;
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;