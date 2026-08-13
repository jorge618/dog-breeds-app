import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [breeds, setBreeds] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [filteredBreeds, setFilteredBreeds] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch breeds when component mounts
  useEffect(() => {
    fetchBreeds();
  }, []);

  // Filter breeds when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBreeds(breeds);
    } else {
      const filtered = {};
      Object.entries(breeds).forEach(([breed, subBreeds]) => {
        if (breed.toLowerCase().includes(searchTerm.toLowerCase())) {
          filtered[breed] = subBreeds;
        }
      });
      setFilteredBreeds(filtered);
    }
  }, [searchTerm, breeds]);

  const fetchBreeds = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dog.ceo/api/breeds/list/all');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setBreeds(data.message);
        setFilteredBreeds(data.message);
        setError(null);
      } else {
        throw new Error('Failed to fetch breeds');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching breeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBreedClick = (breed) => {
    setSelectedBreed(breed);
  };

  const handleCloseModal = () => {
    setSelectedBreed(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <h1>🐕 Dog Breeds Explorer</h1>
          <p>Loading amazing dog breeds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h1>🐕 Dog Breeds Explorer Para Twisterito</h1>
          <p>Oops! Something went wrong: {error}</p>
          <button onClick={fetchBreeds}>Try Again</button>
        </div>
      </div>
    );
  }

  const breedCount = Object.keys(filteredBreeds).length;

  return (
    <div className="app">
      <header className="header">
        <h1>🐕 Dog Breeds Explorer para Twister</h1>
        <p>Discover {Object.keys(breeds).length} amazing dog breeds</p>
      </header>

      <div className="container">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search breeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <p className="search-results">Showing {breedCount} results</p>
          )}
        </div>

        <div className="breeds-grid">
          {Object.entries(filteredBreeds).map(([breed, subBreeds]) => (
            <div
              key={breed}
              className="breed-card"
              onClick={() => handleBreedClick(breed)}
            >
              <div className="breed-name">{breed}</div>
              {subBreeds.length > 0 && (
                <div className="sub-breeds">
                  <small>{subBreeds.length} sub-breed(s)</small>
                </div>
              )}
            </div>
          ))}
        </div>

        {breedCount === 0 && searchTerm && (
          <div className="no-results">
            <p>No breeds found matching "{searchTerm}"</p>
            <button onClick={() => setSearchTerm('')}>Clear Search</button>
          </div>
        )}
      </div>

      {/* Modal for breed details */}
      {selectedBreed && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModal}>✕</button>
            <h2>{selectedBreed}</h2>
            {breeds[selectedBreed].length > 0 ? (
              <div>
                <p><strong>Sub-breeds:</strong></p>
                <ul>
                  {breeds[selectedBreed].map((subBreed) => (
                    <li key={subBreed}>{subBreed}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No sub-breeds available.</p>
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Data from <a href="https://dog.ceo/dog-api/" target="_blank" rel="noopener noreferrer">Dog CEO API</a></p>
      </footer>
    </div>
  );
}

export default App;
