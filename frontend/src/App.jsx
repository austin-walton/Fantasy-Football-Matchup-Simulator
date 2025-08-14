import { useState, useEffect, useMemo } from 'react'
import TeamColumn from './components/TeamColumn'
import Scoreboard from './components/Scoreboard'
import YearSelect from './components/YearSelect'
import SimulateButton from './components/SimulateButton'
import PlayerSearchModal from './components/PlayerSearchModal'
import RookieWarningModal from './components/RookieWarningModal'
import ScoringSystemSelect from './components/ScoringSystemSelect'
import { calculateTeamScore, calculateFantasyPoints, SCORING_SYSTEMS } from './utilities/FantasyScoring'
import { getPlayerStats, hasStatsForYear, MOCK_HISTORICAL_STATS } from './data/MockStatsDatabase'

function App() {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [scoringSystem, setScoringSystem] = useState(SCORING_SYSTEMS.PPR);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showPlayerSearch, setShowPlayerSearch] = useState(false);
  const [showRookieWarning, setShowRookieWarning] = useState(false);
  const [searchingForTeam, setSearchingForTeam] = useState(null); // 'your' or 'opponent'
  const [searchingForPosition, setSearchingForPosition] = useState(null);
  const [playersWithoutStats, setPlayersWithoutStats] = useState([]);
  const [simulationResults, setSimulationResults] = useState({
    yourScore: 0,
    opponentScore: 0,
    winner: null,
    playerScores: {}
  });
  
  // Add error boundary state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup function
      setShowPlayerSearch(false);
      setShowRookieWarning(false);
      setSearchingForTeam(null);
      setSearchingForPosition(null);
      setPlayersWithoutStats([]);
    };
  }, []);
  
  // Enhanced team structure with empty slots
  const [yourTeam, setYourTeam] = useState([
    { id: 1, name: '', position: 'QB', team: '', isEmpty: true },
    { id: 2, name: '', position: 'RB1', team: '', isEmpty: true, basePosition: 'RB' },
    { id: 3, name: '', position: 'RB2', team: '', isEmpty: true, basePosition: 'RB' },
    { id: 4, name: '', position: 'WR1', team: '', isEmpty: true, basePosition: 'WR' },
    { id: 5, name: '', position: 'WR2', team: '', isEmpty: true, basePosition: 'WR' },
    { id: 6, name: '', position: 'TE', team: '', isEmpty: true },
    { id: 7, name: '', position: 'FLEX', team: '', isEmpty: true, flexTypes: ['RB', 'WR'] },
    { id: 8, name: '', position: 'DEF', team: '', isEmpty: true },
    { id: 9, name: '', position: 'K', team: '', isEmpty: true }
  ]);

  const [opponentTeam, setOpponentTeam] = useState([
    { id: 10, name: '', position: 'QB', team: '', isEmpty: true },
    { id: 11, name: '', position: 'RB1', team: '', isEmpty: true, basePosition: 'RB' },
    { id: 12, name: '', position: 'RB2', team: '', isEmpty: true, basePosition: 'RB' },
    { id: 13, name: '', position: 'WR1', team: '', isEmpty: true, basePosition: 'WR' },
    { id: 14, name: '', position: 'WR2', team: '', isEmpty: true, basePosition: 'WR' },
    { id: 15, name: '', position: 'TE', team: '', isEmpty: true },
    { id: 16, name: '', position: 'FLEX', team: '', isEmpty: true, flexTypes: ['RB', 'WR'] },
    { id: 17, name: '', position: 'DEF', team: '', isEmpty: true },
    { id: 18, name: '', position: 'K', team: '', isEmpty: true }
  ]);

  // Mock NFL player database - In production, this would come from an API
  const playerDatabase = useMemo(() => [
    // QBs
    { name: 'Josh Allen', position: 'QB', team: 'BUF', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Patrick Mahomes', position: 'QB', team: 'KC', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Lamar Jackson', position: 'QB', team: 'BAL', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'C.J. Stroud', position: 'QB', team: 'HOU', hasStats: { 2023: true } }, // Rookie example
    { name: 'Jalen Hurts', position: 'QB', team: 'PHI', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    
    // RBs
    { name: 'Christian McCaffrey', position: 'RB', team: 'SF', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Derrick Henry', position: 'RB', team: 'TEN', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Austin Ekeler', position: 'RB', team: 'LAC', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Saquon Barkley', position: 'RB', team: 'NYG', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Bijan Robinson', position: 'RB', team: 'ATL', hasStats: { 2023: true } }, // Rookie example
    { name: 'Alvin Kamara', position: 'RB', team: 'NO', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    
    // WRs
    { name: 'Cooper Kupp', position: 'WR', team: 'LAR', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Tyreek Hill', position: 'WR', team: 'MIA', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Stefon Diggs', position: 'WR', team: 'BUF', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Davante Adams', position: 'WR', team: 'LV', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'A.J. Brown', position: 'WR', team: 'PHI', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    
    // TEs
    { name: 'Travis Kelce', position: 'TE', team: 'KC', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Mark Andrews', position: 'TE', team: 'BAL', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Sam LaPorta', position: 'TE', team: 'DET', hasStats: { 2023: true } }, // Rookie example
    
    // DEF
    { name: 'Cowboys', position: 'DEF', team: 'DAL', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: '49ers', position: 'DEF', team: 'SF', hasStats: { 2021: true, 2022: true, 2023: true } },
    { name: 'Ravens', position: 'DEF', team: 'BAL', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    
    // K
    { name: 'Justin Tucker', position: 'K', team: 'BAL', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Daniel Carlson', position: 'K', team: 'LV', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } },
    { name: 'Harrison Butker', position: 'K', team: 'KC', hasStats: { 2020: true, 2021: true, 2022: true, 2023: true } }
  ], []);

  const handlePlayerSearch = (teamType, position, playerId) => {
    try {
      setSearchingForTeam(teamType);
      setSearchingForPosition(position);
      setShowPlayerSearch(true);
    } catch (error) {
      console.error('Error opening player search:', error);
      setErrorMessage('Failed to open player search');
      setHasError(true);
    }
  };

  const handlePlayerSelect = (player) => {
    if (!player || !player.name || !player.position || !player.team) {
      console.error('Invalid player data:', player);
      return;
    }
    
    const targetTeam = searchingForTeam === 'your' ? yourTeam : opponentTeam;
    const setTargetTeam = searchingForTeam === 'your' ? setYourTeam : setOpponentTeam;
    
    console.log('Adding player:', player, 'to', searchingForTeam, 'team at position:', searchingForPosition);
    
    // Check if player is already on the team
    const isPlayerAlreadyOnTeam = isPlayerOnTeam(player.name, player.team, targetTeam);
    
    if (isPlayerAlreadyOnTeam) {
      alert(`${player.name} is already on your ${searchingForTeam === 'your' ? 'team' : 'opponent team'}. You cannot have the same player twice.`);
      return;
    }
    
    // Find the specific slot that was clicked (using the searchingForPosition and ensuring it's empty)
    const updatedTeam = targetTeam.map(slot => {
      // For FLEX position, check if the player's position is allowed in FLEX
      if (slot.position === 'FLEX' && searchingForPosition === 'FLEX' && slot.isEmpty) {
        if (slot.flexTypes && slot.flexTypes.includes(player.position)) {
          return {
            ...slot,
            name: player.name,
            team: player.team,
            isEmpty: false,
            hasStats: player.hasStats || null,
            actualPosition: player.position // Store the actual position for display
          };
        }
      }
      // For numbered positions (RB1, RB2, WR1, WR2), check if the player's base position matches
      else if (slot.position === searchingForPosition && slot.isEmpty) {
        // Check if this is a numbered position and if the player's position matches the base position
        if (slot.basePosition && slot.basePosition === player.position) {
          return {
            ...slot,
            name: player.name,
            team: player.team,
            isEmpty: false,
            hasStats: player.hasStats || null
          };
        }
        // For non-numbered positions (QB, TE, DEF, K), assign directly
        else if (!slot.basePosition) {
          return {
            ...slot,
            name: player.name,
            team: player.team,
            isEmpty: false,
            hasStats: player.hasStats || null
          };
        }
      }
      return slot;
    });
    
    setTargetTeam(updatedTeam);
    setShowPlayerSearch(false);
    setSearchingForTeam(null);
    setSearchingForPosition(null);
    
    // Reset simulation results when team changes
    setSimulationResults({
      yourScore: 0,
      opponentScore: 0,
      winner: null,
      playerScores: {}
    });
    
    console.log('Updated team:', updatedTeam);
  };

  const handleRemovePlayer = (playerId, teamType) => {
    try {
      const targetTeam = teamType === 'your' ? yourTeam : opponentTeam;
      const setTargetTeam = teamType === 'your' ? setYourTeam : setOpponentTeam;
      
      console.log('Removing player from', teamType, 'team:', playerId);
      
      const updatedTeam = targetTeam.map(player => {
        if (player.id === playerId) {
          return {
            ...player,
            name: '',
            team: '',
            isEmpty: true,
            hasStats: null
          };
        }
        return player;
      });
      
          setTargetTeam(updatedTeam);
    
    // Reset simulation results when team changes
    setSimulationResults({
      yourScore: 0,
      opponentScore: 0,
      winner: null,
      playerScores: {}
    });
    
    console.log('Updated team after removal:', updatedTeam);
  } catch (error) {
    console.error('Error removing player:', error);
    setErrorMessage('Failed to remove player');
    setHasError(true);
  }
  };

  // Helper function to check if a player is already on a team
  const isPlayerOnTeam = (playerName, playerTeam, teamToCheck) => {
    return teamToCheck.some(slot => 
      !slot.isEmpty && slot.name === playerName && slot.team === playerTeam
    );
  };

  const checkForPlayersWithoutStats = () => {
    const allPlayers = [...yourTeam, ...opponentTeam].filter(p => !p.isEmpty);
    console.log('Checking stats for year:', selectedYear);
    console.log('All players:', allPlayers);
    
    const playersWithoutStats = allPlayers.filter(player => {
      const hasStats = player.hasStats && player.hasStats !== null && player.hasStats[selectedYear];
      console.log(`Player ${player.name} (${selectedYear}) has stats for ${selectedYear}:`, hasStats);
      return !hasStats;
    });
    
    console.log('Players without stats:', playersWithoutStats);
    return playersWithoutStats;
  };

  const handleSimulate = async () => {
    try {
      // Check if teams have players
      const yourTeamPlayers = yourTeam.filter(p => !p.isEmpty);
      const opponentTeamPlayers = opponentTeam.filter(p => !p.isEmpty);
      
      if (yourTeamPlayers.length === 0 || opponentTeamPlayers.length === 0) {
        alert('Please add players to both teams before simulating.');
        return;
      }
      
      // Check for duplicate players on teams
      const checkForDuplicates = (team) => {
        const playerCounts = {};
        team.forEach(slot => {
          if (!slot.isEmpty) {
            const key = `${slot.name}-${slot.team}`;
            playerCounts[key] = (playerCounts[key] || 0) + 1;
          }
        });
        return Object.entries(playerCounts).filter(([key, count]) => count > 1);
      };
      
      const yourTeamDuplicates = checkForDuplicates(yourTeam);
      const opponentTeamDuplicates = checkForDuplicates(opponentTeam);
      
      if (yourTeamDuplicates.length > 0) {
        const duplicateNames = yourTeamDuplicates.map(([key]) => key.split('-')[0]);
        alert(`Your team has duplicate players: ${duplicateNames.join(', ')}. Please remove duplicates before simulating.`);
        return;
      }
      
      if (opponentTeamDuplicates.length > 0) {
        const duplicateNames = opponentTeamDuplicates.map(([key]) => key.split('-')[0]);
        alert(`Opponent team has duplicate players: ${duplicateNames.join(', ')}. Please remove duplicates before simulating.`);
        return;
      }
      
      // Check for players without stats
      const problematicPlayers = checkForPlayersWithoutStats();
      
      if (problematicPlayers.length > 0) {
        setPlayersWithoutStats(problematicPlayers);
        setShowRookieWarning(true);
        return;
      }
      
      // Proceed with simulation
      proceedWithSimulation();
    } catch (error) {
      console.error('Error during simulation:', error);
      setErrorMessage('Failed to start simulation');
      setHasError(true);
    }
  };

  const proceedWithSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      console.log('Simulating matchup for year:', selectedYear);
      console.log('Your team:', yourTeam.filter(p => !p.isEmpty));
      console.log('Opponent team:', opponentTeam.filter(p => !p.isEmpty));
      
      try {
        // Calculate real scores using the scoring system
        const yourScore = calculateTeamScore(yourTeam.filter(p => !p.isEmpty), MOCK_HISTORICAL_STATS, scoringSystem);
        const opponentScore = calculateTeamScore(opponentTeam.filter(p => !p.isEmpty), MOCK_HISTORICAL_STATS, scoringSystem);
        const winner = yourScore > opponentScore ? 'you' : yourScore < opponentScore ? 'opponent' : 'tie';
        
        // Calculate individual player scores
        const playerScores = {};
        [...yourTeam, ...opponentTeam].filter(p => !p.isEmpty).forEach(player => {
          const stats = getPlayerStats(player.name, selectedYear);
          if (stats) {
            playerScores[player.id] = calculateFantasyPoints(stats, player.position, scoringSystem);
          }
        });
        
        const results = {
          yourScore,
          opponentScore,
          winner,
          playerScores
        };
        
        setSimulationResults(results);
        setIsSimulating(false);
        
        console.log('Simulation results:', results);
      } catch (error) {
        console.error('Error during simulation:', error);
        setIsSimulating(false);
        setErrorMessage('Failed to complete simulation');
        setHasError(true);
      }
    }, 2000);
  };

  const handleRookieWarningProceed = () => {
    setShowRookieWarning(false);
    proceedWithSimulation();
  };

  const handleRookieWarningCancel = () => {
    setShowRookieWarning(false);
    setPlayersWithoutStats([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Fantasy Football Matchup Simulator
          </h1>
          <p className="text-gray-400">
            Add players to your teams (including FLEX position) and simulate historical matchups
          </p>
        </div>

        {/* Year Selector */}
        <YearSelect 
          selectedYear={selectedYear} 
          onYearChange={(year) => {
            try {
              console.log('Year changed to:', year);
              setSelectedYear(year);
              
              // Clear any existing rookie warnings when year changes
              if (showRookieWarning) {
                setShowRookieWarning(false);
                setPlayersWithoutStats([]);
              }
              
              // Reset simulation results when year changes
              setSimulationResults({
                yourScore: 0,
                opponentScore: 0,
                winner: null,
                playerScores: {}
              });
            } catch (error) {
              console.error('Error changing year:', error);
              setErrorMessage('Failed to change year');
              setHasError(true);
            }
          }} 
        />

        {/* Scoring System Selector */}
        <ScoringSystemSelect 
          scoringSystem={scoringSystem}
          onScoringSystemChange={(system) => {
            setScoringSystem(system);
            // Reset simulation results when scoring system changes
            setSimulationResults({
              yourScore: 0,
              opponentScore: 0,
              winner: null,
              playerScores: {}
            });
          }}
        />

        {/* Scoreboard */}
        <Scoreboard 
          yourScore={simulationResults.yourScore} 
          opponentScore={simulationResults.opponentScore} 
          winner={simulationResults.winner}
        />

        {/* Main Matchup Layout */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Your Team */}
          <TeamColumn 
            teamName="Your Team" 
            players={yourTeam} 
            isOpponent={false}
            onPlayerSearch={(position, playerId) => handlePlayerSearch('your', position, playerId)}
            onRemovePlayer={(playerId) => handleRemovePlayer(playerId, 'your')}
            selectedYear={selectedYear}
            playerScores={simulationResults.playerScores}
          />

          {/* Opponent Team */}
          <TeamColumn 
            teamName="Opponent" 
            players={opponentTeam} 
            isOpponent={true}
            onPlayerSearch={(position, playerId) => handlePlayerSearch('opponent', position, playerId)}
            onRemovePlayer={(playerId) => handleRemovePlayer(playerId, 'opponent')}
            selectedYear={selectedYear}
            playerScores={simulationResults.playerScores}
          />
        </div>

        {/* Simulate Button */}
        <SimulateButton 
          onClick={handleSimulate}
          isLoading={isSimulating}
          disabled={
            isSimulating || 
            yourTeam.filter(p => !p.isEmpty).length === 0 || 
            opponentTeam.filter(p => !p.isEmpty).length === 0
          }
        />

        {/* Error Display */}
        {hasError && (
          <div className="mt-8 bg-red-900 border border-red-700 rounded-lg p-4">
            <h3 className="font-semibold text-red-400 mb-2">⚠️ Error</h3>
            <div className="text-sm text-red-300 space-y-1">
              <div>{errorMessage}</div>
              <button
                onClick={() => {
                  setHasError(false);
                  setErrorMessage('');
                }}
                className="mt-2 px-3 py-1 bg-red-700 text-white rounded hover:bg-red-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Development Info */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-green-400 mb-2">🚧 Development Status</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <div>✅ Day 1: Frontend ↔ Backend Communication</div>
            <div>✅ Day 2: Dark Mode UI Layout</div>
            <div>✅ Day 3: Player Data Integration + FLEX Position + Numbered Slots + Duplicate Prevention</div>
            <div>✅ Day 4: Scoring Engine + Multiple Scoring Systems</div>
            <div>⏳ Day 5: Enhanced Simulation + Player Stats</div>
          </div>
        </div>
      </div>

      {/* Player Search Modal */}
      {showPlayerSearch && (
        <PlayerSearchModal
          players={playerDatabase}
          position={searchingForPosition}
          onSelect={handlePlayerSelect}
          onClose={() => {
            setShowPlayerSearch(false);
            setSearchingForTeam(null);
            setSearchingForPosition(null);
          }}
          currentTeam={searchingForTeam === 'your' ? yourTeam : opponentTeam}
        />
      )}

      {/* Rookie Warning Modal */}
      {showRookieWarning && (
        <RookieWarningModal
          playersWithoutStats={playersWithoutStats}
          selectedYear={selectedYear}
          onProceed={handleRookieWarningProceed}
          onCancel={handleRookieWarningCancel}
        />
      )}
    </div>
  );
}

export default App;