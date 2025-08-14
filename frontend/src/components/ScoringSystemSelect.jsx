function ScoringSystemSelect({ scoringSystem, onScoringSystemChange }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-3 mb-4">
      <div className="flex items-center justify-center space-x-4">
        <label htmlFor="scoring-select" className="text-gray-300 font-semibold text-sm">
          Scoring System:
        </label>
        <select
          id="scoring-select"
          value={scoringSystem}
          onChange={(e) => onScoringSystemChange(e.target.value)}
          className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white font-semibold text-sm"
        >
          <option value="PPR" className="bg-gray-700">PPR (Point Per Reception)</option>
          <option value="HALF_PPR" className="bg-gray-700">Half PPR (0.5 Point Per Reception)</option>
          <option value="STANDARD" className="bg-gray-700">Standard (No PPR)</option>
        </select>
        
        <div className="text-xs text-gray-400">
          🏈 Scoring Rules
        </div>
      </div>
    </div>
  );
}

export default ScoringSystemSelect;
