import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PostData } from "../context/PostContext";

const AddPost = ({ type }) => {
  const { fetchPosts } = PostData();

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [useAI, setUseAI] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  /* =========================================================
     FILE HANDLER (PREVIEW)
     ========================================================= */
  const fileChangeHandler = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  /* =========================================================
     SUBMIT HANDLER
     ========================================================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an image or video");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", file);
    formData.append("useAI", useAI); // backend contract preserved
    formData.append("type", type);

    try {
      setIsUploading(true);

      await axios.post(`/api/post/new?type=${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post uploaded successfully");

      // reset state
      setCaption("");
      setFile(null);
      setPreview(null);
      setUseAI(false);

      fetchPosts();
    } catch (error) {
      toast.error("Failed to upload post");
    } finally {
      setIsUploading(false);
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="flex justify-center mb-6">
      <form
        onSubmit={submitHandler}
        className="card w-full max-w-md p-4 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Create Post</h3>
          {useAI && <span className="ai-badge">✨ AI ON</span>}
        </div>

        {/* Caption */}
        <input
          type="text"
          className="custom-input w-full"
          placeholder="My first gym day"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Preview */}
        {preview && (
          <div className="rounded-xl overflow-hidden border">
            {type === "post" ? (
              <img
                src={preview}
                alt="preview"
                className="w-full object-cover max-h-[360px]"
              />
            ) : (
              <video
                src={preview}
                controls
                className="w-full object-cover max-h-[360px]"
              />
            )}
          </div>
        )}

        {/* AI Toggle */}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
          />
          Enhance caption using AI
        </label>

        {/* File Upload */}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={fileChangeHandler}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isUploading}
          className="btn-primary"
        >
          {isUploading ? "Uploading…" : "+ Add Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
