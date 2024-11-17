# Mini Framework Documentation

## Introduction

Welcome to the Mini Framework! This framework is designed to simplify web application development by providing:

- **DOM Abstraction**: Create and manipulate the DOM using virtual DOM elements.
- **Routing System**: Manage navigation and synchronize the app state with the URL.
- **State Management**: Maintain a centralized application state accessible across components.
- **Event Handling**: Handle user interactions with an event system different from the standard `addEventListener`.

## Features of the Framework

### DOM Abstraction

- **createElement**: Create virtual DOM elements that represent real DOM nodes.
- **render**: Render virtual DOM elements into the real DOM efficiently.

### Routing System

- **Router**: A class to define routes and handle navigation without page reloads.

### State Management

- **Store**: A class to manage the application state and notify subscribers of changes.

### Event Handling

- **on**: Attach event listeners using event delegation for efficient event handling.
- **emit**: Emit custom events that can be listened to throughout the application.

## Code Examples and Usage

### Creating an Element

Use `createElement` to create virtual DOM elements.

```javascript
import { DOM } from './src/index.js';
const { createElement } = DOM;

const myElement = createElement('div', { class: 'container' }, [
  createElement('h1', {}, ['Hello, World!']),
  createElement('p', {}, ['This is a paragraph.'])
]);
