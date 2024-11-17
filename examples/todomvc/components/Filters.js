import { Component } from '../../../src/core/component.js';
import { createElement } from '../../../src/core/dom.js';

export class Filters extends Component {
  render() {
    const { currentFilter, onFilterChange } = this.props;
    return createElement('ul', { class: 'filters' }, [
      ['all', 'active', 'completed'].map(filter => 
        createElement('li', {}, [
          createElement('a', {
            href: `#/${filter === 'all' ? '' : filter}`,
            class: currentFilter === filter ? 'selected' : '',
            onClick: (e) => {
              e.preventDefault();
              onFilterChange(filter);
            }
          }, [filter.charAt(0).toUpperCase() + filter.slice(1)])
        ])
      )
    ]);
  }
}