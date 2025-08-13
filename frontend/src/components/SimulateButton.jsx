function SimulateButton({ onClick, isLoading = false, disabled = false }) {
  return (
    <div className="text-center mt-6">
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`
          px-6 py-3 rounded-lg font-bold text-base transition-all duration-200 shadow-lg
          ${disabled || isLoading 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Simulating...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>⚡ SIMULATE MATCHUP</span>
          </div>
        )}
      </button>
      
      <p className="text-gray-400 text-xs mt-2">
        Compare your fantasy matchup using historical season data
      </p>
    </div>
  );
}

export default SimulateButton;