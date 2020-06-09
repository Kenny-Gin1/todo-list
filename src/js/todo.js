/* Todo app javascript */
let state = {
  todos: [],
};

const template = ((currState) => {
  let renderState = '';
  currState.forEach((element) => {
    renderState += `<div class='item-container'><div class= ${element.completed ? 'todo-card-done' : 'todo-card'} id="todo-card" data-key="${element.id}">
      <h3 class="todo-title">${element.title}</h3>
      <li class="todo-description"> ${element.description}</li>
      ${element.completed ? '<button class="delete-btn" id="delete-btn">Remove</button>' : ''}
    </div> </div>`;
  });
  return renderState;
});

const render = (htmlString, el) => {
  el.innerHTML = htmlString;
};

// update when adding
const updateAdd = (newState) => {
  state = { todos: [newState, ...state.todos] };
  state.todos.sort((a, b) => a.completed - b.completed);
  window.dispatchEvent(new Event('statechange'));
};

// update when deleting
const updateDelete = (newState) => {
  state = { todos: newState };
  window.dispatchEvent(new Event('statechange'));
};

// Add new todo-card
const addItem = (title, description) => {
  const newItem = {
    id: Date.now(),
    title,
    description,
    completed: false,
  };
  updateAdd(newItem);
};

window.addEventListener('statechange', () => {
  localStorage.setItem('todoState', JSON.stringify(state));
  render(template(state.todos), document.getElementById('todo-list'));
});

// Put a line-through on items done
const itemDone = (id) => {
  const index = state.todos.findIndex((item) => item.id === Number(id));
  state.todos[index].completed = !state.todos[index].completed;
  state.todos.sort((a, b) => a.completed - b.completed);
  window.dispatchEvent(new Event('statechange'));
};

// Delete todo-card
const deleteItem = (id) => {
  state.todos = state.todos.filter((item) => (item.id !== Number(id)));
  updateDelete(state.todos);
};

// Submit a todo-card
const submit = document.getElementById('submit-btn');
submit.addEventListener('click', (event) => {
  event.preventDefault();
  const title = document.getElementById('title');
  const description = document.getElementById('description');
  const textTitle = title.value.trim();
  const textDescription = description.value.trim();
  if (textTitle !== '' && textDescription !== '') {
    addItem(textTitle, textDescription);
    title.value = '';
    description.value = '';
  }
});

// Mark a todo-list as done or delete a todo-card by clicking
const todoList = document.getElementById('todo-list');
todoList.addEventListener('click', (event) => {
  if (event.target.classList.contains('todo-card') || event.target.classList.contains('todo-card-done')) {
    const id = event.target.dataset.key;
    itemDone(id);
  } else if (event.target.classList.contains('delete-btn')) {
    const deleteId = event.target.parentElement.dataset.key;
    deleteItem(deleteId);
  }
});
