import React from 'react';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function Login() {
    return (
      <div className=".container">
        <div className="login-page">
            <div className="BG-left">
                <img src="rsu_logo.png" alt="Logo" className="rsu_logo" />
                <h1>Hi Sir Have a Nice In This Today.</h1>
                <p>
                    Many cloud and thunder. You Should to take a ambella with your body.
                    With best wishes from DIT.
                </p>
              
                <form className="login-form">
                        <div className="input-group">
                            <span className="icon">
                                <FontAwesomeIcon icon={faEnvelope} /> 
                            </span>
                            <input type="email" placeholder="RSU Mail" />
                        </div>

                        <div className="input-group">
                            <span className="icon">
                                <FontAwesomeIcon icon={faUser} /> 
                            </span>
                            <input type="password" placeholder="Password" />
                        </div>

                    <button type="submit" className="login-button">Login Now</button>
                    
                    <div className="social_login">
                    <img src="google_icon.png" alt="Logo" className="google" />
                    <img src="facebook_icon.png" alt="Logo" className="facebook" />
                    </div>
                </form>
            </div>

            <div className="BG-right">
                <img src="bg_login.png" alt="bg_login" className="bg_login" />
            </div>
        </div>
        </div>
    );
}

export default Login;
