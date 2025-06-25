import React from 'react';
import { Video } from '../context/VideoContext';

interface VideoThumbnailProps {
  video: Video;
  onClick: (video: Video) => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video, onClick }) => (
  <div className="video-thumbnail" onClick={() => onClick(video)} style={{ cursor: 'pointer' }}>
    <img src={video.thumbnail} alt={video.title} className="thumbnail-image" />
    <p>{video.title}</p>
  </div>
);

export default VideoThumbnail;
