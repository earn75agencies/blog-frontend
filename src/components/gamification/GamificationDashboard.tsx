import React, { useState, useEffect } from 'react';
import { gamificationService, UserStats, Achievement, LeaderboardEntry, Challenge } from '../../services/gamification.service';
import './GamificationDashboard.css';

interface GamificationDashboardProps {
  userId: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ userId }) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [leaderboardPosition, setLeaderboardPosition] = useState<LeaderboardEntry | null>(null);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard' | 'challenges'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, achievements, position, challenges] = await Promise.all([
        gamificationService.getUserStats(userId),
        gamificationService.getUserAchievements(userId),
        gamificationService.getUserRank(userId),
        gamificationService.getActiveChallenges()
      ]);

      setUserStats(stats);
      setRecentAchievements(achievements.slice(0, 5));
      setLeaderboardPosition(position);
      setActiveChallenges(challenges.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = () => {
    if (!userStats) return 0;
    return (userStats.currentLevelPoints / userStats.nextLevelPoints) * 100;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FF6B35';
      case 'epic': return '#9B59B6';
      case 'rare': return '#3498DB';
      default: return '#95A5A6';
    }
  };

  if (loading) {
    return <div className="gamification-loading">Loading your gamification data...</div>;
  }

  return (
    <div className="gamification-dashboard">
      <div className="dashboard-header">
        <h1>Gamification Hub</h1>
        <div className="user-summary">
          {userStats && (
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-value">{userStats.totalPoints}</div>
                <div className="card-label">Total Points</div>
              </div>
              <div className="summary-card">
                <div className="card-value">Level {userStats.level}</div>
                <div className="card-label">Current Level</div>
              </div>
              <div className="summary-card">
                <div className="card-value">{userStats.badges.length}</div>
                <div className="card-label">Badges Earned</div>
              </div>
              <div className="summary-card">
                <div className="card-value">{userStats.streak}</div>
                <div className="card-label">Day Streak</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
        <button
          className={`tab-button ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          Challenges
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="level-progress">
              <h3>Level Progress</h3>
              {userStats && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${getLevelProgress()}%` }}
                  />
                  <div className="progress-text">
                    {userStats.currentLevelPoints} / {userStats.nextLevelPoints} XP
                  </div>
                </div>
              )}
            </div>

            <div className="recent-achievements">
              <h3>Recent Achievements</h3>
              <div className="achievements-grid">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-card">
                    <div
                      className="badge-icon"
                      style={{ backgroundColor: getRarityColor(achievement.badge.rarity) }}
                    >
                      <img src={achievement.badge.icon} alt={achievement.badge.name} />
                    </div>
                    <div className="achievement-info">
                      <h4>{achievement.badge.name}</h4>
                      <p>{achievement.badge.description}</p>
                      <small>Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="active-challenges">
              <h3>Active Challenges</h3>
              <div className="challenges-list">
                {activeChallenges.map((challenge) => (
                  <div key={challenge.id} className="challenge-card">
                    <div className="challenge-header">
                      <h4>{challenge.title}</h4>
                      <span className="challenge-type">{challenge.type}</span>
                    </div>
                    <p>{challenge.description}</p>
                    <div className="challenge-reward">
                      <span className="points">{challenge.points} points</span>
                      {challenge.badgeReward && (
                        <img
                          src={challenge.badgeReward.icon}
                          alt={challenge.badgeReward.name}
                          className="reward-badge"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <AchievementsTab userId={userId} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab userId={userId} currentPosition={leaderboardPosition} />
        )}

        {activeTab === 'challenges' && (
          <ChallengesTab userId={userId} />
        )}
      </div>
    </div>
  );
};

const AchievementsTab: React.FC<{ userId: string }> = ({ userId }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gamificationService.getUserAchievements(userId).then(setAchievements).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading achievements...</div>;

  return (
    <div className="achievements-tab">
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="achievement-card detailed">
            <div className="badge-icon large">
              <img src={achievement.badge.icon} alt={achievement.badge.name} />
            </div>
            <div className="achievement-details">
              <h3>{achievement.badge.name}</h3>
              <p>{achievement.badge.description}</p>
              <div className="achievement-meta">
                <span className="category">{achievement.badge.category}</span>
                <span className="points">+{achievement.badge.points} points</span>
                <span className="rarity">{achievement.badge.rarity}</span>
              </div>
              <small>Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeaderboardTab: React.FC<{ userId: string; currentPosition: LeaderboardEntry | null }> = ({ userId, currentPosition }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [type, setType] = useState<'global' | 'weekly' | 'monthly'>('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gamificationService.getLeaderboard(type).then(setLeaderboard).finally(() => setLoading(false));
  }, [type]);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard-tab">
      <div className="leaderboard-controls">
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="global">Global</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {currentPosition && (
        <div className="your-position">
          <h3>Your Position</h3>
          <div className="position-card">
            <span className="rank">#{currentPosition.rank}</span>
            <div className="user-info">
              <span className="username">{currentPosition.username}</span>
              <span className="points">{currentPosition.totalPoints} points</span>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-list">
        {leaderboard.map((entry) => (
          <div key={entry.userId} className={`leaderboard-entry ${entry.userId === userId ? 'current-user' : ''}`}>
            <div className="rank">{entry.rank}</div>
            <div className="user-info">
              <img src={entry.avatar || '/default-avatar.png'} alt={entry.username} className="avatar" />
              <span className="username">{entry.username}</span>
            </div>
            <div className="stats">
              <span className="points">{entry.totalPoints} pts</span>
              <span className="level">Lvl {entry.level}</span>
              <span className="badges">{entry.badges.length} badges</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChallengesTab: React.FC<{ userId: string }> = ({ userId }) => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      gamificationService.getActiveChallenges(),
      gamificationService.getUserChallenges(userId)
    ]).then(([active, userChallenges]) => {
      const combined = active.map(challenge => {
        const userChallenge = userChallenges.find(uc => uc.challengeId === challenge.id);
        return { ...challenge, userProgress: userChallenge };
      });
      setChallenges(combined);
    }).finally(() => setLoading(false));
  }, [userId]);

  const joinChallenge = async (challengeId: string) => {
    try {
      await gamificationService.joinChallenge(challengeId);
      // Refresh challenges
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  if (loading) return <div>Loading challenges...</div>;

  return (
    <div className="challenges-tab">
      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card detailed">
            <div className="challenge-header">
              <h3>{challenge.title}</h3>
              <span className={`type ${challenge.type}`}>{challenge.type}</span>
            </div>
            <p>{challenge.description}</p>
            <div className="challenge-requirements">
              <h4>Requirements:</h4>
              <ul>
                {challenge.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            <div className="challenge-progress">
              {challenge.userProgress ? (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(challenge.userProgress.progress / challenge.userProgress.totalRequired) * 100}%` }}
                  />
                  <span>{challenge.userProgress.progress} / {challenge.userProgress.totalRequired}</span>
                </div>
              ) : (
                <button
                  className="join-challenge-btn"
                  onClick={() => joinChallenge(challenge.id)}
                >
                  Join Challenge
                </button>
              )}
            </div>
            <div className="challenge-rewards">
              <span className="points">{challenge.points} points</span>
              {challenge.badgeReward && (
                <div className="badge-reward">
                  <img src={challenge.badgeReward.icon} alt={challenge.badgeReward.name} />
                  <span>{challenge.badgeReward.name}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamificationDashboard;