const nflApiService = require('./nflApiService');

class PlayerService {
  // Get all players for a specific year
  async getPlayers(year) {
    try {
      return await nflApiService.getPlayers(year);
    } catch (error) {
      console.error('Error in player service getPlayers:', error);
      throw error;
    }
  }

  // Get players filtered by position
  async getPlayersByPosition(year, position) {
    try {
      const allPlayers = await this.getPlayers(year);
      return allPlayers.filter(player => player.position === position);
    } catch (error) {
      console.error('Error in player service getPlayersByPosition:', error);
      throw error;
    }
  }

  // Get players filtered by team
  async getPlayersByTeam(year, team) {
    try {
      const allPlayers = await this.getPlayers(year);
      return allPlayers.filter(player => player.team === team);
    } catch (error) {
      console.error('Error in player service getPlayersByTeam:', error);
      throw error;
    }
  }

  // Search players by name (case-insensitive)
  async searchPlayers(year, searchTerm) {
    try {
      const allPlayers = await this.getPlayers(year);
      const term = searchTerm.toLowerCase();
      return allPlayers.filter(player => 
        player.name.toLowerCase().includes(term) ||
        player.team.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error in player service searchPlayers:', error);
      throw error;
    }
  }

  // Get player stats for a specific year and week
  async getPlayerStats(playerName, year, week) {
    try {
      return await nflApiService.getPlayerStats(playerName, year, week);
    } catch (error) {
      console.error('Error in player service getPlayerStats:', error);
      return null;
    }
  }

  // Check if player has stats for a specific year and week
  async hasStatsForYear(playerName, year, week) {
    try {
      return await nflApiService.hasStatsForYear(playerName, year, week);
    } catch (error) {
      console.error('Error in player service hasStatsForYear:', error);
      return false;
    }
  }

  // Get available years
  getAvailableYears() {
    return nflApiService.getAvailableYears();
  }

  // Get all player stats for a team (used for simulation) - now supports weekly stats
  async getTeamStats(players, year, week) {
    try {
      console.log('=== BACKEND: Getting team weekly stats ===');
      console.log('Players requested:', players);
      console.log('Year requested:', year);
      console.log('Week requested:', week);
      
      const teamStats = {};
      
      for (const player of players) {
        if (player && player.name) {
          console.log(`Fetching weekly stats for ${player.name} (${year}, Week ${week})`);
          const stats = await this.getPlayerStats(player.name, year, week);
          if (stats) {
            teamStats[player.name] = stats;
            console.log(`✅ Found weekly stats for ${player.name}:`, stats);
          } else {
            console.log(`❌ No weekly stats found for ${player.name}`);
          }
        } else {
          console.log(`⚠️ Invalid player data:`, player);
        }
      }
      
      console.log('=== BACKEND: Final team weekly stats ===');
      console.log('Weekly stats returned:', teamStats);
      return teamStats;
    } catch (error) {
      console.error('❌ ERROR in player service getTeamStats:', error);
      return {};
    }
  }
}

module.exports = new PlayerService();
