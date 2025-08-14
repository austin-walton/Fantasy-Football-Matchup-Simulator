function PlayerRow({ player, points = 0.0, onPlayerSearch, onRemovePlayer, selectedYear, allTeamPlayers = [] }) {
  // Validate props
  if (!player || !player.position) {
    console.error('Invalid player data in PlayerRow:', player);
    return null;
  }
  
  const hasStatsForYear = player.hasStats && player.hasStats !== null && player.hasStats[selectedYear];
  
  // Check if this player appears multiple times on the team
  const playerOccurrences = allTeamPlayers.filter(p => 
    !p.isEmpty && p.name === player.name && p.team === player.team
  ).length;
  
  const hasDuplicates = playerOccurrences > 1;
  
  if (player.isEmpty) {
    return (
      <div 
        onClick={onPlayerSearch}
        className="bg-gray-700 rounded p-3 flex justify-between items-center hover:bg-gray-600 transition-colors cursor-pointer border-2 border-dashed border-gray-500 hover:border-gray-400"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPlayerSearch();
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="text-gray-400 text-sm">
            + Add {player.position === 'FLEX' ? 'FLEX (RB/WR)' : player.position}
          </div>
        </div>
        <div className="text-gray-500 text-2xl">+</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 rounded p-3 flex justify-between items-center hover:bg-gray-600 transition-colors group">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <div className="font-semibold text-white">{player.name || 'Unknown Player'}</div>
          {!hasStatsForYear && (
            <div className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded">
              No {selectedYear} stats
            </div>
          )}
          {hasDuplicates && (
            <div className="bg-red-600 text-red-100 text-xs px-2 py-1 rounded">
              Duplicate
            </div>
          )}
        </div>
        <div className="text-sm text-gray-400">
          {player.position === 'FLEX' && player.actualPosition 
            ? `${player.actualPosition} (FLEX)` 
            : player.position || 'Unknown'
          } - {player.team || 'Unknown'}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-right">
          <div className="text-white font-bold">{typeof points === 'number' ? points.toFixed(1) : '0.0'}</div>
          <div className="text-xs text-gray-500">pts</div>
        </div>
        
        {/* Remove button - only shows on hover */}
        <button
          onClick={onRemovePlayer}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1"
          title="Remove player"
          aria-label={`Remove ${player.name || 'player'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PlayerRow;