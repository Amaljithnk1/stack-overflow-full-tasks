import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import "./PublicSpace.css";
import CustomVideoPlayer from '../CustomVideoPlayer/CustomVideoPlayer'; 
import { filterAbusiveContent } from '../../utils/filter'; 

const PublicSpace = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('Profile'));

  
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://stack-overflow-full-tasks.onrender.com/public-posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to create posts.');
      return;
    }

    
    const cleanContent = filterAbusiveContent(text);

    const token = user.token;
    const formData = new FormData();
    formData.append('text', cleanContent); 
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);

    try {
      const response = await axios.post('https://stack-overflow-full-tasks.onrender.com/public-posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      
      const newPost = {
        ...response.data,
        creator: {
          _id: user.result._id,
          name: user.result.name,
          avatar: user.result.avatar,
        },
      };
      setPosts([newPost, ...posts]);
      setText('');
      setImage(null);
      setVideo(null);
      setError('');

      
      imageInputRef.current.value = null;
      videoInputRef.current.value = null;
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error creating post');
    }
  };

  const handleDelete = async (postId) => {
    const token = user.token;
    try {
      await axios.delete(`https://stack-overflow-full-tasks.onrender.com/public-posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Error deleting post');
    }
  };

  
  const renderTextWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="public-space-container1">
      <form className="public-space-form" onSubmit={handleSubmit}>
        <textarea
          className="public-space-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share something..."
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginBottom: '10px' }}
          ref={imageInputRef} 
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          style={{ marginBottom: '10px' }}
          ref={videoInputRef} 
        />
        <button className="public-space-button" type="submit">Post</button>
        {error && <p className="public-space-error">{error}</p>}
      </form>
      <div className="public-space-posts">
        {posts.map((post) => (
          <div key={post._id} className="public-space-post">
            <div className="post-header">
              <div className="post-user-info">
                {post.creator && post.creator.avatar && (
                  <img src={`https://stack-overflow-full-tasks.onrender.com/${post.creator.avatar}`} alt="Avatar" className="post-avatar" />
                )}
                {post.creator && <p className="post-author">{post.creator.name}</p>}
              </div>
              {user?.result?._id === post.creator?._id && (
                <button className="delete-button" onClick={() => handleDelete(post._id)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              )}
            </div>
            <p>{renderTextWithLineBreaks(post.text)}</p>
            {post.imageUrl && (
              <img src={`https://stack-overflow-full-tasks.onrender.com/${post.imageUrl}`} alt="Post" />
            )}
            {post.videoUrl && (
              <CustomVideoPlayer videoSrc={`https://stack-overflow-full-tasks.onrender.com/${post.videoUrl}`} /> 
            )}
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicSpace;
