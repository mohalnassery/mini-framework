import { Component } from '../../../src/core/component.js';
import { createElement } from '../../../src/core/dom.js';
import { Todo } from './Todo.js';

export class TodoList extends Component {
  render() {
    const { todos, onToggle, onDelete, onEdit } = this.props;
    return createElement('ul', { class: 'todo-list' },
      todos.map(todo => {
        const todoComponent = new Todo({ 
          todo, 
          onToggle, 
          onDelete, 
          onEdit,
          key: todo.id
        });
        return todoComponent.render();
      })
    );
  }
}