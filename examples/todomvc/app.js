import { Store } from '../../src/core/state.js';
import { createElement, render } from '../../src/core/dom.js';
import * as Events from '../../src/core/events.js';
import { Header } from './components/Header.js';
import { TodoList } from './components/TodoList.js';
import { localStorageMiddleware } from './store/middleware.js';

// Constants
const STORAGE_KEY = 'todos-miniframework';

// Initialize store
let store;

// Event handlers
function setupEventHandlers() {
  // No need to remove event listeners since we're using event delegation
  // and the handlers are stored in a WeakMap

  // Add new todo
  Events.on('keypress', '.new-todo', function(event) {
    if (event.key === 'Enter' && event.target.value.trim()) {
      event.preventDefault();
      const title = event.target.value.trim();
      addTodo(title);
      event.target.value = '';
    }
  });

  // Toggle todo completion
  Events.on('click', '.toggle', function(event) {
    const li = event.target.closest('li');
    toggleTodoCompletion(li.dataset.id);
  });

  // Delete todo
  Events.on('click', '.destroy', function(event) {
    const li = event.target.closest('li');
    deleteTodo(li.dataset.id);
  });

  // Toggle all
  Events.on('click', '#toggle-all', function(event) {
    const checked = event.target.checked;
    toggleAll(checked);
  });

  // Clear completed
  Events.on('click', '.clear-completed-btn', function() {
    clearCompletedTodos();
  });

  // Edit todo on double click
  Events.on('dblclick', '.todo-list label', function(event) {
    const li = event.target.closest('li');
    const id = li.dataset.id;
    const input = li.querySelector('.edit');
    
    // Update the editing state in the store
    const todos = store.getState().todos.map(todo =>
      todo.id === id ? { ...todo, editing: true } : todo
    );
    store.setState({ todos, lastChangedProp: 'todos' });
    
    // Focus the input and move cursor to end
    input.focus();
    input.value = input.value;
    input.dataset.originalValue = input.value;
  });

  // Handle edit completion
  Events.on('blur', '.edit', finishEditing);
  Events.on('keydown', '.edit', function(event) {
    if (event.key === 'Enter') {
      event.target.blur();
    } else if (event.key === 'Escape') {
      const li = event.target.closest('li');
      const id = li.dataset.id;
      const input = event.target;
      
      // Restore original value and remove editing state in store
      input.value = input.dataset.originalValue;
      const todos = store.getState().todos.map(todo =>
        todo.id === id ? { ...todo, editing: false } : todo
      );
      store.setState({ todos, lastChangedProp: 'todos' });
    }
  });

  // Filter clicks
  Events.on('click', '.filters a', function(event) {
    event.preventDefault();
    const filter = event.target.getAttribute('href').replace('#/', '') || 'all';
    setFilter(filter);
  });
}

// State manipulation functions
function addTodo(title) {
  const currentState = store.getState();
  const newTodo = {
    id: Date.now().toString(),
    title,
    completed: false,
    editing: false
  };
  const todos = [...currentState.todos, newTodo];
  store.setState({ todos, lastChangedProp: 'todos' });
  renderApp(store.getState());
}
function toggleTodoCompletion(id) {
  const todos = store.getState().todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  store.setState({ todos, lastChangedProp: 'todos' });

}

function deleteTodo(id) {
  const todos = store.getState().todos.filter(todo => todo.id !== id);
  store.setState({ todos, lastChangedProp: 'todos' });
}

function clearCompletedTodos() {
  const currentState = store.getState();
  const remainingTodos = currentState.todos.filter(todo => !todo.completed);
  
  // Update state with remaining todos
  store.setState({ 
    todos: remainingTodos,
    lastChangedProp: 'todos'
  });
}

function toggleAll(checked) {
  const todos = store.getState().todos.map(todo => ({
    ...todo,
    completed: checked
  }));
  store.setState({ todos, lastChangedProp: 'todos' });
}

