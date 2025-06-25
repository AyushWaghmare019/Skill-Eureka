import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaImage, FaPen, FaCloudUploadAlt } from 'react-icons/fa';

export interface UploadVideoFormProps {
  onUpload: (formData: FormData) => Promise<void>;
}

const UploadVideoForm: React.FC<UploadVideoFormProps> = ({ onUpload }) => {
  const [title, setTitle] = useState('');
  // const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnail) {
      alert('Please select both video and thumbnail files.');
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('title', title);
    // formData.append('category', category);
    formData.append('description', description);
    formData.append('thumbnail', thumbnail); // must match backend multer field
    formData.append('video', videoFile);     // must match backend multer field

    try {
      // Use the context-provided onUpload, which will call your backend and refresh video list
      await onUpload(formData);
      setTitle('');
      setVideoFile(null);
      setThumbnail(null);
      setDescription('');
      setProgress(100);
      (document.getElementById('video-file-input') as HTMLInputElement).value = '';
      (document.getElementById('thumbnail-file-input') as HTMLInputElement).value = '';
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('Upload failed. Try again.');
    }

    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-white w-full max-w-2xl mx-auto shadow-xl"
      encType="multipart/form-data"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaCloudUploadAlt className="text-purple-400" /> Upload New Video
      </h3>

      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <FaVideo className="text-blue-400" />
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="bg-white/10 border border-white/20 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
      </div>

      {/* Category (uncomment if needed) */}
      {/* <div className="flex items-center gap-2 mb-3">
        <FaTags className="text-green-400" />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="bg-white/10 border border-white/20 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
      </div> */}

      {/* Video File */}
      <div className="flex items-center gap-2 mb-3">
        <FaVideo className="text-pink-400" />
        <input
          type="file"
          id="video-file-input"
          accept="video/*"
          onChange={handleVideoChange}
          className="input mb-2"
          required
        />
      </div>

      {/* Thumbnail */}
      <div className="flex items-center gap-2 mb-3">
        <FaImage className="text-yellow-400" />
        <input
          type="file"
          id="thumbnail-file-input"
          accept="image/jpeg,image/png"
          onChange={handleThumbnailChange}
          className="bg-white/10 border border-white/20 px-3 py-2 rounded w-full text-sm text-gray-300"
          required
        />
      </div>

      {/* Description */}
      <div className="flex items-start gap-2 mb-4">
        <FaPen className="text-cyan-400 mt-2" />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="bg-white/10 border border-white/20 px-3 py-2 rounded w-full min-h-[80px]"
        />
      </div>

      {/* Upload Button */}
      <button
        type="submit"
        className="bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 rounded shadow-lg hover:scale-105 transition-transform w-full"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {/* Progress Bar */}
      {loading && (
        <div className="w-full bg-white/20 rounded-full mt-4 h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-pink-400 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.form>
  );
};

export default UploadVideoForm;
