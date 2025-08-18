import { useState, useEffect, useMemo } from 'react'
import TeamColumn from './components/TeamColumn'
import Scoreboard from './components/Scoreboard'
import WeekSelect from './components/WeekSelect'
import SimulateButton from './components/SimulateButton'
import PlayerSearchModal from './components/PlayerSearchModal'
import RookieWarningModal from './components/RookieWarningModal'
import { calculateTeamScore, calculateFantasyPoints, SCORING_SYSTEMS } from './utilities/FantasyScoring'
import { getPlayerStats, hasStatsForYear, getPlayers, getTeamStats } from './data/MockStatsDatabase'

function App() {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedWeek, setSelectedWeek] = useState(1); // Add week selector
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
  
  // Add loading state for player database
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [playerDatabase, setPlayerDatabase] = useState([]);
  
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
  
  // Load player database when year changes
  useEffect(() => {
    const loadPlayerDatabase = async () => {
      setIsLoadingPlayers(true);
      try {
        const players = await getPlayers(selectedYear);
        setPlayerDatabase(players);
      } catch (error) {
        console.error('Error loading player database:', error);
        setErrorMessage('Failed to load player database');
        setHasError(true);
      } finally {
        setIsLoadingPlayers(false);
      }
    };

    loadPlayerDatabase();
  }, [selectedYear]);

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

  const checkForPlayersWithoutStats = async () => {
    const allPlayers = [...yourTeam, ...opponentTeam].filter(p => !p.isEmpty);
    console.log('🔍 Checking weekly stats for year:', selectedYear, 'week:', selectedWeek);
    console.log('All players to check:', allPlayers);
    
    const playersWithoutStats = [];
    
    for (const player of allPlayers) {
      console.log(`Checking ${player.name} for ${selectedYear}, Week ${selectedWeek}...`);
      const hasStats = await hasStatsForYear(player.name, selectedYear, selectedWeek);
      console.log(`Player ${player.name} (${selectedYear}, Week ${selectedWeek}) has stats:`, hasStats);
      if (!hasStats) {
        console.log(`❌ ${player.name} has NO weekly stats for ${selectedYear}, Week ${selectedWeek}`);
        playersWithoutStats.push(player);
      } else {
        console.log(`✅ ${player.name} has weekly stats for ${selectedYear}, Week ${selectedWeek}`);
      }
    }
    
    console.log('📊 Final result - Players without weekly stats:', playersWithoutStats);
    return playersWithoutStats;
  };

  const handleSimulate = async () => {
    console.log('🚀 SIMULATE BUTTON CLICKED!');
    
    try {
      // Check if teams have players
      const yourTeamPlayers = yourTeam.filter(p => !p.isEmpty);
      const opponentTeamPlayers = opponentTeam.filter(p => !p.isEmpty);
      
      console.log('Your team players:', yourTeamPlayers);
      console.log('Opponent team players:', opponentTeamPlayers);
      
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
      
      console.log('✅ All validation checks passed, proceeding to simulation...');
      
      // Check for players without stats
      const problematicPlayers = await checkForPlayersWithoutStats();
      
      if (problematicPlayers.length > 0) {
        console.log('⚠️ Players without stats found:', problematicPlayers);
        setPlayersWithoutStats(problematicPlayers);
        setShowRookieWarning(true);
        return;
      }
      
      console.log('✅ All players have stats, starting simulation...');
      
      // Proceed with simulation
      proceedWithSimulation();
    } catch (error) {
      console.error('❌ ERROR during simulation setup:', error);
      setErrorMessage(`Failed to start simulation: ${error.message}`);
      setHasError(true);
    }
  };

  const proceedWithSimulation = async () => {
    setIsSimulating(true);
    
    try {
      console.log('=== SIMULATION START ===');
      console.log('Year:', selectedYear);
      console.log('Week:', selectedWeek);
      console.log('Your team players:', yourTeam.filter(p => !p.isEmpty));
      console.log('Opponent team players:', opponentTeam.filter(p => !p.isEmpty));
      
      // Get team stats from API for the specific week
      const yourTeamPlayersFiltered = yourTeam.filter(p => !p.isEmpty);
      const opponentTeamPlayersFiltered = opponentTeam.filter(p => !p.isEmpty);

      console.log('=== FETCHING YOUR TEAM WEEKLY STATS ===');
      console.log('Players to fetch stats for:', yourTeamPlayersFiltered.map(p => p.name));
      const yourTeamStats = await getTeamStats(yourTeamPlayersFiltered, selectedYear, selectedWeek);
      console.log('Your team weekly stats received:', yourTeamStats);
      
      console.log('=== FETCHING OPPONENT TEAM WEEKLY STATS ===');
      console.log('Players to fetch stats for:', opponentTeamPlayersFiltered.map(p => p.name));
      const opponentTeamStats = await getTeamStats(opponentTeamPlayersFiltered, selectedYear, selectedWeek);
      console.log('Opponent team weekly stats received:', opponentTeamStats);

      // Calculate real scores using the scoring system
      console.log('=== CALCULATING TEAM SCORES ===');
      const yourScore = calculateTeamScore(yourTeamPlayersFiltered, yourTeamStats, SCORING_SYSTEMS.PPR);
      const opponentScore = calculateTeamScore(opponentTeamPlayersFiltered, opponentTeamStats, SCORING_SYSTEMS.PPR);
      const winner = yourScore > opponentScore ? 'you' : yourScore < opponentScore ? 'opponent' : 'tie';
      
      console.log('Final calculated scores:', { yourScore, opponentScore, winner });

      // Calculate individual player scores
      console.log('=== CALCULATING INDIVIDUAL PLAYER SCORES ===');
      const playerScores = {};
      [...yourTeamPlayersFiltered, ...opponentTeamPlayersFiltered].forEach(player => {
        const stats = yourTeamStats[player.name] || opponentTeamStats[player.name];
        if (stats) {
          const points = calculateFantasyPoints(stats, player.position, SCORING_SYSTEMS.PPR);
          playerScores[player.id] = points;
          console.log(`${player.name} (${player.position}): ${points} points`);
        } else {
          console.log(`❌ No weekly stats found for ${player.name} - this is the problem!`);
          playerScores[player.id] = 0;
        }
      });

      const results = {
        yourScore,
        opponentScore,
        winner,
        playerScores
      };

      console.log('=== SIMULATION COMPLETE ===');
      console.log('Final results:', results);
      console.log('Player scores object:', playerScores);
      
      // Update the state with results
      setSimulationResults(results);
      setIsSimulating(false);

      // Force a re-render to show results
      console.log('✅ Simulation results updated in state:', results);

    } catch (error) {
      console.error('❌ ERROR during simulation:', error);
      setIsSimulating(false);
      setErrorMessage('Failed to complete simulation');
      setHasError(true);
    }
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
        <WeekSelect 
          selectedYear={selectedYear} 
          selectedWeek={selectedWeek}
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
          onWeekChange={(week) => {
            setSelectedWeek(week);
            // Reset simulation results when week changes
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
          onReset={() => {
            console.log('🔄 Resetting simulation results...');
            setSimulationResults({
              yourScore: 0,
              opponentScore: 0,
              winner: null,
              playerScores: {}
            });
          }}
        />

        {/* Debug Info - Remove this after fixing */}
        <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-600">
          <div className="text-xs text-gray-400">Debug Info:</div>
          <div className="text-xs text-white">
            Your Score: {simulationResults.yourScore} | 
            Opponent Score: {simulationResults.opponentScore} | 
            Winner: {simulationResults.winner} | 
            Player Scores Count: {Object.keys(simulationResults.playerScores).length}
          </div>
        </div>

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

        {/* Debug Team Info - Remove this after fixing */}
        <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-600">
          <div className="text-xs text-gray-400">Team Debug Info:</div>
          <div className="text-xs text-white">
            Your Team Players: {yourTeam.filter(p => !p.isEmpty).map(p => p.name).join(', ')} | 
            Opponent Team Players: {opponentTeam.filter(p => !p.isEmpty).map(p => p.name).join(', ')}
          </div>
          <div className="text-xs text-white">
            Player Scores Keys: {Object.keys(simulationResults.playerScores).join(', ')}
          </div>
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
            <div>✅ Day 5: Enhanced Simulation + Player Stats</div>
            <div>🎯 Day 6: Real NFL API Integration (Sports Reference)</div>
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
          isLoading={isLoadingPlayers}
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