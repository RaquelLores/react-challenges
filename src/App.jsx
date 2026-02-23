import React, { useState } from 'react';
import Counter from './components/Counter';
import TodoList from './components/TodoList';
import CharactersApp from './components/CharactersApp';
import TicTacToe from './components/TicTacToe';


const App = () => {
  const [activeChallenge, setActiveChallenge] = useState('counter');

  const challenges = [
    { id: 'counter', name: 'Contador', component: <Counter /> },
    { id: 'todos', name: 'Lista Tareas', component: <TodoList /> },
    { id: 'characters', name: 'Personajes API', component: <CharactersApp /> },
    { id: 'tictactoe', name: 'Tres en Raya', component: <TicTacToe /> }
  ];
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🎯 Pruebas Técnicas React</h1>
      
      {/* nav menu */}
      <nav style={{ marginBottom: '30px' }}>
        {challenges.map(({ id, name }) => (
          <button
            key={id}
            onClick={() => setActiveChallenge(id)}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              border: activeChallenge === id ? '2px solid #007bff' : '1px solid #ccc',
              background: activeChallenge === id ? '#007bff' : '#f8f9fa',
              color: activeChallenge === id ? 'white' : 'black',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {name}
          </button>
        ))}
      </nav>

      {/* Active Challenge Content */}
      <main>
        {challenges.find(c => c.id === activeChallenge)?.component}
      </main>
    </div>
  );
};

export default App;