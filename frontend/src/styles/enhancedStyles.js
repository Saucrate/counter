export const enhancedStyles = {
  container: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    width: '95%',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      padding: '1.5rem',
      maxWidth: '600px'
    },
    '@media (max-width: 480px)': {
      padding: '1rem',
      maxWidth: '100%'
    }
  },
  counterContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
    position: 'relative'
  },
  glassPanel: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    borderRadius: '15px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
  },
  heading: {
    color: 'white',
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '600',
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  },
  counterValue: {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  button: {
    padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
    fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
    fontWeight: '600',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    '@media (max-width: 480px)': {
      width: '100%',
      marginBottom: '0.5rem'
    }
  },
  navButton: {
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    zIndex: 10,
    position: 'relative',
    pointerEvents: 'auto'
  },
  input: {
    width: '100%',
    padding: 'clamp(0.8rem, 2vw, 1rem)',
    marginBottom: 'clamp(0.8rem, 2vw, 1rem)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
    backdropFilter: 'blur(5px)',
    outline: 'none',
    transition: 'all 0.3s ease',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)'
    },
    '&:focus': {
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
    }
  }
};

export const animations = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  },
  counter: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  },
  button: {
    whileHover: { scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
    whileTap: { scale: 0.95 }
  }
}; 