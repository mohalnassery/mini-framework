import { Component } from '../../../src/core/component.js';
import { createElement } from '../../../src/core/dom.js';

export class Todo extends Component {
  render() {
    const { todo, onToggle, onDelete, onEdit } = this.props;
    
    return createElement('li', {
      class: `${todo.completed ? 'completed' : ''} ${todo.editing ? 'editing' : ''}`,
      'data-id': todo.id,
      key: todo.id
    }, [
      createElement('div', { class: 'view' }, [
        createElement('div', { class: 'toggle-container' }, [
          createElement('input', {
            class: 'toggle',
            type: 'checkbox',
            checked: todo.completed,
            onChange: () => onToggle(todo.id)
          }, []),
          createElement('label', {
            onDblClick: () => onEdit(todo.id)
          }, [todo.title]),
        ]),
        createElement('button', {
          class: 'destroy',
          onClick: () => onDelete(todo.id)
        }, [])
      ]),
      createElement('input', {
        class: 'edit',
        value: todo.title,
        'data-original-value': todo.title
      }, [])
    ]);
  }
}