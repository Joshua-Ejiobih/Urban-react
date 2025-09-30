import React from "react";

const ViewModal = ({ isOpen, onClose, post }) => {
  if (!isOpen || !post) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-card view-modal-card">
        <button className="close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="view-modal-content">
          <h2 className="view-modal-title"><i className="fa-solid fa-quote-left"></i> {post.title}</h2>
          <div className="view-modal-meta">
            <span><i className="fa-solid fa-user"></i> {post.author}</span>
            <span><i className="fa-solid fa-calendar"></i> {post.date}</span>
            <span className="category-badge"><i className="fa-solid fa-tag"></i> {post.category}</span>
          </div>
          {post.image && <img src={post.image} alt="Post image" className="view-modal-image" />}
          <p className="view-modal-description">{post.description}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, idx) => (
                <span className="tag-chip" key={idx}>
                  <i className="fa-solid fa-hashtag"></i> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
