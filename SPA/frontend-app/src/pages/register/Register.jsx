// File: src/pages/Register/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './register.css'; // Import the matching CSS file

const Register = () => {
    const navigate = useNavigate();
    
    // State to store form input data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        skill: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        // 1. Frontend Validation: Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match. Please check again.');
            return;
        }

        setIsLoading(true);

        // 2. Send registration data to API Gateway (Port 8080)
        // This will route to your Auth Service's register endpoint later
        fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                skill: formData.skill,
                password: formData.password
            })
        })
        .then(async (res) => {
            if (res.ok) {
                alert('🎉 Account created successfully! Redirecting to login page...');
                navigate('/login'); // Redirect to login page
            } else {
                const errorData = await res.json().catch(() => ({}));
                setErrorMessage(errorData.message || 'Registration failed. Email might already be taken.');
            }
        })
        .catch(() => {
            // For now, if backend is not ready, we can mock a success for UI testing
            alert('[Dev Mode] Network error or backend offline. Simulating local success!');
            navigate('/login');
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="reg-body">
            <div className="reg-container">
                {/* Left Side - Branding Section (Matches Login Design) */}
                <div className="reg-brand-section">
                    <div className="reg-brand-content">
                        <div className="reg-logo">
                            <i className="fas fa-hand-holding-heart"></i>
                            <span>ReliefSync</span>
                        </div>
                        <h1>Join the Mission</h1>
                        <p>Register as a volunteer today to help manage disaster responses, track relief resources, and coordinate aid efforts efficiently.</p>
                        <div className="reg-features">
                            <div className="reg-feature-item">
                                <i className="fas fa-shield-alt"></i>
                                <span>Secure Profile Management</span>
                            </div>
                            <div className="reg-feature-item">
                                <i className="fas fa-tasks"></i>
                                <span>Real-time Task Assignment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="reg-form-section">
                    <div className="reg-form-container">
                        <div className="reg-header">
                            <h2>Create Account</h2>
                            <p>Enter your details to register as a volunteer</p>
                        </div>

                        {/* Error Alert Message Banner */}
                        {errorMessage && (
                            <div className="reg-alert reg-alert-error">
                                <i className="fas fa-exclamation-circle"></i>
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="reg-form">
                            {/* Full Name Input */}
                            <div className="reg-form-group">
                                <label htmlFor="name"><i className="fas fa-user"></i> Full Name</label>
                                <input 
                                    type="text" id="name" name="name" placeholder="Enter your full name" 
                                    value={formData.name} onChange={handleInputChange} required autoFocus 
                                />
                            </div>

                            {/* Email Input */}
                            <div className="reg-form-group">
                                <label htmlFor="email"><i className="fas fa-envelope"></i> Email Address</label>
                                <input 
                                    type="email" id="email" name="email" placeholder="Enter your email address" 
                                    value={formData.email} onChange={handleInputChange} required 
                                />
                            </div>

                            {/* Skills Input */}
                            <div className="reg-form-group">
                                <label htmlFor="skill"><i className="fas fa-tools"></i> Specialized Skills</label>
                                <input 
                                    type="text" id="skill" name="skill" placeholder="e.g. First Aid, Search & Rescue, Driving" 
                                    value={formData.skill} onChange={handleInputChange} required 
                                />
                            </div>

                            {/* Password Input */}
                            <div className="reg-form-group">
                                <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
                                <input 
                                    type="password" id="password" name="password" placeholder="Create a strong password" 
                                    value={formData.password} onChange={handleInputChange} required 
                                />
                            </div>

                            {/* Confirm Password Input */}
                            <div className="reg-form-group">
                                <label htmlFor="confirmPassword"><i className="fas fa-shield-alt"></i> Confirm Password</label>
                                <input 
                                    type="password" id="confirmPassword" name="confirmPassword" placeholder="Repeat your password" 
                                    value={formData.confirmPassword} onChange={handleInputChange} required 
                                />
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className={`reg-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                                <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
                                {!isLoading && <i className="fas fa-arrow-right"></i>}
                            </button>

                            {/* Redirect to Login Page Link */}
                            <div className="reg-login-link">
                                Already have an account? <Link to="/login">Sign In</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;