import { useSelector, useDispatch } from 'react-redux';
import {signInMode, signUpMode, isSignIn} from '../store/uiSlice';
import { Link } from 'react-router-dom';
import UserPage from '../pages/userpage/UserPage';


const AuthModal = ({ isOpen, onClose, onSubmitSignIn, onSubmitSignUp}) => {
  if (!isOpen) return null; 

  const setIsSignIn = useSelector((state) => state.ui.isSignIn);
  const dispatch = useDispatch();
  const handleSignInMode = () => dispatch(signInMode());
  const handleSignUpMode = () => dispatch(signUpMode());

  return ( 
        <div id="authModal"  className="modal">
  <div className="modal-content">
    <button className="close" onClick={onClose} aria-label="Close">
      <i className="fa-solid fa-arrow-right-from-bracket"></i>
    </button>
    <h2>
        Welcome to <span style={{color: "purple"}}>BlogSpace</span>
    </h2>
    <div className="tabs">
      <button className={setIsSignIn ? "tab active" : "tab"} onClick={handleSignInMode}>
        <i className="fa-solid fa-right-to-bracket"></i> Sign In
      </button>
      <button className={setIsSignIn ? "tab" : "tab active"}  onClick={handleSignUpMode}>
        <i className="fa-solid fa-user-plus"></i> Sign Up
      </button>
    </div>
    {setIsSignIn ? <form id="signinForm"  onSubmit={onSubmitSignIn} className="auth-form"  action="Home.js">
      <input type="email" name="email"  placeholder="Email" required />
      <input type="password" name="password"  placeholder="Password" required />
      <button type="submit" className="submit-btn">
        <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In
      </button>
    </form> :
    <form id="signupForm"  onSubmit={onSubmitSignUp} className="auth-form" action="Home.js">
      <input type="text" name="fullName"  placeholder="Full Name" required />
      <input type="email" name="email"  placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit" className="submit-btn">
        <i className="fa-solid fa-user-plus"></i> Sign Up
      </button>
      <div style={{
        fontSize: 0.9 + "em",
        color: "#888",
        marginTop: 5 + "px"
        }}>
        <i className="fa-solid fa-lock"></i>
        Password must be at least 8 characters, include an uppercase letter, a number, and a special character.
      </div>
    </form>}
  </div>
</div>
     );
}
 
export default AuthModal;