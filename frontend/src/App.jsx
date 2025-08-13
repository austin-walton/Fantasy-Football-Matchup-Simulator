import { useState } from 'react'
import TeamColumn from './components/TeamColumn'
import Scoreboard from './components/Scoreboard'
import YearSelect from './components/YearSelect'
import SimulateButton from './components/SimulateButton'

function App() {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Mock data for demonstration
  const yourTeam = [
    { name: 'Josh Allen', position: 'QB', team: 'BUF' },
    { name: 'Christian McCaffrey', position: 'RB', team: 'SF' },
    { name: 'Derrick Henry', position: 'RB', team: 'TEN' },
    { name: 'Cooper Kupp', position: 'WR', team: 'LAR' },
    { name: 'Tyreek Hill', position: 'WR', team: 'MIA' },
    { name: 'Travis Kelce', position: 'TE', team: 'KC' },
    { name: 'Breece Hall', position: 'FLEX', team: 'NYJ' },
    { name: 'Cowboys', position: 'D/ST', team: 'DAL' },
    { name: 'Justin Tucker', position: 'K', team: 'BAL' }
  ];

  const opponentTeam = [
    { name: 'Patrick Mahomes', position: 'QB', team: 'KC' },
    { name: 'Austin Ekeler', position: 'RB', team: 'LAC' },
    { name: 'Saquon Barkley', position: 'RB', team: 'NYG' },
    { name: 'Stefon Diggs', position: 'WR', team: 'BUF' },
    { name: 'Davante Adams', position: 'WR', team: 'LV' },
    { name: 'Mark Andrews', position: 'TE', team: 'BAL' },
    { name: 'Deebo Samuel', position: 'FLEX', team: 'SF' },
    { name: '49ers', position: 'D/ST', team: 'SF' },
    { name: 'Daniel Carlson', position: 'K', team: 'LV' }
  ];

  const handleSimulate = async () => {
    setIsSimulating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      console.log('Simulating matchup for year:', selectedYear);
      console.log('Your team:', yourTeam);
      console.log('Opponent team:', opponentTeam);
      setIsSimulating(false);
      
      // For now, just log - we'll implement the real simulation in Day 4-5
      alert(`Simulation complete! (This will show real results soon)\nYear: ${selectedYear}\nYour team vs Opponent`);
    }, 2000);
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
            See how your current matchup would have played out in previous seasons
          </p>
        </div>

        {/* Year Selector */}
        <YearSelect 
          selectedYear={selectedYear} 
          onYearChange={setSelectedYear} 
        />

        {/* Scoreboard */}
        <Scoreboard 
          yourScore={0} 
          opponentScore={0} 
          winner={null}
        />

        {/* Main Matchup Layout - Side by Side like ESPN */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Your Team (LEFT) */}
          <TeamColumn 
            teamName="Your Team" 
            players={yourTeam} 
            isOpponent={false}
          />

          {/* Opponent Team (RIGHT) */}
          <TeamColumn 
            teamName="Opponent" 
            players={opponentTeam} 
            isOpponent={true}
          />
        </div>

        {/* Simulate Button */}
        <SimulateButton 
          onClick={handleSimulate}
          isLoading={isSimulating}
          disabled={false}
        />

        {/* Development Info */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-green-400 mb-2">🚧 Development Status</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <div>✅ Day 1: Frontend ↔ Backend Communication</div>
            <div>✅ Day 2: Dark Mode UI Layout (Current)</div>
            <div>⏳ Day 3: Player Data Integration</div>
            <div>⏳ Day 4: Scoring Engine</div>
            <div>⏳ Day 5: Real Simulation</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;