import PlayerRow from './PlayerRow'

function TeamColumn({ teamName, players, isOpponent, onPlayerSearch, onRemovePlayer, selectedYear, playerScores = {} }) {
  return (
    <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 p-4">
      <h2 className={`text-xl font-bold mb-4 text-center ${
        isOpponent ? 'text-red-400' : 'text-blue-400'
      }`}>
        {teamName}
      </h2>
      <div className="space-y-2">
        {players.map((player) => (
          <PlayerRow 
            key={player.id} 
            player={player} 
            points={playerScores[player.id] || 0.0}
            onPlayerSearch={() => onPlayerSearch(player.position, player.id)}
            onRemovePlayer={() => onRemovePlayer(player.id)}
            selectedYear={selectedYear}
            allTeamPlayers={players}
          />
        ))}
      </div>
      
      {/* Team Summary */}
      <div className="mt-4 pt-3 border-t border-gray-600">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">
            Players: {players.filter(p => !p.isEmpty).length}/9
          </span>
          <span className="text-gray-400">
            Total: {players.reduce((total, player) => {
              if (!player.isEmpty && playerScores[player.id]) {
                return total + playerScores[player.id];
              }
              return total;
            }, 0).toFixed(1)} pts
          </span>
        </div>
        {players.filter(p => !p.isEmpty).length === 0 && (
          <div className="text-center text-gray-500 text-xs mt-2">
            No players added yet
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamColumn;