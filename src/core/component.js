export class Component {
    constructor(props = {}) {
      this.props = props;
      this.state = {};
    }
  
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.render();
    }
  
    render() {
      throw new Error('Component must implement render method');
    }
  }