function finishEditing(event) {
  const input = event.target;
  const li = input.closest('li');
  const id = li.dataset.id;
  const newTitle = input.value.trim();

  if (newTitle) {
    const todos = store.getState().todos.map(todo =>
      todo.id === id ? { ...todo, title: newTitle, editing: false } : todo
    );
    store.setState({ todos, lastChangedProp: 'todos' });
  } else {
    deleteTodo(id);
  }
}

// Filter functions
function getFilteredTodos(todos, filter) {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

function setFilter(filter) {
  store.setState({ filter, lastChangedProp: 'filter' });
  window.history.pushState(null, '', `#/${filter === 'all' ? '' : filter}`);
  updateFilterUI(filter);
  renderApp(store.getState());
}
function updateFilterUI(currentFilter) {
  // Remove selected class from all filter links
  document.querySelectorAll('.filters a').forEach(link => {
    link.classList.remove('selected');
  });
  
  // Add selected class to current filter link
  const filterLink = document.querySelector(`.filters a[href="#/${currentFilter === 'all' ? '' : currentFilter}"]`);
  if (filterLink) {
    filterLink.classList.add('selected');
  }
}

// Render function
function renderApp(state) {
  const filteredTodos = getFilteredTodos(state.todos, state.filter);
  const remainingTasks = state.todos.filter(todo => !todo.completed).length;
  const taskText = `${remainingTasks} ${remainingTasks === 1 ? 'task' : 'tasks'} left`;

  const appContent = createElement('div', { class: 'todoapp' }, [
    new Header({ onNewTodo: addTodo }).render(),
    createElement('section', { class: 'main', style: state.todos.length === 0 ? 'display: none' : '' }, [
      // Create a container div for controls
      createElement('div', { class: 'main-controls' }, [
        // Clear completed button
        createElement('button', {
          class: 'clear-completed-btn',
          style: state.todos.some(todo => todo.completed) ? 'display: inline-block' : 'display: none'
        }, ['Clear completed'])
      ]),
      // TodoList component
      new TodoList({
        todos: filteredTodos,
        onToggle: toggleTodoCompletion,
        onDelete: deleteTodo,
        onEdit: (id) => {
          const todos = state.todos.map(todo =>
            todo.id === id ? { ...todo, editing: true } : todo
          );
          store.setState({ todos, lastChangedProp: 'todos' });
        }
      }).render()
    ]),
    createElement('footer', { 
      class: 'footer',
      style: state.todos.length === 0 ? 'display: none' : ''
    }, [
      // Toggle all container
      createElement('div', { class: 'toggle-all-container' }, [
        createElement('input', {
          id: 'toggle-all',
          class: 'toggle-all',
          type: 'checkbox',
          checked: filteredTodos.every(todo => todo.completed)
        }, []),
        createElement('label', { for: 'toggle-all' }, ['Mark all as complete'])
      ]),

      // Tasks counter div
      createElement('div', { class: 'todo-count' }, [
        createElement('p', {}, [taskText])
      ]),
    ])
  ]);

  const appContainer = document.getElementById('app');
  render(appContent, appContainer);
}

// Initialize the application
function initApp() {
  const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const initialFilter = location.hash.replace('#/', '') || 'all';
  
  // Create the store
  store = new Store({
    todos: savedTodos,
    filter: initialFilter,
    lastChangedProp: null
  }, [
    localStorageMiddleware(STORAGE_KEY)
  ]);

  // Setup event handlers first
  setupEventHandlers();

  // Update UI to show correct filter tab
  updateFilterUI(initialFilter);
  
  // Modify subscription to use requestAnimationFrame properly
  store.subscribe((state) => {
    if (state.lastChangedProp === 'todos') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
      // Force a fresh render with the latest state
      window.requestAnimationFrame(() => {
        renderApp(store.getState());  // This will render with the updated count
      });
    }
  });

  // Setup routing
  window.addEventListener('hashchange', () => {
    const route = location.hash.replace('#/', '') || 'all';
    store.setState({ filter: route, lastChangedProp: 'filter' });
    renderApp(store.getState());
  });

  // Initial render
  renderApp(store.getState());

  setupThemeToggle();
}

function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', 
    localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light')
  );

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
