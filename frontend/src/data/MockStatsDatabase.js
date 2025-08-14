// Mock historical stats database
export const MOCK_HISTORICAL_STATS = {
  'Josh Allen': {
    2023: {
      passingYards: 4306,
      passingTDs: 35,
      interceptions: 14,
      rushingYards: 762,
      rushingTDs: 5,
      receptions: 0,
      receivingYards: 0,
      receivingTDs: 0
    },
    2022: {
      passingYards: 4283,
      passingTDs: 35,
      interceptions: 14,
      rushingYards: 762,
      rushingTDs: 7,
      receptions: 0,
      receivingYards: 0,
      receivingTDs: 0
    }
  },
  'Patrick Mahomes': {
    2023: {
      passingYards: 4183,
      passingTDs: 31,
      interceptions: 8,
      rushingYards: 389,
      rushingTDs: 0,
      receptions: 0,
      receivingYards: 0,
      receivingTDs: 0
    },
    2022: {
      passingYards: 5250,
      passingTDs: 41,
      interceptions: 12,
      rushingYards: 358,
      rushingTDs: 4,
      receptions: 0,
      receivingYards: 0,
      receivingTDs: 0
    }
  },
  'Christian McCaffrey': {
    2023: {
      passingYards: 0,
      passingTDs: 0,
      interceptions: 0,
      rushingYards: 1459,
      rushingTDs: 14,
      receptions: 67,
      receivingYards: 564,
      receivingTDs: 7
    },
    2022: {
      passingYards: 0,
      passingTDs: 0,
      interceptions: 0,
      rushingYards: 1139,
      rushingTDs: 8,
      receptions: 85,
      receivingYards: 741,
      receivingTDs: 5
    }
  },
  'Derrick Henry': {
    2023: {
      passingYards: 0,
      passingTDs: 0,
      interceptions: 0,
      rushingYards: 1167,
      rushingTDs: 12,
      receptions: 28,
      receivingYards: 214,
      receivingTDs: 0
    },
    2022: {
      passingYards: 0,
      passingTDs: 0,
      interceptions: 0,
      rushingYards: 1538,
      rushingTDs: 13,
      receptions: 33,
      receivingYards: 398,
      receivingTDs: 0
    }
  },
  'Tyreek Hill': {
    2023: {
      passingYards: 0,
      passingTDs: 0,
      interceptions: 0,
      rushingYards: 0,
      rushingTDs: 0,
      receptions: 119,
      receivingYards: 1799,
      receivingTDs: 13
    },
    2022: {
      passingYards: 0,
      passingTDs: 0,
      interceptions: 0,
      rushingYards: 32,
      rushingTDs: 0,
      receptions: 119,
      receivingYards: 1799,
      receivingTDs: 7
    }
  },
  'Travis Kelce': {
    2023: {
      passingYards: 0,
      passingTDs: 0,
      interceptions: 0,
      rushingYards: 0,
      rushingTDs: 0,
      receptions: 93,
      receivingYards: 984,
      receivingTDs: 5
    },
    2022: {
      passingYards: 0,
      passingTDs: 0,
      interceptions: 0,
      rushingYards: 0,
      rushingTDs: 0,
      receptions: 110,
      receivingYards: 1338,
      receivingTDs: 12
    }
  },
  'Cowboys': {
    2023: {
      defensePointsAllowed: 19.5,
      defenseSacks: 46,
      defenseInterceptions: 18,
      defenseFumbleRecoveries: 12,
      defenseSafeties: 0,
      defenseTDs: 1
    },
    2022: {
      defensePointsAllowed: 20.1,
      defenseSacks: 54,
      defenseInterceptions: 16,
      defenseFumbleRecoveries: 10,
      defenseSafeties: 0,
      defenseTDs: 2
    }
  },
  'Justin Tucker': {
    2023: {
      fieldGoals: 32,
      extraPoints: 35
    },
    2022: {
      fieldGoals: 37,
      extraPoints: 42
    }
  }
};

// Get player stats for a specific year
export const getPlayerStats = (playerName, year) => {
  const playerStats = MOCK_HISTORICAL_STATS[playerName];
  if (playerStats && playerStats[year]) {
    return playerStats[year];
  }
  return null;
};

// Check if a player has stats for a specific year
export const hasStatsForYear = (playerName, year) => {
  const playerStats = MOCK_HISTORICAL_STATS[playerName];
  return playerStats && playerStats[year];
};