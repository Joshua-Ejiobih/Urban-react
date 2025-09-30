import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPosts } from "../../store/postsSlice";
import { openAuthModal, resetAllModals, setFormError } from "../../store/uiSlice";
import  AuthModal  from "../../components/AuthModal";
import ViewModal from "../../components/ViewModal";
import { firebaseService } from "../../services/firebaseService/firebaseService";
import UserPage from "../userpage/UserPage";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.items);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const isAuthOpenModal = useSelector((state) => state.ui.isAuthOpenModal);
  const formError = useSelector((state) => state.ui.formError);

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const navigate = useNavigate();



  useEffect(() => {
    dispatch(resetAllModals());
    dispatch(loadPosts());
  }, [dispatch]);

  // Auth state check: redirect if authenticated
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChanges((user) => {
      if (user) {
        navigate('/userpage');
      }
    });
    return () => unsubscribe();
  }, [navigate]);


  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <>
    {/* Auth Modal */}
    <AuthModal
            isOpen={isAuthOpenModal}
            onClose={() => dispatch(resetAllModals())}
            onSubmitSignIn={(e) =>  {
              e.preventDefault();
              dispatch(resetAllModals());
              //This line navigates to the user page
              firebaseService.signIn(e.target.email.value, e.target.password.value)
              .then(() => {
                dispatch(resetAllModals());
                navigate('/userpage');
              }).catch((err) => { dispatch(setFormError(err.message));
            })}}
            onSubmitSignUp={(e) =>  {
              e.preventDefault();
              const password = e.target.password.value;
              // Password validation
              const passwordRules = [
                /.{8,}/, // at least 8 chars
                /[A-Z]/, // uppercase
                /[0-9]/, // number
                /[^A-Za-z0-9]/ // special char
              ];
              if (!passwordRules.every((rule) => rule.test(password))) {
                dispatch(setFormError("Password must be at least 8 characters, include an uppercase letter, a number, and a special character."));
                return;
              }
              firebaseService.signUp(e.target.email.value, password, e.target.fullName.value)
              .then(() => {
                dispatch(resetAllModals());
                navigate('/userpage');
              }).catch((err) => { dispatch(setFormError(err.message));
            })}}
    />
          {/* View Modal */}
          <ViewModal
            isOpen={isViewModalOpen}
            onClose={() => { setIsViewModalOpen(false); setSelectedPost(null); }}
            post={selectedPost}
          />
      {/* NavBar */}
      <nav className="navbar">
        <div className="navbar_container">
          <a href="/" className="nav_header">
            <h2 className="header" style={{ display: "inline", verticalAlign: "middle" }}>UrbanPulse</h2>
          </a>
          <button className="nav_button" onClick={() => dispatch(openAuthModal())}>
            <i className="fa-solid fa-right-to-bracket"></i> Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="main">
        <div className="main_container">
          <h1><i className="fa-solid fa-comments" style={{ color: "#6366f1", marginRight: 8 }}></i>Real People. Real Stories.</h1>
          <h2>
            <i className="fa-solid fa-bullhorn" style={{ color: "#7c3aed", marginRight: 6 }}></i>
            Be heard. Be bold. Capture the pulse of your city and beyond.
          </h2>
          <div className="button_box">
            <button onClick={() => dispatch(openAuthModal())}>
              <i className="fa-solid fa-user-plus"></i> Get Started!
            </button>
          </div>
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
          {/* Posts List */}
          <div className="posts-cards-container">
            {loading && <div>Loading...</div>}
            {error && <div className="error">{error}</div>}
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-meta">
                      <span className="author"><i className="fa-solid fa-user"></i> {post.author}</span>
                      <span className="date"><i className="fa-solid fa-calendar"></i> {post.date}</span>
                    </div>
                    <span className="category-badge"><i className="fa-solid fa-tag"></i> {post.category}</span>
                  </div>
                  {post.image && <img src={post.image} alt="Post image" className="post-image" />}
                  <h2 className="post-title"><i className="fa-solid fa-quote-left"></i> {post.title}</h2>
                  <p className="post-description">{post.description.slice(0, 80)}{post.description.length > 80 && "..."}</p>
                  <div className="post-tags">
                    {post.tags && post.tags.map((tag, idx) => (
                      <span className="tag-chip" key={idx}>
                        <i className="fa-solid fa-hashtag"></i> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="post-actions">
                    <button className="icon-btn">
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
        </div>
      </div>
      {/* Error Popup */}
      {formError && (
        <div className="popup-error">
          <i className="fa-solid fa-circle-exclamation"></i> {formError}
          <button className="popup-close" onClick={() => dispatch(setFormError(null))}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default Home;

