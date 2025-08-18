const express = require('express');
const router = express.Router();
const playerService = require('../services/playerService');

// Default route - show available years and API info
router.get('/', async (req, res) => {
  try {
    const years = playerService.getAvailableYears();
    res.json({
      message: 'Fantasy Football Player API',
      description: 'Get NFL player data and stats for fantasy football simulations',
      availableYears: years,
      endpoints: {
        getAllPlayers: '/:year',
        getPlayersByPosition: '/:year/position/:position',
        getPlayersByTeam: '/:year/team/:team',
        searchPlayers: '/:year/search?q=:searchTerm',
        getPlayerStats: '/:year/stats/:playerName',
        checkPlayerStats: '/:year/hasStats/:playerName',
        getTeamStats: '/:year/week/:week/team-stats (POST)'
      },
      example: 'Try /2023 to get all players for 2023'
    });
  } catch (error) {
    console.error('Error in GET /players:', error);
    res.status(500).json({ error: 'Failed to fetch API information' });
  }
});

// Get available years - must come before /:year route
router.get('/years/available', async (req, res) => {
  try {
    const years = playerService.getAvailableYears();
    res.json({ years });
  } catch (error) {
    console.error('Error in GET /players/years/available:', error);
    res.status(500).json({ error: 'Failed to fetch available years' });
  }
});

// Get all players for a specific year
router.get('/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const yearNum = parseInt(year);
    
    if (isNaN(yearNum)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }
    
    const players = await playerService.getPlayers(yearNum);
    res.json(players);
  } catch (error) {
    console.error('Error in GET /players/:year:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Get players by position for a specific year
router.get('/:year/position/:position', async (req, res) => {
  try {
    const { year, position } = req.params;
    const yearNum = parseInt(year);
    
    if (isNaN(yearNum)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }
    
    const players = await playerService.getPlayersByPosition(yearNum, position);
    res.json(players);
  } catch (error) {
    console.error('Error in GET /players/:year/position/:position:', error);
    res.status(500).json({ error: 'Failed to fetch players by position' });
  }
});

// Get players by team for a specific year
router.get('/:year/team/:team', async (req, res) => {
  try {
    const { year, team } = req.params;
    const yearNum = parseInt(year);
    
    if (isNaN(yearNum)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }
    
    const players = await playerService.getPlayersByTeam(yearNum, team);
    res.json(players);
  } catch (error) {
    console.error('Error in GET /players/:year/team/:team:', error);
    res.status(500).json({ error: 'Failed to fetch players by team' });
  }
});

// Search players for a specific year
router.get('/:year/search', async (req, res) => {
  try {
    const { year } = req.params;
    const { q: searchTerm } = req.query;
    const yearNum = parseInt(year);
    
    if (isNaN(yearNum)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }
    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    const players = await playerService.searchPlayers(yearNum, searchTerm);
    res.json(players);
  } catch (error) {
    console.error('Error in GET /players/:year/search:', error);
    res.status(500).json({ error: 'Failed to search players' });
  }
});

// Get player stats for a specific year and week
router.get('/:year/stats/:playerName', async (req, res) => {
  try {
    const { year, playerName } = req.params;
    const { week } = req.query; // Get week from query string
    const yearNum = parseInt(year);
    const weekNum = week ? parseInt(week) : 1; // Default to week 1 if not specified
    
    if (isNaN(yearNum)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }
    
    const stats = await playerService.getPlayerStats(playerName, yearNum, weekNum);
    
    if (stats === null) {
      return res.status(404).json({ error: 'Player stats not found' });
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error in GET /players/:year/stats/:playerName:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

// Check if player has stats for a specific year and week
router.get('/:year/hasStats/:playerName', async (req, res) => {
  try {
    const { year, playerName } = req.params;
    const { week } = req.query; // Get week from query string
    const yearNum = parseInt(year);
    const weekNum = week ? parseInt(week) : 1; // Default to week 1 if not specified
    
    if (isNaN(yearNum)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }
    
    const hasStats = await playerService.hasStatsForYear(playerName, yearNum, weekNum);
    res.json({ hasStats });
  } catch (error) {
    console.error('Error in GET /players/:year/hasStats/:playerName:', error);
    res.status(500).json({ error: 'Failed to check player stats' });
  }
});

// Get team stats for simulation
router.post('/:year/week/:week/team-stats', async (req, res) => {
  try {
    const { year, week } = req.params;
    const { players } = req.body;
    const yearNum = parseInt(year);
    
    if (isNaN(yearNum)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }
    
    if (!Array.isArray(players)) {
      return res.status(400).json({ error: 'Players array is required' });
    }
    
    const teamStats = await playerService.getTeamStats(players, yearNum, parseInt(week));
    res.json(teamStats);
  } catch (error) {
    console.error('Error in POST /players/:year/week/:week/team-stats:', error);
    res.status(500).json({ error: 'Failed to fetch team stats' });
  }
});

module.exports = router;
