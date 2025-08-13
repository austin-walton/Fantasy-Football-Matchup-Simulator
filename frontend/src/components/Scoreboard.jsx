function Scoreboard({ yourScore = 0, opponentScore = 0, winner = null }) {
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
            {yourScore.toFixed(1)}
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
            {opponentScore.toFixed(1)}
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
    </div>
  );
}

export default Scoreboard;