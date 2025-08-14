// Fantasy Football Scoring Systems
// ESPN Fantasy Scoring System Only

// Calculate fantasy points for a single player based on their stats and scoring system
  let points = 0;

  // Offense (QB, RB, WR, TE)
  points += (stats.rushingTDs || 0) * 6;
  points += (stats.receivingTDs || 0) * 6;
  points += (stats.kickReturnTDs || 0) * 6;
  points += (stats.puntReturnTDs || 0) * 6;
  points += (stats.fumbleReturnTDs || 0) * 6;
  points += (stats.passingTDs || 0) * 4;
  points += (stats.rushing2pt || 0) * 2;
  points += (stats.receiving2pt || 0) * 2;
  points += (stats.passing2pt || 0) * 2;
  points += Math.floor((stats.rushingYards || 0) / 10);
  points += Math.floor((stats.receivingYards || 0) / 10);
  points += Math.floor((stats.passingYards || 0) / 25);

  // Bonus Points
  points += (stats.rushingTDs40 || 0) * 2;
  points += (stats.receivingTDs40 || 0) * 2;
  points += (stats.passingTDs40 || 0) * 2;

  // Penalty Points
  points -= (stats.interceptions || 0) * 2;
  points -= (stats.fumblesLost || 0) * 2;

  // Kickers (K)
  points += (stats.fgMade50 || 0) * 5;
  points += (stats.fgMade40_49 || 0) * 4;
  points += (stats.fgMadeUnder40 || 0) * 3;
  points += (stats.kicker2pt || 0) * 2;
  points += (stats.extraPoints || 0) * 1;
  points -= (stats.fgMissedUnder40 || 0) * 2;
  points -= (stats.fgMissed40_49 || 0) * 1;

  // Defense/Special Teams (D)
  points += (stats.defenseTDs || 0) * 3;
  points += (stats.defenseInterceptions || 0) * 2;
  points += (stats.defenseFumbleRecoveries || 0) * 2;
  points += (stats.defenseBlockedKicks || 0) * 2;
  points += (stats.defenseSafeties || 0) * 2;
  points += (stats.defenseSacks || 0) * 1;

  return Math.round(points * 10) / 10;
  
  // Defense points (simplified)
  if (stats.defensePointsAllowed !== undefined) {
    if (stats.defensePointsAllowed === 0) points += 10; // Shutout
    else if (stats.defensePointsAllowed <= 6) points += 7; // 1-6 points
    else if (stats.defensePointsAllowed <= 13) points += 4; // 7-13 points
    else if (stats.defensePointsAllowed <= 17) points += 1; // 14-17 points
    else if (stats.defensePointsAllowed <= 27) points += 0; // 18-27 points
    else if (stats.defensePointsAllowed <= 34) points -= 1; // 28-34 points
    else points -= 4; // 35+ points
  }
  
  if (stats.defenseSacks) points += stats.defenseSacks * 1; // 1 point per sack
  if (stats.defenseInterceptions) points += stats.defenseInterceptions * 2; // 2 points per interception
  if (stats.defenseFumbleRecoveries) points += stats.defenseFumbleRecoveries * 2; // 2 points per fumble recovery
  if (stats.defenseSafeties) points += stats.defenseSafeties * 2; // 2 points per safety
  if (stats.defenseTDs) points += stats.defenseTDs * 3; // 3 points per defensive/special teams TD (ESPN)

  return Math.round(points * 10) / 10; // Round to 1 decimal place
}

// Calculate total team score
export const calculateTeamScore = (team, year) => {
  return team.reduce((total, player) => {
    // Replace with actual stats lookup for each player
    const stats = player.stats || {};
    return total + calculateFantasyPoints(stats);
  }, 0);
};

