import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Sector
} from 'recharts';

const ErrorDataVisualization = () => {
  // Input data
  const rawData = {
    'Initial': {
      'Reference repoints with differing geometry(Potential errors when replacing)': null,
      'Reference repoints with differing internal name(Potential errors when replacing)': null,
      'Reference deletion(Potential errors when replacing)': null,
      'Missing References(Without potential canidates)': 0,
      'Missing References(With potential canidates)': 61655,
      'Table generated part disconnected from factory with no potential parent': 2121,
      'Table generated part disconnected from factory with potential parent': 21955,
      'Duplicates(File Name)': 115372,
      'Duplicates(Geometry)': 159269,
      'Duplicates(Internal Name)': 395369,
      'Duplicates(fName & ~Geometry Hash)': 13560,
      'Duplicates(fName & ~Internal Name)': 37696,
      'Ambigous folder ownership': null,
      'Ambigous class': null,
      'Scan Errors': 21266
    },
    'Remove Duplicates(Keeping newest)': {
      'Reference repoints with differing geometry(Potential errors when replacing)': null,
      'Reference repoints with differing internal name(Potential errors when replacing)': null,
      'Reference deletion(Potential errors when replacing)': null,
      'Missing References(Without potential canidates)': 53696,
      'Missing References(With potential canidates)': 28173,
      'Table generated part disconnected from factory with no potential parent': 1528,
      'Table generated part disconnected from factory with potential parent': 16374,
      'Duplicates(File Name)': 0,
      'Duplicates(Geometry)': 134983,
      'Duplicates(Internal Name)': 365407,
      'Duplicates(fName & ~Geometry Hash)': 0,
      'Duplicates(fName & ~Internal Name)': 0,
      'Ambigous folder ownership': null,
      'Ambigous class': null,
      'Scan Errors': 1
    },
    'Rebekah Disallow List': {
      'Reference repoints with differing geometry(Potential errors when replacing)': null,
      'Reference repoints with differing internal name(Potential errors when replacing)': null,
      'Reference deletion(Potential errors when replacing)': null,
      'Missing References(Without potential canidates)': 47944,
      'Missing References(With potential canidates)': 18152,
      'Table generated part disconnected from factory with no potential parent': 531,
      'Table generated part disconnected from factory with potential parent': 10203,
      'Duplicates(File Name)': 0,
      'Duplicates(Geometry)': 85411,
      'Duplicates(Internal Name)': 242765,
      'Duplicates(fName & ~Geometry Hash)': 0,
      'Duplicates(fName & ~Internal Name)': 0,
      'Ambigous folder ownership': null,
      'Ambigous class': null,
      'Scan Errors': 1
    },
    'Recursive Reference Recovery': {
      'Reference repoints with differing geometry(Potential errors when replacing)': null,
      'Reference repoints with differing internal name(Potential errors when replacing)': null,
      'Reference deletion(Potential errors when replacing)': null,
      'Missing References(Without potential canidates)': 0,
      'Missing References(With potential canidates)': 20281,
      'Table generated part disconnected from factory with no potential parent': 560,
      'Table generated part disconnected from factory with potential parent': 10725,
      'Duplicates(File Name)': 10242,
      'Duplicates(Geometry)': 92240,
      'Duplicates(Internal Name)': 247318,
      'Duplicates(fName & ~Geometry Hash)': 3938,
      'Duplicates(fName & ~Internal Name)': 4691,
      'Ambigous folder ownership': null,
      'Ambigous class': null,
      'Scan Errors': 3003
    }
  };

  // Replace null with 0 for visualization
  const processedData = {};
  Object.keys(rawData).forEach(stage => {
    processedData[stage] = {};
    Object.keys(rawData[stage]).forEach(errorType => {
      processedData[stage][errorType] = rawData[stage][errorType] === null ? 0 : rawData[stage][errorType];
    });
  });

  // Generate colors for the different error types
  const errorTypes = Object.keys(processedData['Initial']).filter(type => 
    Object.values(processedData).some(stage => stage[type] > 0)
  );
  
  const COLORS = [
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c',
    '#d0ed57', '#ffc658', '#ff8042', '#ff6361', '#bc5090',
    '#58508d', '#003f5c', '#444e86', '#955196', '#dd5182'
  ];

  // Prepare data for line chart
  const lineChartData = Object.keys(processedData).map(stage => {
    const stageData = { stage };
    errorTypes.forEach(errorType => {
      stageData[errorType] = processedData[stage][errorType];
    });
    return stageData;
  });

  // Prepare data for bar chart
  const barChartData = Object.keys(processedData).map(stage => {
    const stageData = { stage };
    let total = 0;
    errorTypes.forEach(errorType => {
      stageData[errorType] = processedData[stage][errorType];
      total += processedData[stage][errorType];
    });
    stageData.total = total;
    return stageData;
  });

  // Prepare data for pie charts
  const pieChartData = {};
  Object.keys(processedData).forEach(stage => {
    pieChartData[stage] = errorTypes
      .filter(errorType => processedData[stage][errorType] > 0)
      .map((errorType, index) => ({
        name: errorType,
        value: processedData[stage][errorType],
        color: COLORS[index % COLORS.length]
      }));
  });

  // State for selected stage in pie chart
  const [selectedStage, setSelectedStage] = useState('Initial');

  // Function to abbreviate long error names
  const shortenName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    
    const parts = name.split('(');
    if (parts.length > 1) {
      return parts[0] + '...';
    }
    return name.substring(0, maxLength) + '...';
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 shadow-md">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend for more readable names
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              style={{
                backgroundColor: entry.color,
                width: '10px',
                height: '10px',
                marginRight: '5px'
              }}
            />
            <span className="text-xs">{shortenName(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Error Analysis Across Processing Stages</h1>
      
      {/* Line Chart */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">Error Trends Across Processing Stages</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderCustomizedLegend} height={100} verticalAlign="bottom" />
              {errorTypes.map((errorType, index) => (
                <Line
                  key={errorType}
                  type="monotone"
                  dataKey={errorType}
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                  name={errorType}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">Composition of Errors at Each Stage</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderCustomizedLegend} height={100} verticalAlign="bottom" />
              {errorTypes.map((errorType, index) => (
                <Bar 
                  key={errorType} 
                  dataKey={errorType} 
                  stackId="a" 
                  fill={COLORS[index % COLORS.length]} 
                  name={errorType}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts */}
      <div>
        <h2 className="text-xl font-bold mb-4">Distribution of Errors by Stage</h2>
        
        {/* Stage Selector */}
        <div className="flex justify-center mb-4">
          {Object.keys(processedData).map(stage => (
            <button
              key={stage}
              className={`px-4 py-2 mx-1 rounded ${selectedStage === stage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedStage(stage)}
            >
              {stage}
            </button>
          ))}
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData[selectedStage]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${shortenName(name, 12)} (${(percent * 100).toFixed(1)}%)`}
              >
                {pieChartData[selectedStage].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend for Pie Chart */}
        <div className="mt-4">
          <div className="flex flex-wrap justify-center gap-4">
            {pieChartData[selectedStage].map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: entry.color,
                    marginRight: '5px'
                  }}
                />
                <span className="text-sm">{shortenName(entry.name)}: {formatNumber(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="mt-12 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-bold mb-2">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Total Errors by Stage:</h4>
            <ul>
              {barChartData.map(item => (
                <li key={item.stage}>
                  {item.stage}: {formatNumber(item.total)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Most Common Error Types:</h4>
            <ul>
              {errorTypes
                .map(type => ({
                  type,
                  total: Object.values(processedData).reduce((sum, stage) => sum + stage[type], 0)
                }))
                .sort((a, b) => b.total - a.total)
                .slice(0, 5)
                .map(({ type, total }) => (
                  <li key={type}>
                    {shortenName(type)}: {formatNumber(total)}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDataVisualization;