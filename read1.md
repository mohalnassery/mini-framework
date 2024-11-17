# Mini-Framework

An easy-to-use JavaScript framework that simplifies web development by abstracting common functionalities such as DOM manipulation, state management, event handling, and routing. This framework is designed to be lightweight and straightforward, making it ideal for learning and building simple web applications.

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
  - [File Overview](#file-overview)
- [Core Concepts](#core-concepts)
  - [What is the DOM?](#what-is-the-dom)
  - [What is State Management?](#what-is-state-management)
  - [What is Event Handling?](#what-is-event-handling)
  - [What is Routing?](#what-is-routing)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Using the Framework](#using-the-framework)
  - [Creating Elements](#creating-elements)
  - [Adding Attributes](#adding-attributes)
  - [Nesting Elements](#nesting-elements)
  - [Event Handling](#event-handling)
  - [State Management](#state-management)
  - [Routing](#routing)
- [Example: TodoMVC Application](#example-todomvc-application)
  - [Running the App](#running-the-app)
  - [Understanding the Code](#understanding-the-code)
- [Conclusion](#conclusion)
- [License](#license)

## Introduction

Welcome to the Mini-Framework! This project is a simple JavaScript framework that aims to help developers build web applications more efficiently by abstracting some of the common tasks involved in web development. It includes features like DOM abstraction, state management, event handling, and routing.

The framework is built from scratch without using any external libraries like React, Angular, or Vue. This makes it a great learning tool for understanding how frameworks work under the hood.

Even if you're new to web development, this documentation will guide you through the basics, explaining concepts in simple terms.

## Project Structure

The project is organized into several directories and files, each serving a specific purpose.

```
mini-framework/
├── src/
│   ├── core/
│   │   ├── dom.js
│   │   ├── events.js
│   │   ├── router.js
│   │   └── state.js
│   ├── utils/
│   │   └── helpers.js
│   └── index.js
├── examples/
│   └── todomvc/
│       ├── app.js
│       ├── index.html
│       └── styles.css
├── package.json
├── package-lock.json
├── README.md
└── project_documenter.py
```

### File Overview

#### src/

Contains the source code of the framework.

- **core/**: Core functionalities of the framework.
  - **dom.js**: Handles DOM abstraction and manipulation.
  - **events.js**: Manages event handling.
  - **router.js**: Implements the routing system.
  - **state.js**: Manages the application state.
- **utils/**: Utility functions.
  - **helpers.js**: Contains helper functions for DOM selection.
- **index.js**: Entry point that exports core modules for easier imports.

#### examples/

Contains example applications built using the framework.

- **todomvc/**: An implementation of the TodoMVC application using the Mini-Framework.
  - **app.js**: JavaScript code for the TodoMVC app.
  - **index.html**: HTML file for the TodoMVC app.
  - **styles.css**: CSS styles for the TodoMVC app.

#### Other Files

- **package.json**: Contains project metadata, including scripts and dependencies.
- **package-lock.json**: Automatically generated file that locks down the versions of installed packages.
- **README.md**: Documentation for the project (this file).
- **project_documenter.py**: A Python script to generate project documentation (not essential for using the framework).

## Core Concepts

Understanding some basic concepts will help you get the most out of the framework.

### What is the DOM?

The **Document Object Model (DOM)** is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content.

Think of the DOM as a tree of elements that make up your webpage. Each element, like a paragraph (`<p>`), a heading (`<h1>`), or a div (`<div>`), is a node in this tree.

By manipulating the DOM, you can dynamically change what's displayed on the page without needing to reload it.

### What is State Management?

**State** refers to the current data or status of your application. State management is about keeping track of this data and ensuring that when the state changes, the parts of your application that depend on it update accordingly.

For example, in a shopping cart application, the items in your cart are part of the state. When you add or remove items, the state changes, and the UI should update to reflect these changes.

### What is Event Handling?

An **event** is an action or occurrence recognized by software, often originating asynchronously from the external environment. Examples include user actions like clicking a button, moving a mouse, pressing a key, or system-generated events like a timer tick.

Event handling is about writing code that listens for these events and responds appropriately. This allows your application to be interactive and responsive to user input.

### What is Routing?

**Routing** in web applications is the mechanism by which URLs are mapped to different content or views. It allows users to navigate through the application using the browser's address bar or links within the app.

In a single-page application (SPA), routing changes the content displayed without reloading the entire page. This provides a smoother and faster user experience.

## Getting Started

### Prerequisites

To use this framework, you should have a basic understanding of HTML, CSS, and JavaScript. No prior experience with frameworks is necessary.

### Installation

Since this is a minimal framework, there is no need for complex installation steps. You can clone the repository and start using the framework directly.

```bash
git clone https://github.com/yourusername/mini-framework.git
```

Alternatively, you can copy the `src` directory into your project.

## Using the Framework

This section will guide you through using the various features of the framework.

### Creating Elements

To create elements, you use the `createElement` function from the `dom.js` module.

```javascript
import { DOM } from './src/index.js'; // Adjust the path as needed

const { createElement, render } = DOM;

const myElement = createElement('div', { class: 'my-class' }, [
  createElement('h1', {}, ['Hello World']),
  createElement('p', {}, ['This is a paragraph.']),
]);

// Render the element to the DOM
const container = document.getElementById('app');
render(myElement, container);
```

- **Tag**: The type of HTML element (e.g., 'div', 'p', 'h1').
- **Attributes**: An object of attributes to set on the element (e.g., class, id).
- **Children**: An array of child elements or strings.

This approach allows you to build your webpage structure programmatically.

### Adding Attributes

Attributes are passed as the second argument in `createElement`.

```javascript
const element = createElement('input', {
  type: 'text',
  placeholder: 'Enter your name',
  id: 'name-input',
});
```

You can set any valid HTML attributes, such as `type`, `class`, `id`, `value`, etc.

### Nesting Elements

You can nest elements by including them in the `children` array.

```javascript
const nestedElement = createElement('div', {}, [
  createElement('ul', {}, [
    createElement('li', {}, ['Item 1']),
    createElement('li', {}, ['Item 2']),
    createElement('li', {}, ['Item 3']),
  ]),
]);
```

This creates a `<div>` containing an unordered list with three list items.

### Event Handling

To handle events, you use the `Events` module.

```javascript
import { Events } from './src/index.js';

// Define a handler function
function handlerFunction(event) {
  console.log('Button clicked!');
}

// Add an event listener
Events.on('click', '#my-button', handlerFunction);

// Remove an event listener
Events.off('click', '#my-button', handlerFunction);

// Emit a custom event
Events.emit('custom-event', { data: 'example' });
```

**Explanation:**

- **Events.on(eventType, selector, handler)**: Adds an event listener for the specified event type and selector.
  - **eventType**: The type of event (e.g., 'click', 'keypress').
  - **selector**: A CSS selector string to match elements.
  - **handler**: The function to call when the event occurs.
- **Events.off(eventType, selector, handler)**: Removes the event listener.
- **Events.emit(eventType, detail)**: Emits a custom event with optional data.

**Example:**

```javascript
// Handle click on any element with class 'button'
Events.on('click', '.button', function(event) {
  alert('Button clicked!');
});
```

### State Management

Use the `Store` class from `state.js` to manage application state.

```javascript
import { Store } from './src/index.js';

const initialState = {
  count: 0,
};

const store = new Store(initialState);

// Get current state
const state = store.getState();
console.log(state.count); // Outputs: 0

// Update state
store.setState({ count: state.count + 1 });

// Subscribe to state changes
store.subscribe((newState) => {
  console.log('State updated:', newState);
});
```

**Explanation:**

- **Store(initialState)**: Creates a new store with the given initial state.
- **store.getState()**: Retrieves the current state.
- **store.setState(newState)**: Updates the state with the provided changes.
- **store.subscribe(listener)**: Adds a listener function that is called whenever the state changes.

### Routing

Use the `Router` class from `router.js` to handle routing.

```javascript
import { Router } from './src/index.js';

const router = new Router();

// Define routes
router.addRoute('', () => {
  console.log('Home page');
});

router.addRoute('about', () => {
  console.log('About page');
});

// Navigate to a route programmatically
router.navigate('about');
```

**Explanation:**

- **Router()**: Creates a new router instance.
- **router.addRoute(path, action)**: Defines a new route.
  - **path**: The URL path (after the `#` symbol).
  - **action**: The function to execute when the route is accessed.
- **router.navigate(path)**: Changes the URL to the specified path and loads the route.
- The router listens for changes in the URL hash (the part after `#`) and calls the corresponding action.

**Example:**

```javascript
router.addRoute('contact', () => {
  console.log('Contact page');
});

// When the URL changes to `#contact`, 'Contact page' is logged.
```

## Example: TodoMVC Application

The `examples/todomvc` directory contains a full example of a TodoMVC application built using the Mini-Framework.

### Running the App

1. Navigate to the `examples/todomvc` directory.
2. Open `index.html` in your web browser.
3. You should see a TodoMVC interface where you can add, complete, and remove todos.

### Understanding the Code

The TodoMVC app demonstrates how to use the framework's features together.

**Key Features Implemented:**

- **DOM Manipulation**: Uses `createElement` and `render` to build the UI dynamically based on the application state.
- **State Management**: Stores the list of todos and the current filter in the `Store`. The UI updates automatically when the state changes.
- **Event Handling**: Uses `Events.on` to handle user interactions like adding a todo, toggling completion, and deleting a todo.
- **Routing**: Uses the URL hash to filter todos (e.g., `#/active`, `#/completed`).

**Code Highlights:**

- **Adding a Todo**

```javascript
Events.on('keypress', '.new-todo', function(event) {
  if (event.key === 'Enter' && event.target.value.trim()) {
    addTodo(event.target.value.trim());
    event.target.value = '';
  }
});

function addTodo(title) {
  const newTodo = {
    id: Date.now().toString(),
    title,
    completed: false,
  };
  const todos = [...store.getState().todos, newTodo];
  store.setState({ todos });
}
```

When the user presses Enter in the input field, a new todo is added to the state.

- **Rendering the UI**

```javascript
function renderApp(state) {
  // Build the virtual DOM based on the current state
  // ...

  // Render the virtual DOM to the real DOM
  render(appElement, app);
}

// Subscribe to state changes
store.subscribe(state => {
  // Save todos to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
  
  // Re-render the app
  renderApp(state);
});
```

The `renderApp` function rebuilds the UI whenever the state changes.

- **Filtering Todos**

```javascript
function setFilter(filter) {
  store.setState({ filter });
}

window.addEventListener('hashchange', () => {
  const filter = location.hash.replace('#/', '') || 'all';
  setFilter(filter);
});
```

The filter is updated based on the URL hash, and the UI updates accordingly.

## Conclusion

The Mini-Framework is a simple yet powerful tool for building web applications. It abstracts away some of the complexities of web development, allowing you to focus on building features.

By understanding the concepts of the DOM, state management, event handling, and routing, you can use this framework to build interactive and responsive applications.

Feel free to explore the code and modify it to suit your needs. This framework is also a great starting point if you're interested in learning how larger frameworks like React or Vue work under the hood.

## License

This project is open-source and available under the [MIT License](LICENSE).