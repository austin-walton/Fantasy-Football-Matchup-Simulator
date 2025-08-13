function PlayerRow({ player, isOpponent = false }) {
  // Position color coding (dark mode)
  const getPositionColor = (position) => {
    const colors = {
      'QB': 'bg-purple-900 text-purple-300',
      'RB': 'bg-green-900 text-green-300',
      'WR': 'bg-blue-900 text-blue-300',
      'TE': 'bg-orange-900 text-orange-300',
      'FLEX': 'bg-indigo-900 text-indigo-300',
      'K': 'bg-yellow-900 text-yellow-300',
      'D/ST': 'bg-gray-700 text-gray-300'
    };
    return colors[position] || 'bg-gray-700 text-gray-300';
  };

  return (
    <div className="flex items-center justify-between p-2 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
      {/* Player Info */}
      <div className="flex items-center space-x-3 flex-1">
        {/* Position Circle */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${getPositionColor(player.position)}`}>
          {player.position}
        </div>
        
        {/* Name and Team */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm truncate">{player.name}</div>
          <div className="text-xs text-gray-400">{player.team}</div>
        </div>
      </div>
      
      {/* Points (placeholder) */}
      <div className="text-right ml-2">
        <div className="text-sm font-bold text-white">--.-</div>
        <div className="text-xs text-gray-400">pts</div>
      </div>
    </div>
  );
}

export default PlayerRow;