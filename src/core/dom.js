// dom.js
// Types of patch operations
const PATCH_TYPES = {
  CREATE: 'CREATE',
  REMOVE: 'REMOVE',
  REPLACE: 'REPLACE',
  UPDATE_ATTRS: 'UPDATE_ATTRS',
  UPDATE_TEXT: 'UPDATE_TEXT'
};

class DOMError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DOMError';
  }
}

export function createElement(tag, attrs = {}, children = []) {
  try {
    if (!tag || typeof tag !== 'string') {
      throw new DOMError('Tag must be a non-empty string');
    }
    if (typeof attrs !== 'object') {
      throw new DOMError('Attributes must be an object');
    }
    if (!Array.isArray(children)) {
      throw new DOMError('Children must be an array');
    }
    
    const { key, ...restAttrs } = attrs;
    return { tag, attrs: restAttrs, children, key };
  } catch (error) {
    console.error('Error in createElement:', error);
    throw error;
  }
}

export function render(newVdom, container) {
  if (!container) {
    console.error('Invalid container element');
    return;
  }
  const oldVdom = container._vdom || null;
  const patches = diff(oldVdom, newVdom);
  applyPatches(container, patches);

  container._vdom = newVdom;
}

function diff(oldVdom, newVdom) {
  // Handle null/undefined cases first
  if (oldVdom === null || oldVdom === undefined) {
    return { type: PATCH_TYPES.CREATE, vdom: newVdom };
  }
  if (newVdom === null || newVdom === undefined) {
    return { type: PATCH_TYPES.REMOVE };
  }
  
  // Handle primitive values
  if (typeof newVdom !== 'object' || !newVdom) {
    if (oldVdom !== newVdom) {
      return { type: PATCH_TYPES.UPDATE_TEXT, value: newVdom };
    }
    return null;
  }

  // Handle virtual DOM nodes
  if (!oldVdom.tag || !newVdom.tag) {
    return { type: PATCH_TYPES.REPLACE, vdom: newVdom };
  }
  if (oldVdom.tag !== newVdom.tag) {
    return { type: PATCH_TYPES.REPLACE, vdom: newVdom };
  }

  const attrsPatch = diffAttrs(oldVdom.attrs || {}, newVdom.attrs || {});
  const childrenPatch = diffChildren(
    oldVdom.children || [], 
    newVdom.children || []
  );

  if (!attrsPatch && !childrenPatch) {
    return null;
  }

  return {
    type: PATCH_TYPES.UPDATE_ATTRS,
    attrs: attrsPatch,
    children: childrenPatch,
    vdom: newVdom
  };
}

function diffAttrs(oldAttrs, newAttrs) {
  const patches = {};
  let hasChanges = false;

  // Check for changed/new attributes
  for (const [key, value] of Object.entries(newAttrs)) {
    // Special handling for boolean attributes like 'checked'
    if (key === 'checked' || key === 'selected' || key === 'disabled') {
      if (!!oldAttrs[key] !== !!value) {
        patches[key] = !!value;
        hasChanges = true;
      }
    } else if (oldAttrs[key] !== value) {
      patches[key] = value;
      hasChanges = true;
    }
  }

  // Check for removed attributes
  for (const key in oldAttrs) {
    if (!(key in newAttrs)) {
      patches[key] = null;
      hasChanges = true;
    }
  }

  return hasChanges ? patches : null;
}

function diffChildren(oldChildren, newChildren) {
  const patches = [];

  newChildren.forEach((newChild, i) => {
    const oldChild = oldChildren.find(child => 
      child && child.key === newChild.key
    );
    
    if (oldChild) {
      const patch = diff(oldChild, newChild);
      if (patch) {
        patches[i] = patch;
      }
    } else {
      patches[i] = { type: PATCH_TYPES.CREATE, vdom: newChild };
    }
  });

  // Remove any children not in new list
  oldChildren.forEach((oldChild, i) => {
    if (oldChild && !newChildren.find(child => child.key === oldChild.key)) {
      patches[i] = { type: PATCH_TYPES.REMOVE };
    }
  });

  return patches.length > 0 ? { patches } : null;
}

function applyPatches(parent, patches, index = 0) {
  if (!patches || !parent) return;

  // Get the target node, accounting for text nodes
  const getTargetNode = (parent, index) => {
    const children = Array.from(parent.childNodes);
    return children[index];
  };

  switch (patches.type) {
    case PATCH_TYPES.CREATE: {
      const element = _renderElement(patches.vdom);
      parent.appendChild(element);
      break;
    }
    case PATCH_TYPES.REMOVE: {
      const node = getTargetNode(parent, index);
      if (node) {
        parent.removeChild(node);
      }
      break;
    }
    case PATCH_TYPES.REPLACE: {
      const oldNode = getTargetNode(parent, index);
      const newNode = _renderElement(patches.vdom);
      if (oldNode) {
        parent.replaceChild(newNode, oldNode);
      } else {
        parent.appendChild(newNode);
      }
      break;
    }
    case PATCH_TYPES.UPDATE_ATTRS: {
      const element = getTargetNode(parent, index);
      if (!element) return;
      
      // Update attributes
      if (patches.attrs) {
        for (const [attr, value] of Object.entries(patches.attrs)) {
          if (value === null) {
            element.removeAttribute(attr);
          } else if (attr === 'checked' || attr === 'selected' || attr === 'disabled') {
            if (value) {
              element.setAttribute(attr, '');
            } else {
              element.removeAttribute(attr);
            }
          } else if (value === true) {
            element.setAttribute(attr, '');
          } else if (value !== false) {
            element.setAttribute(attr, value.toString());
          }
        }
      }

      // Update children
      if (patches.children && element.nodeType === Node.ELEMENT_NODE) {
        // Handle moves first
        if (patches.children.moves) {
          patches.children.moves.forEach(({ from, to }) => {
            const fromNode = element.childNodes[from];
            const referenceNode = element.childNodes[to];
            if (fromNode && referenceNode) {
              element.insertBefore(fromNode, referenceNode);
            }
          });
        }

        // Apply patches to children
        patches.children.patches.forEach((childPatch, i) => {
          if (childPatch) {
            applyPatches(element, childPatch, i);
          }
        });
      }
      break;
    }
    case PATCH_TYPES.UPDATE_TEXT: {
      const textNode = getTargetNode(parent, index);
      if (textNode) {
        textNode.nodeValue = patches.value;
      }
      break;
    }
  }
}

function _renderElement(vdom) {
  try {
    if (vdom === null || vdom === undefined) {
      return document.createTextNode('');
    }
    if (typeof vdom === 'string' || typeof vdom === 'number') {
      return document.createTextNode(vdom.toString());
    }
    if (!vdom.tag) {
      throw new DOMError('Invalid virtual DOM node');
    }
    
    const { tag, attrs, children } = vdom;
    const element = document.createElement(tag);

    // Set attributes
    for (const [attr, value] of Object.entries(attrs)) {
      if (value === false || value === null || value === undefined) continue;
      
      // Handle boolean attributes specially
      if (attr === 'checked' || attr === 'selected' || attr === 'disabled') {
        if (value) {
          element.setAttribute(attr, '');
        } else {
          element.removeAttribute(attr);
        }
      } else if (value === true) {
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
  } catch (error) {
    console.error('Error in _renderElement:', error);
    throw error;
  }
}
