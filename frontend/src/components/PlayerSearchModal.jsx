import { useState, useEffect } from 'react'

function PlayerSearchModal({ players, position, onSelect, onClose, currentTeam = [], isLoading = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  useEffect(() => {
    if (!players || !Array.isArray(players)) {
      console.error('Invalid players data:', players);
      setFilteredPlayers([]);
      return;
    }
    
    let filtered;
    
    // Handle FLEX position - show both RB and WR players
    if (position === 'FLEX') {
      filtered = players
        .filter(player => player && (player.position === 'RB' || player.position === 'WR'))
        .filter(player => 
          player.name && player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.team && player.team.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Handle numbered positions (RB1, RB2, WR1, WR2) - use base position for filtering
      let targetPosition = position;
      if (position.startsWith('RB') || position.startsWith('WR')) {
        targetPosition = position.startsWith('RB') ? 'RB' : 'WR';
      }
      
      // Regular position filtering
      filtered = players
        .filter(player => player && player.position === targetPosition)
        .filter(player => 
          player.name && player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.team && player.team.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredPlayers(filtered);
  }, [players, position, searchTerm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="player-search-title">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 id="player-search-title" className="text-lg font-bold text-white">
              Add {position === 'FLEX' ? 'FLEX (RB/WR)' : position}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="mt-3">
            <input
              type="text"
              placeholder={position === 'FLEX' ? 'Search RBs and WRs...' : 
                position.startsWith('RB') ? 'Search RBs...' : 
                position.startsWith('WR') ? 'Search WRs...' : 
                `Search ${position}s...`
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div>Loading players...</div>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              {searchTerm 
                ? `No ${position === 'FLEX' ? 'RBs or WRs' : 
                    position.startsWith('RB') ? 'RBs' : 
                    position.startsWith('WR') ? 'WRs' : 
                    position}s found matching "${searchTerm}"` 
                : `No ${position === 'FLEX' ? 'RBs or WRs' : 
                    position.startsWith('RB') ? 'RBs' : 
                    position.startsWith('WR') ? 'WRs' : 
                    position}s available`
              }
            </div>
          ) : (
            <div className="space-y-2">
                             {filteredPlayers.map((player, index) => {
                 const isPlayerAlreadyOnTeam = currentTeam.some(slot => 
                   !slot.isEmpty && slot.name === player.name && slot.team === player.team
                 );
                 
                 return (
                   <div
                     key={`${player.name}-${player.team}-${index}`}
                     onClick={() => !isPlayerAlreadyOnTeam && onSelect(player)}
                     className={`rounded p-3 transition-colors ${
                       isPlayerAlreadyOnTeam 
                         ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                         : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                     }`}
                     role="button"
                     tabIndex={isPlayerAlreadyOnTeam ? -1 : 0}
                     onKeyDown={(e) => {
                       if (!isPlayerAlreadyOnTeam && (e.key === 'Enter' || e.key === ' ')) {
                         e.preventDefault();
                         onSelect(player);
                       }
                     }}
                   >
                     <div className="font-semibold text-white">{player.name}</div>
                     <div className="text-sm text-gray-400">{player.team}</div>
                     {isPlayerAlreadyOnTeam && (
                       <div className="text-xs text-red-400 mt-1">
                         Already on team
                       </div>
                     )}
                   </div>
                 );
               })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            {isLoading ? 'Loading...' : `${filteredPlayers.length} ${
              position === 'FLEX' ? 'RB/WR' : 
              position.startsWith('RB') ? 'RB' : 
              position.startsWith('WR') ? 'WR' : 
              position
            }${filteredPlayers.length !== 1 ? 's' : ''} found`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerSearchModal;