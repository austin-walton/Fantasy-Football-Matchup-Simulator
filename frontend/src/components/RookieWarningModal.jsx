function RookieWarningModal({ playersWithoutStats, selectedYear, onProceed, onCancel }) {
      return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="rookie-warning-title">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-600 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 id="rookie-warning-title" className="text-lg font-bold text-white">Players Without {selectedYear} Stats</h3>
            </div>
          </div>
  
          {/* Body */}
          <div className="p-6">
            <p className="text-gray-300 mb-4">
              The following player{playersWithoutStats.length > 1 ? 's have' : ' has'} no stats for the {selectedYear} season and will be assigned zero points:
            </p>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              {playersWithoutStats.map((player, index) => (
                <div key={`${player.name}-${player.team}-${index}`} className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-semibold text-white">{player.name || 'Unknown Player'}</div>
                    <div className="text-sm text-gray-400">{player.position || 'Unknown'} - {player.team || 'Unknown'}</div>
                  </div>
                  <div className="text-yellow-400 font-bold">0.0 pts</div>
                </div>
              ))}
            </div>
            
            <p className="text-gray-400 text-sm">
              This typically happens with rookies or players who didn't play that season. Would you like to proceed with the simulation?
            </p>
          </div>
  
          {/* Footer */}
          <div className="p-6 border-t border-gray-700 flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Proceed Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default RookieWarningModal;