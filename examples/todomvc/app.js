// app.js
import { DOM, Store, Events } from '../../src/index.js';

const { createElement, render } = DOM;

const STORAGE_KEY = 'todos-miniframework';

const initialState = {
  todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
  filter: 'all',
};

const store = new Store(initialState);

store.subscribe(state => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
  renderApp(state);
});
function renderApp(state) {
  const app = document.getElementById('app');

  const visibleTodos = state.todos.filter(todo => {
    if (state.filter === 'all') return true;
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
  });

  const todoItems = visibleTodos.map(todo =>
    createElement('li', { 'data-id': todo.id, class: todo.completed ? 'completed' : '' }, [
      createElement('div', { class: 'view' }, [
        createElement('input', { class: 'toggle', type: 'checkbox', checked: todo.completed }, []),
        createElement('label', {}, [todo.title]),
        createElement('button', { class: 'destroy' }, [])
      ]),
      createElement('input', { class: 'edit', value: todo.title }, [])
    ])
  );

  const mainSection = createElement('section', { class: 'main' }, [
    createElement('input', { id: 'toggle-all', class: 'toggle-all', type: 'checkbox' }, []),
    createElement('label', { for: 'toggle-all' }, ['Mark all as complete']),
    createElement('ul', { class: 'todo-list' }, todoItems)
  ]);

  const footerSection = createElement('footer', { class: 'footer' }, [
    createElement('span', { class: 'todo-count' }, [
      createElement('strong', {}, [state.todos.filter(todo => !todo.completed).length]),
      ' items left'
    ]),
    createElement('ul', { class: 'filters' }, [
      createElement('li', {}, [
        createElement('a', { href: '#/', class: state.filter === 'all' ? 'selected' : '' }, ['All'])
      ]),
      createElement('li', {}, [
        createElement('a', { href: '#/active', class: state.filter === 'active' ? 'selected' : '' }, ['Active'])
      ]),
      createElement('li', {}, [
        createElement('a', { href: '#/completed', class: state.filter === 'completed' ? 'selected' : '' }, ['Completed'])
      ])
    ]),
    state.todos.some(todo => todo.completed) ? createElement('button', { class: 'clear-completed' }, ['Clear completed']) : null
  ]);

  const headerSection = createElement('header', { class: 'header' }, [
    createElement('h1', {}, ['todos']),
    createElement('input', {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: true,
      type: 'text'
    }, [])
  ]);

  const appChildren = [headerSection];

  if (state.todos.length > 0) {
    appChildren.push(mainSection, footerSection);
  }

  const appElement = createElement('section', { class: 'todoapp' }, appChildren);

  render(appElement, app);
}

// Event Handlers
Events.on('keypress', '.new-todo', function(event) {
  if (event.key === 'Enter' && event.target.value.trim()) {
    addTodo(event.target.value.trim());
    event.target.value = '';
  }
});

Events.on('click', '.toggle', function(event) {
  const id = event.target.closest('li').getAttribute('data-id');
  toggleTodoCompletion(id);
});

Events.on('click', '.destroy', function(event) {
  const id = event.target.closest('li').getAttribute('data-id');
  deleteTodo(id);
});

Events.on('click', '.clear-completed', function() {
  clearCompletedTodos();
});

Events.on('click', '.filters a', function(event) {
  event.preventDefault();
  const filter = event.target.getAttribute('href').replace('#/', '') || 'all';
  setFilter(filter);
});

Events.on('dblclick', '.view label', function(event) {
  const li = event.target.closest('li');
  li.classList.add('editing');
  const editInput = li.querySelector('.edit');
  editInput.focus();
});

Events.on('keypress', '.edit', function(event) {
  if (event.key === 'Enter') {
    finishEditing(event);
  }
});

Events.on('blur', '.edit', function(event) {
  finishEditing(event);
});

Events.on('click', '#toggle-all', function(event) {
  const isChecked = event.target.checked;
  const todos = store.getState().todos.map(todo => ({
    ...todo,
    completed: isChecked
  }));
  store.setState({ todos });
});

// State manipulation functions
function addTodo(title) {
  const newTodo = {
    id: Date.now().toString(),
    title,
    completed: false,
  };
  const todos = [...store.getState().todos, newTodo];
  store.setState({ todos });
}

function toggleTodoCompletion(id) {
  const todos = store.getState().todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  store.setState({ todos });
}

function deleteTodo(id) {
  const todos = store.getState().todos.filter(todo => todo.id !== id);
  store.setState({ todos });
}

function clearCompletedTodos() {
  const todos = store.getState().todos.filter(todo => !todo.completed);
  store.setState({ todos });
}

function setFilter(filter) {
  store.setState({ filter });
}

function finishEditing(event) {
  const li = event.target.closest('li');
  const id = li.getAttribute('data-id');
  const title = event.target.value.trim();
  if (title) {
    const todos = store.getState().todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    );
    store.setState({ todos });
    li.classList.remove('editing');
  } else {
    deleteTodo(id);
  }
}

// Initialize the application
window.addEventListener('load', () => {
  const filter = location.hash.replace('#/', '') || 'all';
  setFilter(filter);
});

window.addEventListener('hashchange', () => {
  const filter = location.hash.replace('#/', '') || 'all';
  setFilter(filter);
});

renderApp(store.getState());

