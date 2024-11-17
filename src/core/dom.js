// dom.js
export function createElement(tag, attrs = {}, children = []) {
  return { tag, attrs, children };
}

export function render(vdom, container) {
  const dom = _renderElement(vdom);
  container.innerHTML = '';
  container.appendChild(dom);
}

function _renderElement(vdom) {
  if (vdom === null || vdom === undefined) return document.createTextNode('');
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom.toString());
  }
  
  const { tag, attrs, children } = vdom;
  const element = document.createElement(tag);

  // Set attributes
  for (const [attr, value] of Object.entries(attrs)) {
    if (value === false || value === null || value === undefined) continue;
    if (value === true) {
      element.setAttribute(attr, '');
    } else {
      element.setAttribute(attr, value.toString());
    }
  }

  // Append children
  children.filter(child => child !== null && child !== undefined)
    .forEach(child => {
      element.appendChild(_renderElement(child));
    });

  return element;
}
