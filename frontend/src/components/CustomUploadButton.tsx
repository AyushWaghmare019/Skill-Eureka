import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useVideos } from '../context/VideoContext';

const CustomUploadButton = () => {
  const { currentUser } = useAuth();
  const { uploadVideo, getVideosByCreator } = useVideos();

  // Only allow upload if user is a creator
  if (!currentUser?.isCreator) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !currentUser) return;
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('title', file.name);
    formData.append('category', 'Uncategorized');
    formData.append('video', file);
    formData.append('creatorId', currentUser.id);

    await uploadVideo(formData);
    // Optionally: refresh video list or show a success message
    alert('Video uploaded!');
    e.target.value = ''; // Reset input
  };

  return (
    <div style={{ margin: '2rem 0' }}>
     
     <label htmlFor="upload-video"  className=" cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:pointer  hover:-translate-y-1 hover:scale-105 animate-pulse"
>
       🚀 Upload Video
        <input
          id="upload-video"
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </label>
    
    </div>
  );
};

export default CustomUploadButton;
