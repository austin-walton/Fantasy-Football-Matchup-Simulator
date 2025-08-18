// ESPN Fantasy Football Scoring Engine
// Supports PPR (Point Per Reception) and Standard scoring

export const SCORING_SYSTEMS = {
    PPR: 'PPR',
    STANDARD: 'STANDARD',
    HALF_PPR: 'HALF_PPR'
  };
  
  export const SCORING_RULES = {
    // QUARTERBACK SCORING
    QB: {
      passingYards: 0.04,        // 1 point per 25 yards (25 * 0.04 = 1)
      passingTDs: 4,             // 4 points per passing TD
      interceptions: -2,          // -2 points per interception
      rushingYards: 0.1,         // 1 point per 10 yards
      rushingTDs: 6,             // 6 points per rushing TD
      fumbles: -2,               // -2 points per fumble
      passing2PT: 2              // 2 points for 2-point conversion
    },
  
    // RUNNING BACK SCORING
    RB: {
      rushingYards: 0.1,         // 1 point per 10 yards
      rushingTDs: 6,             // 6 points per rushing TD
      receivingYards: 0.1,       // 1 point per 10 yards
      receivingTDs: 6,           // 6 points per receiving TD
      receptions: {              // Varies by scoring system
        PPR: 1,                  // 1 point per reception (PPR)
        HALF_PPR: 0.5,          // 0.5 points per reception (Half PPR)
        STANDARD: 0             // 0 points per reception (Standard)
      },
      fumbles: -2,               // -2 points per fumble
      rushing2PT: 2,             // 2 points for 2-point conversion
      receiving2PT: 2            // 2 points for 2-point conversion
    },
  
    // WIDE RECEIVER SCORING (same as RB for most stats)
    WR: {
      receivingYards: 0.1,       // 1 point per 10 yards
      receivingTDs: 6,           // 6 points per receiving TD
      rushingYards: 0.1,         // 1 point per 10 yards (rare but possible)
      rushingTDs: 6,             // 6 points per rushing TD (rare but possible)
      receptions: {
        PPR: 1,
        HALF_PPR: 0.5,
        STANDARD: 0
      },
      fumbles: -2,
      rushing2PT: 2,
      receiving2PT: 2
    },
  
    // TIGHT END SCORING (same as WR/RB)
    TE: {
      receivingYards: 0.1,
      receivingTDs: 6,
      rushingYards: 0.1,         // Rare but possible
      rushingTDs: 6,             // Rare but possible
      receptions: {
        PPR: 1,
        HALF_PPR: 0.5,
        STANDARD: 0
      },
      fumbles: -2,
      rushing2PT: 2,
      receiving2PT: 2
    },
  
    // KICKER SCORING
    K: {
      extraPoints: 1,            // 1 point per extra point
      fieldGoals0_39: 3,         // 3 points for FG 0-39 yards
      fieldGoals40_49: 4,        // 4 points for FG 40-49 yards
      fieldGoals50_59: 5,        // 5 points for FG 50-59 yards
      fieldGoals60Plus: 6,       // 6 points for FG 60+ yards
      missedExtraPoints: -1,     // -1 point for missed extra point
      missedFieldGoals: -1       // -1 point for missed field goal
    },
  
    // DEFENSE/SPECIAL TEAMS SCORING
    DEF: {
      pointsAllowed0: 10,        // 10 points for 0 points allowed
      pointsAllowed1_6: 7,       // 7 points for 1-6 points allowed
      pointsAllowed7_13: 4,      // 4 points for 7-13 points allowed
      pointsAllowed14_20: 1,     // 1 point for 14-20 points allowed
      pointsAllowed21_27: 0,     // 0 points for 21-27 points allowed
      pointsAllowed28_34: -1,    // -1 point for 28-34 points allowed
      pointsAllowed35Plus: -4,   // -4 points for 35+ points allowed
      
      sacks: 1,                  // 1 point per sack
      interceptions: 2,          // 2 points per interception
      fumblesRecovered: 2,       // 2 points per fumble recovery
      safeties: 2,               // 2 points per safety
      defensiveTDs: 6,           // 6 points per defensive/return TD
      blockedKicks: 2            // 2 points per blocked kick
    }
  };
  
  // Calculate fantasy points for a player
  export function calculateFantasyPoints(playerStats, position, scoringSystem = SCORING_SYSTEMS.PPR) {
    if (!playerStats || !position || !SCORING_RULES[position]) {
      return 0;
    }
  
    const rules = SCORING_RULES[position];
    let points = 0;
  
    // Handle position-specific scoring
    switch (position) {
      case 'QB':
        points += (playerStats.passingYards || 0) * rules.passingYards;
        points += (playerStats.passingTDs || 0) * rules.passingTDs;
        points += (playerStats.interceptions || 0) * rules.interceptions;
        points += (playerStats.rushingYards || 0) * rules.rushingYards;
        points += (playerStats.rushingTDs || 0) * rules.rushingTDs;
        points += (playerStats.fumbles || 0) * rules.fumbles;
        points += (playerStats.passing2PT || 0) * rules.passing2PT;
        break;
  
      case 'RB':
      case 'WR':
      case 'TE':
        points += (playerStats.rushingYards || 0) * rules.rushingYards;
        points += (playerStats.rushingTDs || 0) * rules.rushingTDs;
        points += (playerStats.receivingYards || 0) * rules.receivingYards;
        points += (playerStats.receivingTDs || 0) * rules.receivingTDs;
        points += (playerStats.fumbles || 0) * rules.fumbles;
        points += (playerStats.rushing2PT || 0) * rules.rushing2PT;
        points += (playerStats.receiving2PT || 0) * rules.receiving2PT;
        
        // Handle reception points based on scoring system
        const receptionPoints = typeof rules.receptions === 'object' 
          ? rules.receptions[scoringSystem] 
          : rules.receptions;
        points += (playerStats.receptions || 0) * receptionPoints;
        break;
  
      case 'K':
        // Handle simple field goals (assuming average of 3 points per field goal)
        const fieldGoals = playerStats.fieldGoals || 0;
        points += fieldGoals * 3; // Average 3 points per field goal
        
        // Handle extra points
        points += (playerStats.extraPoints || 0) * rules.extraPoints;
        break;
  
      case 'DEF':
        // Points allowed scoring - use defensePointsAllowed from our stats
        const pointsAllowed = playerStats.defensePointsAllowed || 0;
        if (pointsAllowed === 0) points += rules.pointsAllowed0;
        else if (pointsAllowed <= 6) points += rules.pointsAllowed1_6;
        else if (pointsAllowed <= 13) points += rules.pointsAllowed7_13;
        else if (pointsAllowed <= 20) points += rules.pointsAllowed14_20;
        else if (pointsAllowed <= 27) points += rules.pointsAllowed21_27;
        else if (pointsAllowed <= 34) points += rules.pointsAllowed28_34;
        else points += rules.pointsAllowed35Plus;

        // Other defensive stats - use our simplified field names
        points += (playerStats.defenseSacks || 0) * rules.sacks;
        points += (playerStats.defenseInterceptions || 0) * rules.interceptions;
        points += (playerStats.defenseFumbleRecoveries || 0) * rules.fumblesRecovered;
        points += (playerStats.defenseSafeties || 0) * rules.safeties;
        points += (playerStats.defenseTDs || 0) * rules.defensiveTDs;
        break;
  
      default:
        return 0;
    }
  
    // Round to 1 decimal place
    return Math.round(points * 10) / 10;
  }
  
  // Calculate total team score
  export function calculateTeamScore(players, playerStats, scoringSystem = SCORING_SYSTEMS.PPR) {
    let totalScore = 0;
    
    console.log('Calculating team score for players:', players);
    console.log('Player stats:', playerStats);
    console.log('Scoring system:', scoringSystem);

    players.forEach(player => {
      if (player && player.name && playerStats[player.name]) {
        const playerPoints = calculateFantasyPoints(
          playerStats[player.name], 
          player.position, 
          scoringSystem
        );
        console.log(`${player.name} (${player.position}): ${playerPoints} points`);
        totalScore += playerPoints;
      } else {
        console.log(`Skipping ${player?.name || 'unknown'} - no stats available`);
      }
    });

    console.log('Total team score:', totalScore);
    return Math.round(totalScore * 10) / 10;
  }
  
  // Get detailed scoring breakdown for a player
  export function getPlayerScoreBreakdown(playerStats, position, scoringSystem = SCORING_SYSTEMS.PPR) {
    const breakdown = [];
    const rules = SCORING_RULES[position];
    
    if (!playerStats || !rules) return breakdown;
  
    switch (position) {
      case 'QB':
        if (playerStats.passingYards) {
          breakdown.push({
            stat: 'Passing Yards',
            value: playerStats.passingYards,
            points: playerStats.passingYards * rules.passingYards,
            calculation: `${playerStats.passingYards} × ${rules.passingYards}`
          });
        }
        if (playerStats.passingTDs) {
          breakdown.push({
            stat: 'Passing TDs',
            value: playerStats.passingTDs,
            points: playerStats.passingTDs * rules.passingTDs,
            calculation: `${playerStats.passingTDs} × ${rules.passingTDs}`
          });
        }
        if (playerStats.interceptions) {
          breakdown.push({
            stat: 'Interceptions',
            value: playerStats.interceptions,
            points: playerStats.interceptions * rules.interceptions,
            calculation: `${playerStats.interceptions} × ${rules.interceptions}`
          });
        }
        break;
        
      // Add more position breakdowns as needed...
    }
  
    return breakdown;
  }