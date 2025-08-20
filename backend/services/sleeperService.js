// sleeperService.js
// Handles fetching & caching NFL data from Sleeper API
// Maps Sleeper raw stats → your scoring engine format

const axios = require('axios');
const SLEEPER_BASE_URL = "https://api.sleeper.app/v1";

let playerCache = null; // store players in memory
let lastFetchTime = null;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

// --- 1. Fetch and cache all NFL players ---
async function getAllPlayers() {
  const now = Date.now();
  if (playerCache && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
    return playerCache;
  }

  const response = await axios.get(`${SLEEPER_BASE_URL}/players/nfl`);
  const data = response.data;

  // Map players by name for easy lookup - only include active players with teams
  playerCache = Object.values(data).reduce((map, player) => {
    // Only include players who have a name, position, and are on a team
    if (player.full_name && player.position && player.team && player.team !== 'FA') {
      // Skip players who are clearly inactive (no team, practice squad, etc.)
      if (player.active === false) return map;
      
      map[player.full_name.toLowerCase()] = {
        id: player.player_id,
        name: player.full_name,
        position: player.position,
        team: player.team,
        active: player.active
      };
    }
    return map;
  }, {});

  // Add team defenses manually since Sleeper API doesn't include them
  const nflTeams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 'LV', 'LAC', 'LAR', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS'];
  
  nflTeams.forEach(team => {
    playerCache[`${team} Defense`.toLowerCase()] = {
      id: `DEF_${team}`,
      name: `${team} Defense`,
      position: 'DEF',
      team: team,
      active: true
    };
  });

  lastFetchTime = now;
  return playerCache;
}

