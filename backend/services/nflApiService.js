const axios = require('axios');
const NodeCache = require('node-cache');

// Cache for 1 hour to reduce API calls
const cache = new NodeCache({ stdTTL: 3600 });

class NFLApiService {
  constructor() {
    this.baseUrl = 'https://www.pro-football-reference.com';
    this.cache = cache;
  }

  // Get all NFL players for a specific year
  async getPlayers(year) {
    const cacheKey = `players_${year}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Sports Reference doesn't have a direct API, so we'll scrape the stats pages
      // This is a simplified approach - in production you might want to use their paid API
      const players = await this.scrapePlayerData(year);
      this.cache.set(cacheKey, players);
      return players;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw new Error('Failed to fetch player data');
    }
  }

  // Get player stats for a specific year and week
  async getPlayerStats(playerName, year, week) {
    const cacheKey = `stats_${playerName}_${year}_${week}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log(`📋 Cached weekly stats found for ${playerName} (${year}, Week ${week})`);
      return cached;
    }

    try {
      console.log(`🔍 Fetching fresh weekly stats for ${playerName} (${year}, Week ${week})`);
      const stats = await this.scrapePlayerStats(playerName, year, week);
      if (stats) {
        console.log(`✅ Weekly stats found for ${playerName}:`, stats);
        this.cache.set(cacheKey, stats);
      } else {
        console.log(`❌ No weekly stats found for ${playerName} (${year}, Week ${week})`);
      }
      return stats;
    } catch (error) {
      console.error(`❌ Error fetching weekly stats for ${playerName}:`, error);
      return null;
    }
  }

  // Check if player has stats for a specific year and week
  async hasStatsForYear(playerName, year, week) {
    const stats = await this.getPlayerStats(playerName, year, week);
    return stats !== null;
  }

  // Scrape player data from Sports Reference
  async scrapePlayerData(year) {
    try {
      // Comprehensive NFL player database - much larger than before
      const players = [
        // QBs - Expanded list
        { name: 'Josh Allen', position: 'QB', team: 'BUF', hasStats: { [year]: true } },
        { name: 'Patrick Mahomes', position: 'QB', team: 'KC', hasStats: { [year]: true } },
        { name: 'Lamar Jackson', position: 'QB', team: 'BAL', hasStats: { [year]: true } },
        { name: 'Jalen Hurts', position: 'QB', team: 'PHI', hasStats: { [year]: true } },
        { name: 'Dak Prescott', position: 'QB', team: 'DAL', hasStats: { [year]: true } },
        { name: 'Justin Herbert', position: 'QB', team: 'LAC', hasStats: { [year]: true } },
        { name: 'Joe Burrow', position: 'QB', team: 'CIN', hasStats: { [year]: true } },
        { name: 'Tua Tagovailoa', position: 'QB', team: 'MIA', hasStats: { [year]: true } },
        { name: 'Kirk Cousins', position: 'QB', team: 'MIN', hasStats: { [year]: true } },
        { name: 'Geno Smith', position: 'QB', team: 'SEA', hasStats: { [year]: true } },
        { name: 'Baker Mayfield', position: 'QB', team: 'TB', hasStats: { [year]: true } },
        { name: 'Jared Goff', position: 'QB', team: 'DET', hasStats: { [year]: true } },
        { name: 'Russell Wilson', position: 'QB', team: 'PIT', hasStats: { [year]: true } },
        { name: 'Deshaun Watson', position: 'QB', team: 'CLE', hasStats: { [year]: true } },
        { name: 'Kyler Murray', position: 'QB', team: 'ARI', hasStats: { [year]: true } },
        { name: 'Trevor Lawrence', position: 'QB', team: 'JAX', hasStats: { [year]: true } },
        { name: 'Sam Howell', position: 'QB', team: 'WAS', hasStats: { [year]: true } },
        { name: 'Bryce Young', position: 'QB', team: 'CAR', hasStats: { [year]: true } },
        { name: 'C.J. Stroud', position: 'QB', team: 'HOU', hasStats: { [year]: true } },
        { name: 'Anthony Richardson', position: 'QB', team: 'IND', hasStats: { [year]: true } },
        
        // RBs - Expanded list
        { name: 'Christian McCaffrey', position: 'RB', team: 'SF', hasStats: { [year]: true } },
        { name: 'Derrick Henry', position: 'RB', team: 'TEN', hasStats: { [year]: true } },
        { name: 'Austin Ekeler', position: 'RB', team: 'LAC', hasStats: { [year]: true } },
        { name: 'Saquon Barkley', position: 'RB', team: 'NYG', hasStats: { [year]: true } },
        { name: 'Alvin Kamara', position: 'RB', team: 'NO', hasStats: { [year]: true } },
        { name: 'Nick Chubb', position: 'RB', team: 'CLE', hasStats: { [year]: true } },
        { name: 'Jonathan Taylor', position: 'RB', team: 'IND', hasStats: { [year]: true } },
        { name: 'Dalvin Cook', position: 'RB', team: 'NYJ', hasStats: { [year]: true } },
        { name: 'Aaron Jones', position: 'RB', team: 'GB', hasStats: { [year]: true } },
        { name: 'Joe Mixon', position: 'RB', team: 'CIN', hasStats: { [year]: true } },
        { name: 'Bijan Robinson', position: 'RB', team: 'ATL', hasStats: { [year]: true } },
        { name: 'Jahmyr Gibbs', position: 'RB', team: 'DET', hasStats: { [year]: true } },
        { name: 'Rachaad White', position: 'RB', team: 'TB', hasStats: { [year]: true } },
        { name: 'Isiah Pacheco', position: 'RB', team: 'KC', hasStats: { [year]: true } },
        { name: 'James Conner', position: 'RB', team: 'ARI', hasStats: { [year]: true } },
        { name: 'Brian Robinson Jr.', position: 'RB', team: 'WAS', hasStats: { [year]: true } },
        { name: 'D\'Andre Swift', position: 'RB', team: 'CHI', hasStats: { [year]: true } },
        { name: 'Tony Pollard', position: 'RB', team: 'DAL', hasStats: { [year]: true } },
        { name: 'Miles Sanders', position: 'RB', team: 'CAR', hasStats: { [year]: true } },
        { name: 'David Montgomery', position: 'RB', team: 'DET', hasStats: { [year]: true } },
        { name: 'Rhamondre Stevenson', position: 'RB', team: 'NE', hasStats: { [year]: true } },
        { name: 'Kenneth Walker III', position: 'RB', team: 'SEA', hasStats: { [year]: true } },
        { name: 'Cam Akers', position: 'RB', team: 'MIN', hasStats: { [year]: true } },
        { name: 'Zamir White', position: 'RB', team: 'LV', hasStats: { [year]: true } },
        { name: 'Chuba Hubbard', position: 'RB', team: 'CAR', hasStats: { [year]: true } },
        { name: 'Tyler Allgeier', position: 'RB', team: 'ATL', hasStats: { [year]: true } },
        
        // WRs - Expanded list
        { name: 'Cooper Kupp', position: 'WR', team: 'LAR', hasStats: { [year]: true } },
        { name: 'Tyreek Hill', position: 'WR', team: 'MIA', hasStats: { [year]: true } },
        { name: 'Stefon Diggs', position: 'WR', team: 'BUF', hasStats: { [year]: true } },
        { name: 'Davante Adams', position: 'WR', team: 'LV', hasStats: { [year]: true } },
        { name: 'A.J. Brown', position: 'WR', team: 'PHI', hasStats: { [year]: true } },
        { name: 'CeeDee Lamb', position: 'WR', team: 'DAL', hasStats: { [year]: true } },
        { name: 'Justin Jefferson', position: 'WR', team: 'MIN', hasStats: { [year]: true } },
        { name: 'Ja\'Marr Chase', position: 'WR', team: 'CIN', hasStats: { [year]: true } },
        { name: 'Deebo Samuel', position: 'WR', team: 'SF', hasStats: { [year]: true } },
        { name: 'Mike Evans', position: 'WR', team: 'TB', hasStats: { [year]: true } },
        { name: 'Amari Cooper', position: 'WR', team: 'CLE', hasStats: { [year]: true } },
        { name: 'DK Metcalf', position: 'WR', team: 'SEA', hasStats: { [year]: true } },
        { name: 'Tyler Lockett', position: 'WR', team: 'SEA', hasStats: { [year]: true } },
        { name: 'Brandon Aiyuk', position: 'WR', team: 'SF', hasStats: { [year]: true } },
        { name: 'Chris Olave', position: 'WR', team: 'NO', hasStats: { [year]: true } },
        { name: 'Garrett Wilson', position: 'WR', team: 'NYJ', hasStats: { [year]: true } },
        { name: 'Drake London', position: 'WR', team: 'ATL', hasStats: { [year]: true } },
        { name: 'Jahan Dotson', position: 'WR', team: 'WAS', hasStats: { [year]: true } },
        { name: 'Christian Watson', position: 'WR', team: 'GB', hasStats: { [year]: true } },
        { name: 'Romeo Doubs', position: 'WR', team: 'GB', hasStats: { [year]: true } },
        { name: 'Kadarius Toney', position: 'WR', team: 'KC', hasStats: { [year]: true } },
        { name: 'Marquise Brown', position: 'WR', team: 'ARI', hasStats: { [year]: true } },
        { name: 'Rondale Moore', position: 'WR', team: 'ARI', hasStats: { [year]: true } },
        { name: 'Courtland Sutton', position: 'WR', team: 'DEN', hasStats: { [year]: true } },
        { name: 'Jerry Jeudy', position: 'WR', team: 'DEN', hasStats: { [year]: true } },
        { name: 'Diontae Johnson', position: 'WR', team: 'PIT', hasStats: { [year]: true } },
        { name: 'George Pickens', position: 'WR', team: 'PIT', hasStats: { [year]: true } },
        { name: 'Allen Lazard', position: 'WR', team: 'NYJ', hasStats: { [year]: true } },
        { name: 'Rashod Bateman', position: 'WR', team: 'BAL', hasStats: { [year]: true } },
        { name: 'Zay Flowers', position: 'WR', team: 'BAL', hasStats: { [year]: true } },
        { name: 'Jordan Addison', position: 'WR', team: 'MIN', hasStats: { [year]: true } },
        { name: 'Quentin Johnston', position: 'WR', team: 'LAC', hasStats: { [year]: true } },
        { name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', hasStats: { [year]: true } },
        
        // TEs - Expanded list
        { name: 'Travis Kelce', position: 'TE', team: 'KC', hasStats: { [year]: true } },
        { name: 'Mark Andrews', position: 'TE', team: 'BAL', hasStats: { [year]: true } },
        { name: 'George Kittle', position: 'TE', team: 'SF', hasStats: { [year]: true } },
        { name: 'Darren Waller', position: 'TE', team: 'NYG', hasStats: { [year]: true } },
        { name: 'T.J. Hockenson', position: 'TE', team: 'MIN', hasStats: { [year]: true } },
        { name: 'Evan Engram', position: 'TE', team: 'JAX', hasStats: { [year]: true } },
        { name: 'Dallas Goedert', position: 'TE', team: 'PHI', hasStats: { [year]: true } },
        { name: 'Kyle Pitts', position: 'TE', team: 'ATL', hasStats: { [year]: true } },
        { name: 'Pat Freiermuth', position: 'TE', team: 'PIT', hasStats: { [year]: true } },
        { name: 'Cole Kmet', position: 'TE', team: 'CHI', hasStats: { [year]: true } },
        { name: 'Sam LaPorta', position: 'TE', team: 'DET', hasStats: { [year]: true } },
        { name: 'Michael Mayer', position: 'TE', team: 'LV', hasStats: { [year]: true } },
        { name: 'Luke Musgrave', position: 'TE', team: 'GB', hasStats: { [year]: true } },
        { name: 'Dalton Kincaid', position: 'TE', team: 'BUF', hasStats: { [year]: true } },
        { name: 'Jake Ferguson', position: 'TE', team: 'DAL', hasStats: { [year]: true } },
        { name: 'Chigoziem Okonkwo', position: 'TE', team: 'TEN', hasStats: { [year]: true } },
        { name: 'Trey McBride', position: 'TE', team: 'ARI', hasStats: { [year]: true } },
        { name: 'Greg Dulcich', position: 'TE', team: 'DEN', hasStats: { [year]: true } },
        { name: 'Noah Fant', position: 'TE', team: 'SEA', hasStats: { [year]: true } },
        { name: 'Will Dissly', position: 'TE', team: 'SEA', hasStats: { [year]: true } },
        { name: 'Gerald Everett', position: 'TE', team: 'LAC', hasStats: { [year]: true } },
        { name: 'Donald Parham Jr.', position: 'TE', team: 'LAC', hasStats: { [year]: true } },
        { name: 'Hunter Henry', position: 'TE', team: 'NE', hasStats: { [year]: true } },
        { name: 'Mike Gesicki', position: 'TE', team: 'NE', hasStats: { [year]: true } },
        { name: 'Jonnu Smith', position: 'TE', team: 'MIA', hasStats: { [year]: true } },
        { name: 'Durham Smythe', position: 'TE', team: 'MIA', hasStats: { [year]: true } },
        { name: 'Cade Otton', position: 'TE', team: 'TB', hasStats: { [year]: true } },
        { name: 'Peyton Hendershot', position: 'TE', team: 'DAL', hasStats: { [year]: true } },
        { name: 'Brock Bowers', position: 'TE', team: 'LV', hasStats: { [year]: true } },
        
        // DEF - All NFL teams
        { name: 'Cowboys', position: 'DEF', team: 'DAL', hasStats: { [year]: true } },
        { name: '49ers', position: 'DEF', team: 'SF', hasStats: { [year]: true } },
        { name: 'Ravens', position: 'DEF', team: 'BAL', hasStats: { [year]: true } },
        { name: 'Bills', position: 'DEF', team: 'BUF', hasStats: { [year]: true } },
        { name: 'Jets', position: 'DEF', team: 'NYJ', hasStats: { [year]: true } },
        { name: 'Patriots', position: 'DEF', team: 'NE', hasStats: { [year]: true } },
        { name: 'Eagles', position: 'DEF', team: 'PHI', hasStats: { [year]: true } },
        { name: 'Chiefs', position: 'DEF', team: 'KC', hasStats: { [year]: true } },
        { name: 'Bengals', position: 'DEF', team: 'CIN', hasStats: { [year]: true } },
        { name: 'Steelers', position: 'DEF', team: 'PIT', hasStats: { [year]: true } },
        { name: 'Browns', position: 'DEF', team: 'CLE', hasStats: { [year]: true } },
        { name: 'Titans', position: 'DEF', team: 'TEN', hasStats: { [year]: true } },
        { name: 'Colts', position: 'DEF', team: 'IND', hasStats: { [year]: true } },
        { name: 'Texans', position: 'DEF', team: 'HOU', hasStats: { [year]: true } },
        { name: 'Jaguars', position: 'DEF', team: 'JAX', hasStats: { [year]: true } },
        { name: 'Chargers', position: 'DEF', team: 'LAC', hasStats: { [year]: true } },
        { name: 'Raiders', position: 'DEF', team: 'LV', hasStats: { [year]: true } },
        { name: 'Broncos', position: 'DEF', team: 'DEN', hasStats: { [year]: true } },
        { name: 'Giants', position: 'DEF', team: 'NYG', hasStats: { [year]: true } },
        { name: 'Commanders', position: 'DEF', team: 'WAS', hasStats: { [year]: true } },
        { name: 'Falcons', position: 'DEF', team: 'ATL', hasStats: { [year]: true } },
        { name: 'Panthers', position: 'DEF', team: 'CAR', hasStats: { [year]: true } },
        { name: 'Saints', position: 'DEF', team: 'NO', hasStats: { [year]: true } },
        { name: 'Buccaneers', position: 'DEF', team: 'TB', hasStats: { [year]: true } },
        { name: 'Packers', position: 'DEF', team: 'GB', hasStats: { [year]: true } },
        { name: 'Vikings', position: 'DEF', team: 'MIN', hasStats: { [year]: true } },
        { name: 'Bears', position: 'DEF', team: 'CHI', hasStats: { [year]: true } },
        { name: 'Lions', position: 'DEF', team: 'DET', hasStats: { [year]: true } },
        { name: 'Cardinals', position: 'DEF', team: 'ARI', hasStats: { [year]: true } },
        { name: 'Rams', position: 'DEF', team: 'LAR', hasStats: { [year]: true } },
        { name: 'Seahawks', position: 'DEF', team: 'SEA', hasStats: { [year]: true } },
        
        // K - Expanded list
        { name: 'Justin Tucker', position: 'K', team: 'BAL', hasStats: { [year]: true } },
        { name: 'Daniel Carlson', position: 'K', team: 'LV', hasStats: { [year]: true } },
        { name: 'Harrison Butker', position: 'K', team: 'KC', hasStats: { [year]: true } },
        { name: 'Evan McPherson', position: 'K', team: 'CIN', hasStats: { [year]: true } },
        { name: 'Younghoe Koo', position: 'K', team: 'ATL', hasStats: { [year]: true } },
        { name: 'Brandon Aubrey', position: 'K', team: 'DAL', hasStats: { [year]: true } },
        { name: 'Jake Elliott', position: 'K', team: 'PHI', hasStats: { [year]: true } },
        { name: 'Greg Zuerlein', position: 'K', team: 'NYJ', hasStats: { [year]: true } },
        { name: 'Matt Gay', position: 'K', team: 'IND', hasStats: { [year]: true } },
        { name: 'Wil Lutz', position: 'K', team: 'DEN', hasStats: { [year]: true } },
        { name: 'Jason Myers', position: 'K', team: 'SEA', hasStats: { [year]: true } },
        { name: 'Robbie Gould', position: 'K', team: 'FA', hasStats: { [year]: true } },
        { name: 'Mason Crosby', position: 'K', team: 'FA', hasStats: { [year]: true } },
        { name: 'Nick Folk', position: 'K', team: 'FA', hasStats: { [year]: true } },
        { name: 'Graham Gano', position: 'K', team: 'FA', hasStats: { [year]: true } },
        { name: 'Matt Prater', position: 'K', team: 'ARI', hasStats: { [year]: true } },
        { name: 'Cairo Santos', position: 'K', team: 'CHI', hasStats: { [year]: true } },
        { name: 'Ka\'imi Fairbairn', position: 'K', team: 'HOU', hasStats: { [year]: true } },
        { name: 'Riley Patterson', position: 'K', team: 'DET', hasStats: { [year]: true } },
        { name: 'Anders Carlson', position: 'K', team: 'GB', hasStats: { [year]: true } },
        { name: 'Chase McLaughlin', position: 'K', team: 'TB', hasStats: { [year]: true } },
        { name: 'Blake Grupe', position: 'K', team: 'NO', hasStats: { [year]: true } },
        { name: 'Cameron Dicker', position: 'K', team: 'LAC', hasStats: { [year]: true } },
        { name: 'Greg Joseph', position: 'K', team: 'MIN', hasStats: { [year]: true } },
        { name: 'Joey Slye', position: 'K', team: 'WAS', hasStats: { [year]: true } },
        { name: 'Dustin Hopkins', position: 'K', team: 'CLE', hasStats: { [year]: true } },
        { name: 'Chris Boswell', position: 'K', team: 'PIT', hasStats: { [year]: true } },
        { name: 'Jake Moody', position: 'K', team: 'SF', hasStats: { [year]: true } },
        { name: 'Brett Maher', position: 'K', team: 'LAR', hasStats: { [year]: true } },
        { name: 'Eddy Pineiro', position: 'K', team: 'CAR', hasStats: { [year]: true } },
        { name: 'Ryan Succop', position: 'K', team: 'FA', hasStats: { [year]: true } },
        { name: 'Randy Bullock', position: 'K', team: 'FA', hasStats: { [year]: true } }
      ];

      return players;
    } catch (error) {
      console.error('Error scraping player data:', error);
      throw error;
    }
  }

  // Scrape player stats from Sports Reference for a specific week
  async scrapePlayerStats(playerName, year, week) {
    try {
      console.log(`🌐 Scraping weekly stats for ${playerName} (${year}, Week ${week}) from Sports Reference...`);
      
      // TODO: Implement actual Sports Reference web scraping here
      // For now, return mock weekly stats to test the system
      
      // Mock weekly stats - this will be replaced with real scraping
      const mockWeeklyStats = this.getMockWeeklyStats(playerName, year, week);
      
      if (mockWeeklyStats) {
        console.log(`✅ Mock weekly stats found for ${playerName}:`, mockWeeklyStats);
        return mockWeeklyStats;
      } else {
        console.log(`❌ No weekly stats available for ${playerName} (${year}, Week ${week})`);
        return null;
      }
    } catch (error) {
      console.error('Error scraping weekly player stats:', error);
      return null;
    }
  }

  // Get mock weekly stats for testing (will be removed when real scraping is implemented)
  getMockWeeklyStats(playerName, year, week) {
    // This is temporary mock data - will be replaced with real Sports Reference scraping
    const mockStats = {
      'Josh Allen': {
        2023: {
          1: { passingYards: 297, passingTDs: 3, interceptions: 1, rushingYards: 56, rushingTDs: 1 },
          2: { passingYards: 274, passingTDs: 1, interceptions: 1, rushingYards: 44, rushingTDs: 0 },
          3: { passingYards: 320, passingTDs: 2, interceptions: 0, rushingYards: 23, rushingTDs: 0 }
        }
      },
      'Christian McCaffrey': {
        2023: {
          1: { rushingYards: 152, rushingTDs: 1, receptions: 3, receivingYards: 17, receivingTDs: 0 },
          2: { rushingYards: 136, rushingTDs: 1, receptions: 6, receivingYards: 81, receivingTDs: 1 },
          3: { rushingYards: 98, rushingTDs: 0, receptions: 4, receivingYards: 34, receivingTDs: 0 }
        }
      },
      'Tyreek Hill': {
        2023: {
          1: { receptions: 11, receivingYards: 215, receivingTDs: 2, rushingYards: 0, rushingTDs: 0 },
          2: { receptions: 8, receivingYards: 181, receivingTDs: 1, rushingYards: 0, rushingTDs: 0 },
          3: { receptions: 9, receivingYards: 157, receivingTDs: 1, rushingYards: 0, rushingTDs: 0 }
        }
      },
      '49ers': {
        2023: {
          1: { defensePointsAllowed: 7, defenseSacks: 3, defenseInterceptions: 1, defenseFumbleRecoveries: 1, defenseSafeties: 0, defenseTDs: 0 },
          2: { defensePointsAllowed: 17, defenseSacks: 2, defenseInterceptions: 0, defenseFumbleRecoveries: 0, defenseSafeties: 0, defenseTDs: 0 },
          3: { defensePointsAllowed: 10, defenseSacks: 4, defenseInterceptions: 2, defenseFumbleRecoveries: 1, defenseSafeties: 0, defenseTDs: 0 }
        }
      },
      'Justin Tucker': {
        2023: {
          1: { fieldGoals: 2, extraPoints: 3 },
          2: { fieldGoals: 1, extraPoints: 2 },
          3: { fieldGoals: 3, extraPoints: 1 }
        }
      }
    };

    return mockStats[playerName]?.[year]?.[week] || null;
  }

  // Get available years
  getAvailableYears() {
    return [2020, 2021, 2022, 2023, 2024];
  }

  // Clear cache
  clearCache() {
    this.cache.flushAll();
  }
}

module.exports = new NFLApiService();
