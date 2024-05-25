import { ELEMENTS } from './elements.js';

//хранилише
let list = [];
//обьект с приоритетами
const PRIORITY = {
  HIGH: 'High',
  LOW: 'Low',
};
//обьект со статусами
const STATUS = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

//Функция добавления обьекта в массив
const addTask = (name, priority) => {
  list.push({
    name,
    status: STATUS.TO_DO,
    priority,
  });
  saveTasks();
};

//Функция смены статуса
const changeStatus = (name, newStatus) => {
  const searchTask = list.find((task) => task.name === name);
  searchTask.status = newStatus;
  saveTasks();
  return searchTask;
};

//Функция удаления
const deleteTask = (task) => {
  list = list.filter((list) => list !== task);
  saveTasks(); // обновление localStorage
};

//обработчик форм,инпутов
const onFormSubmitHandler = (event) => {
  event.preventDefault(); //отменяем стандартное поведение браузера

  let highValue = ELEMENTS.TEXT_HIGH_INPUT.value.trim();
  let lowValue = ELEMENTS.TEXT_LOW_INPUT.value.trim();

  if (checkInput(highValue, lowValue)) {
    addTask(highValue, PRIORITY.HIGH);
    addTask(lowValue, PRIORITY.LOW);
    renderAllTask();
  }

  ELEMENTS.TEXT_HIGH_INPUT.value = '';
  ELEMENTS.TEXT_LOW_INPUT.value = '';
};

const checkInput = (highValue, lowValue) => {
  if (!highValue) {
    alert('Пожалуйста введите Задачу с высоким приоритетом');
    return false;
  }
  if (!lowValue) {
    alert('Пожалуйста введите Задачу с низким приоритетом');
    return false;
  }
  return true;
};

//обработчики событий
ELEMENTS.FORMS.forEach((task) => {
  task.addEventListener('submit', onFormSubmitHandler);
});

ELEMENTS.BTN.forEach((btn) => {
  btn.addEventListener('click', onFormSubmitHandler);
});

const createFormElement = (task) => {
  const form = document.createElement('form');
  const li = document.createElement('li');
  const label = document.createElement('label');
  const div = document.createElement('div');
  const span = document.createElement('span');
  const img = document.createElement('img');

  li.classList.add('item');
  label.classList.add('item-label');
  div.classList.add('check');
  span.classList.add('item-text');
  img.classList.add('close');
  img.setAttribute('src', 'img/close.png');

  span.textContent = task.name;

  label.appendChild(div);
  label.appendChild(span);
  label.appendChild(img);
  li.appendChild(label);
  form.appendChild(li);

  img.addEventListener('click', () => {
    form.remove();
    deleteTask(task);
  });

  div.addEventListener('click', (event) => {
    li.classList.toggle('checked');
    const name = span.textContent;
    if (event.target.classList.contains('checked')) {
      event.target.classList.remove('checked');
      changeStatus(name, STATUS.TO_DO);
    } else {
      event.target.classList.add('checked');
      changeStatus(name, STATUS.DONE);
    }
  });

  return form;
};

const renderAllTask = () => {
  clearLists();
  list.forEach((task) => {
    const form = createFormElement(task);
    task.priority === PRIORITY.HIGH
      ? ELEMENTS.HIGH_LIST.appendChild(form)
      : ELEMENTS.LOW_LIST.appendChild(form);
  });
};

// Функция для очистки содержимого списков
const clearLists = () => {
  ELEMENTS.HIGH_LIST.innerHTML = '';
  ELEMENTS.LOW_LIST.innerHTML = '';
};

/*
 *Функция saveTasks()
 *будет получать список задач из массива list
 *и сохранять его в localStorage в формате JSON.
 */
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(list));
};

/**
 * Функция loadTasks() будет загружать данные из localStorage
 * и восстанавливать список задач.
 * Если в localStorage нет сохраненных задач, то будет использован пустой массив.
 */

const loadTasks = () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks'));
  list = savedTasks ? savedTasks : [];
};

// При загрузке страницы вызывайте функцию loadTasks()
window.addEventListener('load', () => {
  loadTasks();
  renderAllTask();
});
console.log(list);
