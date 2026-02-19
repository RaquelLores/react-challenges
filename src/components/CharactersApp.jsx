import React, { useState, useEffect } from 'react';

const useCharacters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredCharacters, setFilteredCharacters] = useState([]);

  const fetchCharacters = async (pageNum = 1, searchQuery = '', statusQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pageNum,
        ...(searchQuery && { name: searchQuery }),
        ...(statusQuery !== 'all' && { status: statusQuery })
      });
      
      const response = await fetch(`https://rickandmortyapi.com/api/character?${params}`);
      
      if (!response.ok) throw new Error('Error al cargar personajes');
      
      const data = await response.json();
      setCharacters(data.results || []);
      setTotalPages(data.info?.pages || 1);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(page, search, statusFilter);
  }, [page, search, statusFilter]);

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return {
    characters,
    loading,
    error,
    page,
    totalPages,
    search,
    statusFilter,
    filteredCharacters,
    setFilteredCharacters,
    fetchCharacters,
    handleSearch,
    handleStatusFilter,
    goToPage
  };
};

const CharacterCard = ({ character, onClick }) => (
  <div 
    className="character-card"
    onClick={() => onClick(character)}
    style={{
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
  >
    <img 
      src={character.image} 
      alt={character.name}
      style={{
        width: '100%',
        height: '200px',
        objectFit: 'cover'
      }}
    />
    <div style={{ padding: '20px' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{character.name}</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '4px 12px',
          background: character.status === 'Alive' ? '#51cf66' : 
                     character.status === 'Dead' ? '#ff6b6b' : '#ffd93d',
          color: 'white',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {character.status}
        </span>
        <span style={{
          padding: '4px 12px',
          background: '#e9ecef',
          color: '#495057',
          borderRadius: '20px',
          fontSize: '12px'
        }}>
          {character.species}
        </span>
        <span style={{
          padding: '4px 12px',
          background: '#007bff',
          color: 'white',
          borderRadius: '20px',
          fontSize: '12px'
        }}>
          {character.gender}
        </span>
      </div>
    </div>
  </div>
);

const CharacterDetail = ({ character, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  }}>
    <div style={{
      background: 'white',
      borderRadius: '12px',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
      width: '100%'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
        onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
        onMouseLeave={(e) => e.target.style.background = 'none'}
      >
        ×
      </button>
      
      <div style={{ padding: '40px 30px 30px' }}>
        <img 
          src={character.image} 
          alt={character.name}
          style={{
            width: '100%',
            maxWidth: '300px',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '12px',
            margin: '0 auto 20px',
            display: 'block'
          }}
        />
        <h2 style={{ textAlign: 'center', margin: '0 0 20px', color: '#333' }}>
          {character.name}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 10px', color: '#666' }}>Estado</h4>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{character.status}</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px', color: '#666' }}>Especie</h4>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{character.species}</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px', color: '#666' }}>Género</h4>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{character.gender}</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px', color: '#666' }}>Origen</h4>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>
              {character.origin?.name || 'Desconocido'}
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px', color: '#666' }}>Ubicación</h4>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>
              {character.location?.name || 'Desconocido'}
            </p>
          </div>
        </div>
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <h4 style={{ margin: '0 0 10px', color: '#666' }}>Aparece en {character.episode?.length || 0} episodios</h4>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {character.episode?.slice(0, 5).map((episode, idx) => (
              <div key={idx} style={{
                padding: '8px 12px',
                background: '#f8f9fa',
                marginBottom: '5px',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                {episode}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CharactersApp = () => {
  const {
    characters,
    loading,
    error,
    page,
    totalPages,
    search,
    statusFilter,
    handleSearch,
    handleStatusFilter,
    goToPage
  } = useCharacters();

  const [selectedCharacter, setSelectedCharacter] = useState(null);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '24px',
        color: '#666'
      }}>
        🔄 Cargando personajes...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#dc3545'
      }}>
        <h3>❌ Error</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        🎬 Rick & Morty - Buscador de Personajes
      </h2>

      {/* Filters & Search */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: 'white'
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="alive">Vivos</option>
          <option value="dead">Muertos</option>
          <option value="unknown">Desconocido</option>
        </select>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Página {page} de {totalPages}
        </div>
      </div>

      {/* Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            opacity: page === 1 ? 0.5 : 1
          }}
        >
          ← Anterior
        </button>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
            opacity: page === totalPages ? 0.5 : 1
          }}
        >
          Siguiente →
        </button>
      </div>

      {/* Characters Grid */}
      {characters.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#666'
        }}>
          <h3>📭 Sin resultados</h3>
          <p>No se encontraron personajes con "{search}" {statusFilter !== 'all' && `y estado "${statusFilter}"`}</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          {characters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={setSelectedCharacter}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCharacter && (
        <CharacterDetail
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  );
};

export default CharactersApp;
