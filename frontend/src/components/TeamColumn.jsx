import PlayerRow from './PlayerRow';

function TeamColumn({ teamName, players, isOpponent = false }) {
  return (
    <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-4">
      <div className={`text-center mb-4 p-3 rounded-lg ${
        isOpponent ? 'bg-red-900/30 border-l-4 border-red-500' : 'bg-blue-900/30 border-l-4 border-blue-500'
      }`}>
        <h2 className={`text-xl font-bold ${
          isOpponent ? 'text-red-400' : 'text-blue-400'
        }`}>
          {teamName}
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {isOpponent ? 'Opponent' : 'Your Team'}
        </p>
      </div>

      <div className="space-y-2">
        {players.map((player, index) => (
          <PlayerRow 
            key={index}
            player={player}
            isOpponent={isOpponent}
          />
        ))}
      </div>

      {/* Team Total (placeholder for now) */}
      <div className={`mt-4 p-3 rounded-lg border-2 border-dashed ${
        isOpponent ? 'border-red-500/30 bg-red-900/20' : 'border-blue-500/30 bg-blue-900/20'
      }`}>
        <div className="text-center">
          <span className="text-gray-400 text-sm">Team Total</span>
          <div className={`text-2xl font-bold ${
            isOpponent ? 'text-red-400' : 'text-blue-400'
          }`}>
            ---.--
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamColumn; 