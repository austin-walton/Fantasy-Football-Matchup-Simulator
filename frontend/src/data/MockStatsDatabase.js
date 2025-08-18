// Real NFL API service - replaces mock data
import apiService from '../services/api';

// Get player stats for a specific year and week
export const getPlayerStats = async (playerName, year, week) => {
  try {
    return await apiService.getPlayerStats(playerName, year, week);
  } catch (error) {
    console.error('Error getting player stats:', error);
    return null;
  }
};

// Check if a player has stats for a specific year and week
export const hasStatsForYear = async (playerName, year, week) => {
  try {
    return await apiService.hasStatsForYear(playerName, year, week);
  } catch (error) {
    console.error('Error checking player stats:', error);
    return false;
  }
};

// Get all players for a specific year
export const getPlayers = async (year) => {
  try {
    return await apiService.getPlayers(year);
  } catch (error) {
    console.error('Error getting players:', error);
    return [];
  }
};

// Get players by position for a specific year
export const getPlayersByPosition = async (year, position) => {
  try {
    return await apiService.getPlayersByPosition(year, position);
  } catch (error) {
    console.error('Error getting players by position:', error);
    return [];
  }
};

// Search players for a specific year
export const searchPlayers = async (year, searchTerm) => {
  try {
    return await apiService.searchPlayers(year, searchTerm);
  } catch (error) {
    console.error('Error searching players:', error);
    return [];
  }
};

// Get team stats for simulation (now supports weekly stats)
export const getTeamStats = async (players, year, week) => {
  try {
    return await apiService.getTeamStats(players, year, week);
  } catch (error) {
    console.error('Error getting team stats:', error);
    return {};
  }
};

// Get available years
export const getAvailableYears = async () => {
  try {
    return await apiService.getAvailableYears();
  } catch (error) {
    console.error('Error getting available years:', error);
    return [2020, 2021, 2022, 2023, 2024]; // Fallback to default years
  }
};

// Legacy export for backward compatibility
export const MOCK_HISTORICAL_STATS = {};