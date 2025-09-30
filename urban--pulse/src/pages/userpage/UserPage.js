import React, { use, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostsError, loadPosts } from "../../store/postsSlice";
import { resetAllModals, setFormError } from "../../store/uiSlice";
import PostModal from "../../components/PostModal";
import ViewModal from "../../components/ViewModal";
import { postsService } from "../../services/postService/postService";
import { firebaseService } from "../../services/firebaseService/firebaseService";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.items);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const formError = useSelector((state) => state.ui.formError);
  const currentUserName = useSelector((state) => state.ui.userName);
  // Fetch current user's full name from Firestore
  const [currentUserFullName, setCurrentUserFullName] = useState('');
  useEffect(() => {
    async function fetchFullName() {
      const name = await firebaseService.getCurrentUserFullName();
      setCurrentUserFullName(name);
    }
    fetchFullName();
  }, []);

  // Local UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editPost, setEditPost] = useState(null);


  const Navigate = useNavigate();
  const timeoutRef = useRef(null);


  useEffect(() => {
    if (formError || error) {
      timeoutRef.current = setTimeout(() => {
        dispatch(setFormError(""));
        dispatch(clearPostsError());
      }, 3500);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [formError, error, dispatch]);

  useEffect(() => {
    dispatch(loadPosts());
  }, [dispatch]);

 // Handlers for popup
  const clearErrorTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      //clear the timeoutreference id
      timeoutRef.current = null;
    }
  };

  const startErrorTimeout = () => {
    // Only start a new timeout if popup is visible and no timeout is currently set
    if ((formError || error) && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        dispatch(setFormError(""));
        dispatch(clearPostsError());
      }, 3500);
    }
  };


  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <>

      {/** Modern Navbar */}
      <nav className="navbar">
        <div className="navbar_container">
          <a href="/" className="nav_header">
            <h2
              className="header"
              style={{
                display: "inline",
                verticalAlign: "middle",
              }}
            >
              UrbanPulse
            </h2>
          </a>
          <div className="nav_actions">
            <div className="wide-nav">
              <span className="user-greeting">
                <i className="fa-solid fa-user"></i> Hi, {currentUserFullName || 'User'}
              </span>
              {/* Create Post Button */}
              <button
                className="icon-btn create-post-btn"
                style={{ marginLeft: 16, background: '#6366f1', color: '#fff', borderRadius: 6, padding: '8px 16px', fontWeight: 500 }}
                onClick={() => setIsPostModalOpen(true)}
                title="Create Post"
              >
                <i className="fa-solid fa-pen-to-square"></i> Create Post
              </button>
              {/* Sign out icon for large screens*/}
              <button
                className="icon-btn signout-btn desktop-signout"
                onClick={async () => {
                  await firebaseService.signOut();
                  dispatch(resetAllModals());
                  Navigate("/");
                }}
                title="Sign Out"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </button>
            </div>
            <div
              className={mobileMenuOpen ? "hamburger is-active" : "hamburger"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>
        </div>

        {/*Mobile menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <ul className="mobile-menu-contents">
              <li className="menu-list">
                <i className="fa-solid fa-user"></i> Hi, {currentUserName || 'User'}
              </li>
              <li className="menu-list">
                <button
                  className="icon-btn create-post-btn"
                  style={{ background: '#6366f1', color: '#fff', borderRadius: 6, padding: '8px 16px', fontWeight: 500, width: '100%' }}
                  onClick={() => { setIsPostModalOpen(true); setEditPost(null); }}
                >
                  <i className="fa-solid fa-pen-to-square"></i> Create Post
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/*Search bar */}
      <div className="filters">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="searchInput"
          placeholder="Search posts..."
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          id="categoryFilter"
        >
          <option value="all">--All Categories--</option>
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
        <button className="search-btn" onClick={() => dispatch(loadPosts())}>
          <i className="fa-solid fa-magnifying-glass"></i> Search
        </button>
      </div>

      {/* Error Popup */}
      {formError || error ? (
        <div
          className="popup-error"
          onMouseEnter={() => {clearErrorTimeout()}}
          onMouseLeave={() => {startErrorTimeout()}}
        >
          <i className="fa-solid fa-circle-exclamation"></i>{" "}
          {formError || error}
          <button
            className="popup-close"
            onClick={() =>{
              dispatch(setFormError(""));
              dispatch(clearPostsError());
              clearErrorTimeout();
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      ) : (
        ""
      )}

      {/* Post Modal */}
      {/*passing props to PostModal */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => {
          setIsPostModalOpen(false);
          setEditPost(null);
        }}
        onSubmit={(data) => {
          // Set author and date on creation
          const now = new Date();
          const postToSave = {
            ...data.post,
            author: currentUserFullName,
            date: now.toLocaleDateString() + ' ' + now.toLocaleTimeString(),
          };
          postsService.addPost(postToSave).then(() => {
            dispatch(loadPosts());
          });
          setIsPostModalOpen(false);
          setEditPost(null);
        }}
        post={editPost || {}}
        setPost={setEditPost}
        isEdit={editPost !== null && Object.keys(editPost).length > 0}
        modalTitle={editPost !== null && Object.keys(editPost).length > 0 ? 'Edit Post' : 'Create Post'}
      />
      {/* View Modal */}
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
      />

      {/* Posts List */}
      <div className="posts-cards-container">
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
               { /*<span className="avatar">
                  {post.author ? post.author.charAt(0).toUpperCase() : ''}
                </span>*/}
                <div className="post-meta">
                  <span className="author">
                    <i className="fa-solid fa-user"></i> {post.author}
                  </span>
                  <span className="date">
                    <i className="fa-solid fa-calendar"></i> {post.date}
                  </span>
                </div>
                <span className="category-badge">
                  <i className="fa-solid fa-tag"></i> {post.category}
                </span>
              </div>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post image"
                  className="post-image"
                />
              )}
              <h2 className="post-title">
                <i className="fa-solid fa-quote-left"></i> {post.title}
              </h2>
              <p className="post-description">
                {post.description.slice(0, 80)}
                {post.description.length > 80 && "..."}
              </p>
              <div className="post-tags">
                {post.tags &&
                  post.tags.map((tag, idx) => (
                    <span className="tag-chip" key={idx}>
                      <i className="fa-solid fa-hashtag"></i> {tag}
                    </span>
                  ))}
              </div>
              <div className="post-actions">
                {/* Only show Edit/Delete if user is signed in and is the author */}
                {currentUserFullName && post.author === currentUserFullName && (
                  <>
                    <button
                      className="icon-btn"
                      onClick={() => {
                        setEditPost(post);
                        setIsPostModalOpen(true);
                      }}
                    >
                      <i className="fa-solid fa-pen"></i> Edit
                    </button>
                    <button className="icon-btn" onClick={() => {
                      postsService.deletePost(post.id).then(() => {
                        dispatch(loadPosts());
                      });
                    }}>
                      <i className="fa-solid fa-trash"></i> Delete
                    </button>
                  </>
                )}
                <button
                  className="icon-btn"
                  onClick={() => {
                    setSelectedPost(post);
                    setIsViewModalOpen(true);
                  }}
                >
                  <i className="fa-solid fa-eye"></i> View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <i className="fa-regular fa-face-frown"></i> No posts found.
          </div>
        )}
      </div>
    </>
  );
};

export default UserPage;
