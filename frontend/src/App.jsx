import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';
import LoadingOverlay from './components/LoadingOverlay';
import { enhancedStyles as styles, animations } from './styles/enhancedStyles';
import axios from 'axios';
import { API_URL } from './config';

function App() {
    const [view, setView] = useState('login'); // login, signup, profile, counter
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
    });
    const [count, setCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData(token);
        }
    }, []);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                password: '' // Clear password field
            }));
        }
    }, [user]);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUser(response.data);
            setCount(response.data.counter);
            setView('counter');
        } catch (err) {
            console.error('Fetch user error:', err);
            localStorage.removeItem('token');
            setUser(null);
            setError('Session expired. Please login again.');
            setView('login');
        }
    };

    const login = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.post(`${API_URL}/auth/login`, {
                username: formData.username,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setView('counter');
            setError(null);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const signup = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`${API_URL}/auth/signup`, {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setView('counter');
            setError(null);
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || 'Failed to signup');
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (type) => {
        try {
            if (type === 'login') {
                await login();
            } else if (type === 'signup') {
                await signup();
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.response?.data?.message || err.message || 'Authentication failed');
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Create update data object, excluding empty password
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            };
            
            // Only include password if it's not empty
            if (formData.password) {
                updateData.password = formData.password;
            }

            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/user`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setUser(response.data);
            setView('counter');
            setError(null);
        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const updateCounter = async (action) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            console.log('Updating counter:', action); // Debug log
            
            const response = await axios.post(
                `${API_URL}/counter/${action}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Counter response:', response.data); // Debug log
            
            if (response.data.count !== undefined) {
                setUser(prev => ({ ...prev, counter: response.data.count }));
            } else {
                console.error('Invalid counter response:', response.data);
            }
        } catch (err) {
            console.error('Counter update error:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
                setView('login');
            }
            setError('Failed to update counter');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setView('login');
        setFormData({
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: ''
            });
    };

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <LoadingOverlay isLoading={loading} />
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: 'white', marginTop: '2rem' }}
                >
                    Loading...
                </motion.h2>
            </div>
        );
    }

    return (
        <>
            <ThreeBackground />
            <LoadingOverlay isLoading={loading} />
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    {...animations.container}
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 'clamp(1rem, 3vw, 2rem)',
                        boxSizing: 'border-box'
                    }}
                >
                    {(view === 'login' || view === 'signup') && (
                        <motion.div style={styles.container}>
                            <motion.h1 
                                style={styles.heading}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {view === 'login' ? 'Welcome Back' : 'Join Us'}
                            </motion.h1>
                            
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ 
                                        color: '#FF6B6B',
                                        marginBottom: '1rem',
                                        textAlign: 'center',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleAuth(view);
                            }}>
                                {view === 'signup' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <input
                                            style={styles.input}
                                            type="text"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        />
                                        <input
                                            style={styles.input}
                                            type="text"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        />
                                        <input
                                            style={styles.input}
                                            type="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </motion.div>
                                )}
                                
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <input
                                        style={styles.input}
                                        type="text"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                    />
                                    <input
                                        style={styles.input}
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    />
                                </motion.div>

                                <motion.button
                                    {...animations.button}
                                    style={styles.button}
                                    type="submit"
                                >
                                    {view === 'login' ? 'Login' : 'Sign Up'}
                                </motion.button>
                            </form>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{ 
                                    textAlign: 'center',
                                    marginTop: '1.5rem',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <motion.span
                                    style={{ 
                                        color: '#4ECDC4',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                                >
                                    {view === 'login' ? 'Sign Up' : 'Login'}
                                </motion.span>
                            </motion.p>
                        </motion.div>
                    )}

                    {view === 'counter' && (
                        <motion.div
                            style={{
                                ...styles.container,
                                maxWidth: '900px'
                            }}
                            {...animations.container}
                        >
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    zIndex: 10
                                }}
                            >
                                <motion.button
                                    {...animations.button}
                                    onClick={() => setView('profile')}
                                    style={{
                                        ...styles.navButton,
                                        position: 'relative'
                                    }}
                                >
                                    Profile
                                </motion.button>
                                <motion.button
                                    {...animations.button}
                                    onClick={logout}
                                    style={{
                                        ...styles.navButton,
                                        background: 'rgba(255, 107, 107, 0.2)',
                                        position: 'relative'
                                    }}
                                >
                                    Logout
                                </motion.button>
                            </motion.div>

                            <motion.div style={styles.counterContainer}>
                                <motion.h1
                                    style={styles.heading}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                >
                                    Welcome, {user?.firstName || user?.username}!
                                </motion.h1>

                                <motion.div
                                    style={styles.glassPanel}
                                    {...animations.counter}
                                >
                                    <motion.span
                                        key={count}
                                        style={styles.counterValue}
                                        initial={{ scale: 1.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        {count}
                                    </motion.span>
                                </motion.div>

                                <motion.div
                                    style={{
                                        display: 'flex',
                                        gap: '2rem',
                                        marginTop: '2rem'
                                    }}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <motion.button
                                        {...animations.button}
                                        onClick={() => updateCounter('decrease')}
                                        style={{
                                            ...styles.button,
                                            background: 'rgba(255, 107, 107, 0.2)'
                                        }}
                                    >
                                        Decrease
                                    </motion.button>
                                    <motion.button
                                        {...animations.button}
                                        onClick={() => updateCounter('increase')}
                                        style={{
                                            ...styles.button,
                                            background: 'rgba(78, 205, 196, 0.2)'
                                        }}
                                    >
                                        Increase
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}

                    {view === 'profile' && (
                        <motion.div
                            style={styles.container}
                            {...animations.container}
                        >
                            <motion.h1 
                                style={styles.heading}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                            >
                                Profile Settings
                            </motion.h1>
                            
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ 
                                        color: '#FF6B6B',
                                        marginBottom: '1rem',
                                        textAlign: 'center',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateProfile();
                            }}>
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                />
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                />
                                <input
                                    style={styles.input}
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                />
                                <input
                                    style={styles.input}
                                    type="password"
                                    placeholder="New Password (leave empty to keep current)"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                />

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <motion.button
                                        {...animations.button}
                                        onClick={() => {
                                            setError(null);
                                            setView('counter');
                                            // Reset form data to current user data
                                            setFormData({
                                                ...formData,
                                                firstName: user.firstName || '',
                                                lastName: user.lastName || '',
                                                email: user.email || '',
                                                password: ''
                                            });
                                        }}
                                        style={{
                                            ...styles.button,
                                            background: 'rgba(255, 107, 107, 0.2)'
                                        }}
                                        type="button"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        {...animations.button}
                                        style={styles.button}
                                        type="submit"
                                    >
                                        Save Changes
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    );
}

export default App;
