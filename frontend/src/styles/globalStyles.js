export const colors = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  accent: '#FFC107',
  error: '#f44336',
  background: 'rgba(255, 255, 255, 0.9)',
  text: '#2c3e50'
};

export const formStyles = {
  container: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    overflow: 'hidden'
  },
  input: {
    width: '100%',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '2px solid rgba(44, 62, 80, 0.1)',
    background: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: 'none',
    background: colors.primary,
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem'
  }
}; 