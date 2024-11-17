import { Component } from '../../../src/core/component.js';
import { createElement } from '../../../src/core/dom.js';

export class Header extends Component {
  render() {
    const { onNewTodo } = this.props;
    return createElement('header', { class: 'header' }, [
      createElement('h1', {}, ['todos']),
      createElement('input', {
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        onKeyPress: (event) => {
          if (event.key === 'Enter' && event.target.value.trim()) {
            onNewTodo(event.target.value.trim());
            event.target.value = '';
          }
        }
      }, [])
    ]);
  }
}