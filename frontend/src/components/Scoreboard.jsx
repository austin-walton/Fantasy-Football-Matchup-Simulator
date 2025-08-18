function Scoreboard({ yourScore = 0, opponentScore = 0, winner = null, onReset = null }) {
  const hasResults = yourScore > 0 || opponentScore > 0;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold text-white mb-1">Fantasy Matchup</h1>
        <p className="text-gray-400 text-sm">Historical Simulation</p>
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-center space-x-6">
        {/* Your Score */}
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">YOUR TEAM</div>
          <div className={`text-3xl font-bold ${
            winner === 'you' ? 'text-blue-400' : 'text-white'
          }`}>
            {typeof yourScore === 'number' ? yourScore.toFixed(1) : '0.0'}
          </div>
          {winner === 'you' && (
            <div className="text-blue-400 font-semibold text-xs mt-1">WINNER! 🏆</div>
          )}
        </div>

        {/* VS */}
        <div className="text-lg font-bold text-gray-500">VS</div>

        {/* Opponent Score */}
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">OPPONENT</div>
          <div className={`text-3xl font-bold ${
            winner === 'opponent' ? 'text-red-400' : 'text-white'
          }`}>
            {typeof opponentScore === 'number' ? opponentScore.toFixed(1) : '0.0'}
          </div>
          {winner === 'opponent' && (
            <div className="text-red-400 font-semibold text-xs mt-1">WINNER! 🏆</div>
          )}
        </div>
      </div>

      {/* Tie Message */}
      {winner === 'tie' && (
        <div className="text-center mt-3">
          <div className="text-gray-400 font-semibold text-sm">IT'S A TIE! 🤝</div>
        </div>
      )}

      {/* Reset Button - only show when there are results */}
      {hasResults && onReset && (
        <div className="text-center mt-4">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
          >
            🔄 Simulate New Matchup
          </button>
        </div>
      )}
    </div>
  );
}

export default Scoreboard;