// --- 2. Fetch weekly stats for all players ---
async function getWeeklyStats(year, week) {
  try {
    console.log(`Fetching stats for ${year} Week ${week}`);
    const response = await axios.get(`${SLEEPER_BASE_URL}/stats/nfl/${year}/${week}`);
    const data = response.data;
    console.log(`Stats response keys:`, Object.keys(data).slice(0, 10)); // Log first 10 keys
    
    // Log a sample of the actual stats data structure
    if (Object.keys(data).length > 0) {
      const firstPlayerId = Object.keys(data)[0];
      const firstPlayerStats = data[firstPlayerId];
      console.log(`Sample stats structure for player ID ${firstPlayerId}:`, firstPlayerStats);
      console.log(`Sample stats keys:`, Object.keys(firstPlayerStats));
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching stats for ${year} Week ${week}:`, error.message);
    // Return empty object if stats not available for this week/year
    return {};
  }
}

// --- 3. Map Sleeper stats → your scoring system fields ---
function mapSleeperStatsToScoring(playerStats) {
  if (!playerStats) {
    console.log('❌ No player stats provided to mapSleeperStatsToScoring');
    return null;
  }

  console.log('🔍 Mapping stats for player:', playerStats);
  console.log('Available stats keys:', Object.keys(playerStats));

  const mappedStats = {
    // QB stats
    passingYards: playerStats.pass_yds || 0,
    passingTDs: playerStats.pass_td || 0,
    interceptions: playerStats.pass_int || 0,
    passing2PT: playerStats.pass_2pt || 0,

    // Rushing
    rushingYards: playerStats.rush_yd || 0,
    rushingTDs: playerStats.rush_td || 0,
    rushing2PT: playerStats.rush_2pt || 0,

    // Receiving
    receptions: playerStats.rec || 0,
    receivingYards: playerStats.rec_yd || 0,
    receivingTDs: playerStats.rec_td || 0,
    receiving2PT: playerStats.rec_2pt || 0,

    // Misc
    fumbles: playerStats.fum_lost || 0,

    // Kicker
    fieldGoals: playerStats.fg || 0, // total made
    extraPoints: playerStats.xpm || 0,

    // Defense
    defensePointsAllowed: playerStats.pts_allow || 0,
    defenseSacks: playerStats.def_sack || 0,
    defenseInterceptions: playerStats.def_int || 0,
    defenseFumbleRecoveries: playerStats.def_fum_rec || 0,
    defenseSafeties: playerStats.def_safe || 0,
    defenseTDs: playerStats.def_td || 0
  };

  console.log('✅ Mapped stats result:', mappedStats);
  return mappedStats;
}

// --- 4. Get team stats ready for scoring ---
async function getTeamStats(players, year, week) {
  try {
    console.log(`=== BACKEND: Getting team stats for ${year} Week ${week} ===`);
    console.log('Players requested:', players.map(p => p.name));
    
    const allPlayers = await getAllPlayers();
    const weeklyStats = await getWeeklyStats(year, week);
    
    console.log(`Total players in cache: ${Object.keys(allPlayers).length}`);
    console.log(`Weekly stats available for: ${Object.keys(weeklyStats).length} players`);

    const teamStats = {};

    players.forEach(player => {
      if (!player || !player.name) {
        console.log(`Skipping invalid player:`, player);
        return;
      }
      
      const playerKey = player.name.toLowerCase();
      const sleeperPlayer = allPlayers[playerKey];
      
      if (!sleeperPlayer) {
        console.log(`❌ Player not found in cache: ${player.name}`);
        return;
      }
      
      console.log(`✅ Found player: ${player.name} (ID: ${sleeperPlayer.id})`);
      
      // Try multiple ways to find stats for this player
      let rawStats = weeklyStats[sleeperPlayer.id];
      
      // If not found by ID, try to find by name (case-insensitive)
      if (!rawStats) {
        console.log(`🔍 Stats not found by ID ${sleeperPlayer.id}, trying to find by name...`);
        const statsKeys = Object.keys(weeklyStats);
        for (const statsKey of statsKeys) {
          const stats = weeklyStats[statsKey];
          // Check if this stats object has a name field that matches our player
          if (stats && stats.player_name && stats.player_name.toLowerCase() === player.name.toLowerCase()) {
            console.log(`🎯 Found stats by name match: ${statsKey}`);
            rawStats = stats;
            break;
          }
        }
      }
      
      // If still not found, try to find by searching through all stats for matching player info
      if (!rawStats) {
        console.log(`🔍 Stats not found by name, searching through all stats...`);
        const statsKeys = Object.keys(weeklyStats);
        for (const statsKey of statsKeys) {
          const stats = weeklyStats[statsKey];
          // Look for any field that might contain the player name
          if (stats) {
            const statsValues = Object.values(stats).join(' ').toLowerCase();
            if (statsValues.includes(player.name.toLowerCase())) {
              console.log(`🎯 Found stats by content search: ${statsKey}`);
              rawStats = stats;
              break;
            }
          }
        }
      }
      
      if (rawStats) {
        console.log(`📊 Raw stats found for ${player.name}:`, rawStats);
        const mappedStats = mapSleeperStatsToScoring(rawStats);
        console.log(`🎯 Mapped stats for ${player.name}:`, mappedStats);
        teamStats[player.name] = mappedStats;
      } else {
        console.log(`❌ No raw stats found for ${player.name} (ID: ${sleeperPlayer.id})`);
        console.log(`Available player IDs in stats:`, Object.keys(weeklyStats).slice(0, 10));
        console.log(`Sample stats structure:`, weeklyStats[Object.keys(weeklyStats)[0]]);
      }
    });

    console.log(`=== BACKEND: Final team stats ===`);
    console.log('Team stats returned:', teamStats);
    console.log('Stats keys:', Object.keys(teamStats));
    
    return teamStats;
  } catch (error) {
    console.error('❌ ERROR in getTeamStats:', error);
    return {};
  }
}

// Get all players for a specific year (wrapper for getAllPlayers)
async function getPlayers(year) {
  try {
    const allPlayers = await getAllPlayers();
    // Filter by year if needed, but Sleeper API gives current players
    return Object.values(allPlayers);
  } catch (error) {
    console.error('Error in sleeperService getPlayers:', error);
    return [];
  }
}

// Get player stats for a specific year and week
async function getPlayerStats(playerName, year, week) {
  try {
    console.log(`Getting stats for ${playerName} (${year}, Week ${week})`);
    const allPlayers = await getAllPlayers();
    const weeklyStats = await getWeeklyStats(year, week);
    
    // Find the player by name
    const playerKey = playerName.toLowerCase();
    const sleeperPlayer = allPlayers[playerKey];
    
    if (!sleeperPlayer) {
      console.log(`Player not found: ${playerName}`);
      return null;
    }
    
    console.log(`Found player: ${sleeperPlayer.name} (ID: ${sleeperPlayer.id})`);
    console.log(`Weekly stats available for ${Object.keys(weeklyStats).length} players`);
    
    const rawStats = weeklyStats[sleeperPlayer.id];
    if (rawStats) {
      console.log(`Raw stats found for ${playerName}:`, rawStats);
      const mappedStats = mapSleeperStatsToScoring(rawStats);
      console.log(`Mapped stats for ${playerName}:`, mappedStats);
      return mappedStats;
    } else {
      console.log(`No raw stats found for ${playerName} (ID: ${sleeperPlayer.id})`);
      console.log(`Available player IDs in stats:`, Object.keys(weeklyStats).slice(0, 10));
    }
    
    return null;
  } catch (error) {
    console.error('Error in sleeperService getPlayerStats:', error);
    return null;
  }
}

// Check if player has stats for a specific year and week
async function hasStatsForYear(playerName, year, week) {
  try {
    const stats = await getPlayerStats(playerName, year, week);
    return stats !== null;
  } catch (error) {
    console.error('Error in sleeperService hasStatsForYear:', error);
    return false;
  }
}

// Get available years
function getAvailableYears() {
  // Return years that have historical data available
  return [2019, 2020, 2021, 2022, 2023];
}

// CommonJS exports
module.exports = {
  getAllPlayers,
  getWeeklyStats,
  getTeamStats,
  getPlayers,
  getPlayerStats,
  hasStatsForYear,
  getAvailableYears
};