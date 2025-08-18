const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }

  // Get all players for a specific year
  async getPlayers(year) {
    return this.apiCall(`/players/${year}`);
  }

  // Get players by position for a specific year
  async getPlayersByPosition(year, position) {
    return this.apiCall(`/players/${year}/position/${position}`);
  }

  // Get players by team for a specific year
  async getPlayersByTeam(year, team) {
    return this.apiCall(`/players/${year}/team/${team}`);
  }

  // Search players for a specific year
  async searchPlayers(year, searchTerm) {
    return this.apiCall(`/players/${year}/search?q=${encodeURIComponent(searchTerm)}`);
  }

  // Get player stats for a specific year and week
  async getPlayerStats(playerName, year, week) {
    return this.apiCall(`/players/${year}/stats/${encodeURIComponent(playerName)}?week=${week}`);
  }

  // Check if player has stats for a specific year and week
  async hasStatsForYear(playerName, year, week) {
    const response = await this.apiCall(`/players/${year}/hasStats/${encodeURIComponent(playerName)}?week=${week}`);
    return response.hasStats;
  }

  // Get available years
  async getAvailableYears() {
    const response = await this.apiCall('/players/years/available');
    return response.years;
  }

  // Get team stats for simulation (now supports weekly stats)
  async getTeamStats(players, year, week) {
    return this.apiCall(`/players/${year}/week/${week}/team-stats`, {
      method: 'POST',
      body: JSON.stringify({ players }),
    });
  }

  // Health check
  async healthCheck() {
    return this.apiCall('/health');
  }
}

export default new ApiService();
