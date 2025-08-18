import React from 'react';

function WeekSelect({ selectedWeek, onWeekChange }) {
  // NFL regular season weeks (1-18)
  const weeks = Array.from({ length: 18 }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center justify-center mb-6">
      <label htmlFor="week-select" className="text-white text-lg font-semibold mr-3">
        Week:
      </label>
      <select
        id="week-select"
        value={selectedWeek}
        onChange={(e) => onWeekChange(parseInt(e.target.value))}
        className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {weeks.map(week => (
          <option key={week} value={week}>
            Week {week}
          </option>
        ))}
      </select>
    </div>
  );
}

export default WeekSelect;
