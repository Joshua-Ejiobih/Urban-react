import React from "react";

const PostModal = ({ isOpen, onClose, onSubmit, post, setPost, isEdit, modalTitle }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2>
          <i className="fa-solid fa-pen-to-square"></i>
          {modalTitle || (isEdit ? "Edit Post" : "Create Post")}
        </h2>
        <form className="post_form" onSubmit={async (e) => {
          e.preventDefault();
          let postData = { ...post };
          if (post.image && post.image instanceof File) {
            // Convert image to Base64 string
            const toBase64 = file => new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = error => reject(error);
            });
            postData.image = await toBase64(post.image);
          }
          onSubmit({ ...e, post: postData });
        }}>
          <label>Title</label>
          <input type="text" name="title" value={post.title || ""} onChange={e => setPost({ ...post, title: e.target.value })} placeholder="Enter your post title..." required />
          <label>Description</label>
          <textarea name="description" value={post.description || ""} onChange={e => setPost({ ...post, description: e.target.value })} placeholder="Write your post content here..." required />
          <label htmlFor="image-upload" className="image-upload-label">
            <i className="fa-solid fa-image"></i> Upload Image (jpg, png, jpeg, &lt;1MB)
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files[0];
              if (file && file.size < 1024 * 1024) {
                setPost({ ...post, image: file });
              } else {
                alert('Image must be less than 1MB');
              }
            }}
          />
          {post.image && post.image.name && (
            <div className="image-upload-filename">
              <i className="fa-solid fa-file-image"></i> {post.image.name}
            </div>
          )}
          <span style={{ fontSize: "0.9em", color: "#888" }}><i className="fa-solid fa-image"></i> Images should be less than 1MB. (jpg, png, jpeg)</span>
                    
          <label>Category</label>
          <select name="category" value={post.category || ""} onChange={e => setPost({ ...post, category: e.target.value })} required>
            <option value="">--Select--</option>
            <option value="tech">Tech</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="crypto">Crypto</option>
            <option value="family">Family</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="gaming">Gaming</option>
            <option value="health">Health</option>
            <option value="travel">Travel</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
          </select>
          <button type="submit" className="submit-btn">
            <i className="fa-solid fa-paper-plane"></i> {isEdit ? "Update" : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
