import React, { useRef, useEffect, useState } from 'react';
import './CustomVideoPlayer.css';

const CustomVideoPlayer = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const [holding, setHolding] = useState(false);
  const [holdingSide, setHoldingSide] = useState('');

  useEffect(() => {
    let holdInterval;

    if (holding) {
      holdInterval = setInterval(() => {
        if (holdingSide === 'left') {
          console.log('Rewinding at 1x speed');
          videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 1, 0);
        } else if (holdingSide === 'right') {
          console.log('Fast forwarding at 2x speed');
          videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 2, videoRef.current.duration);
        }
      }, 1000);
    }

    return () => clearInterval(holdInterval);
  }, [holding, holdingSide]);

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    const { clientX, target } = e;
    const { width, left } = target.getBoundingClientRect();
    const clickPosition = clientX - left;

    if (clickPosition < width / 3) {
      
      console.log('Double tap on left: Rewind 5 seconds');
      video.currentTime = Math.max(video.currentTime - 5, 0);
    } else if (clickPosition < (2 * width) / 3) {
     
      console.log('Double tap in middle: Play/Pause');
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    } else {
      
      console.log('Double tap on right: Forward 10 seconds');
      video.currentTime = Math.min(video.currentTime + 10, video.duration);
    }
  };

  const handleMouseDown = (e) => {
    const { clientX, target } = e;
    const { width, left } = target.getBoundingClientRect();
    const clickPosition = clientX - left;

    if (clickPosition < width / 3) {
      console.log('Press and hold on left: Start rewinding');
      setHoldingSide('left');
      setHolding(true);
    } else if (clickPosition > (2 * width) / 3) {
      console.log('Press and hold on right: Start fast forwarding');
      setHoldingSide('right');
      setHolding(true);
    }
  };

  const handleMouseUp = () => {
    if (holdingSide === 'left') {
      console.log('Released hold on left: Stop rewinding');
    } else if (holdingSide === 'right') {
      console.log('Released hold on right: Stop fast forwarding');
    }
    setHolding(false);
    setHoldingSide('');
  };

 
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  
  const handleFullScreenChange = () => {
    if (!document.fullscreenElement) {
      console.log('Exited fullscreen mode');
    } else {
      console.log('Entered fullscreen mode');
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <div
      className="custom-video-player"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <video ref={videoRef} className="video" src={videoSrc} controls />
      <div
        className="video-overlay"
        onDoubleClick={handleDoubleClick}
      ></div>
      <button onClick={toggleFullScreen} className="fullscreen-btn">
        Toggle Fullscreen
      </button>
    </div>
  );
};

export default CustomVideoPlayer;
