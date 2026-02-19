
import React, { useState, useEffect } from 'react';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', search: '' });

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title, description, priority) => {
    const newTodo = {
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const updateTodo = (id, updates) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter.status !== 'all' && todo.completed !== (filter.status === 'completed')) return false;
    if (filter.priority !== 'all' && todo.priority !== filter.priority) return false;
    if (filter.search && !todo.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo
  };
};

const TodoList = () => {
  const {
    todos, filter, setFilter, addTodo, toggleTodo, updateTodo, deleteTodo
  } = useTodos();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', priority: 'medium' });
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium' });

  const priorities = ['low', 'medium', 'high'];
  const statusOptions = ['all', 'pending', 'completed'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    
    addTodo(newTodo.title, newTodo.description, newTodo.priority);
    setNewTodo({ title: '', description: '', priority: 'medium' });
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditForm({ title: todo.title, description: todo.description, priority: todo.priority });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;
    updateTodo(editingId, editForm);
    setEditingId(null);
  };

  const stats = todos.reduce((acc, todo) => {
    acc.total++;
    if (todo.completed) acc.completed++;
    else acc.pending++;
    return acc;
  }, { total: 0, completed: 0, pending: 0 });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        📝 Gestor de Tareas Avanzado
      </h2>

      {/* Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        textAlign: 'center'
      }}>
        <div><strong>Total:</strong> {stats.total}</div>
        <div><strong>✅ Completadas:</strong> {stats.completed}</div>
        <div><strong>⏳ Pendientes:</strong> {stats.pending}</div>
      </div>

      {/* Filters */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center'
      }}>
        <select 
          value={filter.status} 
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt === 'all' ? 'Todas' : opt === 'pending' ? 'Pendientes' : 'Completadas'}</option>
          ))}
        </select>
        
        <select 
          value={filter.priority} 
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          <option value="all">Todas prioridades</option>
          {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>

        <input
          type="text"
          placeholder="Buscar tareas..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            flex: 1,
            minWidth: '200px'
          }}
        />
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', alignItems: 'end' }}>
          <input
            type="text"
            placeholder="Título de la tarea *"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            required
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <select
            value={newTodo.priority}
            onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          >
            {priorities.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ➕ Nueva Tarea
          </button>
        </div>
      </form>

      {/* Todos List */}
      {todos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <p>📭 No hay tareas {filter.status !== 'all' || filter.priority !== 'all' || filter.search ? 
            `que coincidan con "${filter.search || filter.status || filter.priority}"` : 
            'aún. ¡Crea la primera!'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {todos.map(todo => (
            <div key={todo.id} style={{
              padding: '20px',
              border: '1px solid #eee',
              borderRadius: '12px',
              background: todo.completed ? '#f8f9fa' : 'white',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginTop: '4px', cursor: 'pointer' }}
              />
              {editingId === todo.id ? (
                <form onSubmit={saveEdit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                    autoFocus
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical' }}
                    rows="2"
                  />
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                  >
                    {priorities.map(p => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      💾 Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#6c757d' : '#333'
                    }}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        color: '#666', 
                        fontSize: '14px' 
                      }}>
                        {todo.description}
                      </p>
                    )}
                    <span style={{
                      padding: '4px 12px',
                      background: todo.priority === 'high' ? '#ff6b6b' : 
                                  todo.priority === 'medium' ? '#ffd93d' : '#51cf66',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {todo.priority.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => startEdit(todo)}
                      style={{
                        padding: '8px 12px',
                        background: '#ffc107',
                        color: '#212529',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={{
                        padding: '8px 12px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
