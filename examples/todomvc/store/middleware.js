export const localStorageMiddleware = (key) => (store) => (next) => (action) => {
    const result = next(action);
    if (action.type === 'SET_STATE' && action.payload.lastChangedProp === 'todos') {
      localStorage.setItem(key, JSON.stringify(store.getState().todos));
    }
    return result;
  };