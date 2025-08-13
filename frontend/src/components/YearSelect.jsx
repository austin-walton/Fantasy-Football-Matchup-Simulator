function YearSelect({ selectedYear, onYearChange }) {
  // Available years (we'll start with recent seasons)
  const availableYears = [2023, 2022, 2021, 2020, 2019];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-3 mb-4">
      <div className="flex items-center justify-center space-x-4">
        <label htmlFor="year-select" className="text-gray-300 font-semibold text-sm">
          Simulate Season:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white font-semibold text-sm"
        >
          {availableYears.map(year => (
            <option key={year} value={year} className="bg-gray-700">
              {year} Season
            </option>
          ))}
        </select>
        
        <div className="text-xs text-gray-400">
          📊 Historical Data
        </div>
      </div>
    </div>
  );
}

export default YearSelect;