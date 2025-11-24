import React, { useState, useRef, useEffect } from 'react';
import { Episode, EpisodeProgress } from '../../services/podcast.service';
import './PodcastPlayer.css';

interface PodcastPlayerProps {
  episode: Episode;
  onProgressUpdate?: (progress: EpisodeProgress) => void;
  onEpisodeEnd?: () => void;
  autoPlay?: boolean;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({
  episode,
  onProgressUpdate,
  onEpisodeEnd,
  autoPlay = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const progressUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      updateCurrentChapter(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEpisodeEnd?.();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [episode, onEpisodeEnd]);

  useEffect(() => {
    if (isPlaying) {
      progressUpdateInterval.current = setInterval(() => {
        if (audioRef.current && onProgressUpdate) {
          onProgressUpdate({
            id: '',
            userId: '',
            episodeId: episode.id,
            currentTime: audioRef.current.currentTime,
            duration: audioRef.current.duration,
            isCompleted: false,
            lastPlayedAt: new Date().toISOString(),
            playCount: 1,
          });
        }
      }, 5000); // Update progress every 5 seconds
    } else {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    }

    return () => {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
  }, [isPlaying, episode.id, onProgressUpdate]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        setIsLoading(true);
        await audio.play();
      }
    } catch (err) {
      setError('Failed to play audio');
      setIsLoading(false);
    }
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const skipForward = () => {
    seekTo(Math.min(currentTime + 30, duration));
  };

  const skipBackward = () => {
    seekTo(Math.max(currentTime - 15, 0));
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const updateCurrentChapter = (time: number) => {
    if (!episode.chapters) return;
    
    const chapterIndex = episode.chapters.findIndex(
      (chapter, index) => 
        time >= chapter.startTime && 
        (index === episode.chapters!.length - 1 || time < episode.chapters![index + 1].startTime)
    );
    
    setCurrentChapter(chapterIndex >= 0 ? chapterIndex : null);
  };

  const seekToChapter = (chapterIndex: number) => {
    if (episode.chapters && episode.chapters[chapterIndex]) {
      seekTo(episode.chapters[chapterIndex].startTime);
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="podcast-player">
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
      />

      <div className="player-header">
        <div className="episode-info">
          <h3>{episode.title}</h3>
          <p>{episode.podcast.title}</p>
          {currentChapter !== null && episode.chapters && (
            <div className="current-chapter">
              Chapter: {episode.chapters[currentChapter].title}
            </div>
          )}
        </div>
        <div className="episode-cover">
          <img src={episode.podcast.coverArt} alt={episode.podcast.title} />
        </div>
      </div>

      {error && (
        <div className="player-error">
          {error}
        </div>
      )}

      <div className="player-controls">
        <div className="main-controls">
          <button
            className="control-button"
            onClick={skipBackward}
            disabled={isLoading}
          >
            ⏪ -15s
          </button>
          
          <button
            className="play-pause-button"
            onClick={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button
            className="control-button"
            onClick={skipForward}
            disabled={isLoading}
          >
            ⏩ +30s
          </button>
        </div>

        <div className="progress-container">
          <span className="time-display">{formatTime(currentTime)}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="progress-slider"
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>

        <div className="secondary-controls">
          <div className="volume-control">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="volume-slider"
            />
          </div>

          <div className="playback-rate-control">
            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
              className="playback-rate-select"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2x</option>
            </select>
          </div>

          {episode.transcript && (
            <button
              className="transcript-button"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              📝 Transcript
            </button>
          )}
        </div>
      </div>

      {episode.chapters && episode.chapters.length > 0 && (
        <div className="chapters-section">
          <h4>Chapters</h4>
          <div className="chapters-list">
            {episode.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`chapter-item ${currentChapter === index ? 'active' : ''}`}
                onClick={() => seekToChapter(index)}
              >
                <div className="chapter-info">
                  <span className="chapter-time">{formatTime(chapter.startTime)}</span>
                  <span className="chapter-title">{chapter.title}</span>
                </div>
                {chapter.imageUrl && (
                  <img src={chapter.imageUrl} alt={chapter.title} className="chapter-image" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showTranscript && episode.transcript && (
        <div className="transcript-section">
          <h4>Transcript</h4>
          <div className="transcript-content">
            {episode.transcript.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {episode.showNotes && (
        <div className="show-notes-section">
          <h4>Show Notes</h4>
          <div className="show-notes-content">
            {episode.showNotes.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {episode.guests && episode.guests.length > 0 && (
        <div className="guests-section">
          <h4>Guests</h4>
          <div className="guests-list">
            {episode.guests.map((guest) => (
              <div key={guest.id} className="guest-item">
                <img src={guest.avatar || '/default-avatar.png'} alt={guest.name} className="guest-avatar" />
                <div className="guest-info">
                  <h5>{guest.name}</h5>
                  {guest.bio && <p>{guest.bio}</p>}
                  {guest.website && (
                    <a href={guest.website} target="_blank" rel="noopener noreferrer" className="guest-website">
                      Website
                    </a>
                  )}
                  {guest.socialLinks && (
                    <div className="guest-social-links">
                      {guest.socialLinks.twitter && (
                        <a href={guest.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      )}
                      {guest.socialLinks.linkedin && (
                        <a href={guest.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      )}
                      {guest.socialLinks.instagram && (
                        <a href={guest.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastPlayer;