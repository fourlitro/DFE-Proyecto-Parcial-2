//#region button de desplazamiento
document.addEventListener("DOMContentLoaded", () => {
  const scrollToBottomButtom = document.getElementById("btn-ir-arriba");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      scrollToBottomButtom.style.display = "block";
    } else {
      scrollToBottomButtom.style.display = "none";
    }
  });

  scrollToBottomButtom.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

//#endregion

//#region 1. Modelo de datos (Models)

//definimos la clase Task
class Task {
  constructor(id, title, description, completed, priority, tag, dueDate) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.priority = priority;
    this.tag = tag;
    this.dueDate = dueDate;
  }
}

function mapAPItoTasks(data) {
  return data.map((item) => {
    return new Task(
      item.id,
      item.title,
      item.description,
      item.completed,
      item.priority,
      item.tag,
      new Date(item.dueDate)
    );
  });
}

//creamos una funcion especial para obtener los datos de una tarea
function APItoTask(tarea) {
  return new Task(
    tarea.id,
    tarea.title,
    tarea.description,
    tarea.completed,
    tarea.priority,
    tarea.tag,
    new Date(tarea.dueDate)
  );
}

//#endregion

//#region 2. Task (View)
function displayTasksView(tasks) {
  showLoadingMessage();

  if (tasks.length === 0) {
    showNotFoundMessage();
  } else {
    hideMessage();

    displayTasksTable(tasks);
  }
}

// Funcion que agrega las tareas a la tabla.
function displayTasksTable(tasks) {
  const tablaBody = document.getElementById("data-table-body");

  tasks.forEach((task) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.completed}</td>
      <td>${task.priority}</td>
      <td>${task.tag}</td>
      <td>${formatDate(task.dueDate)}</td>
      <td class="td-btn">
        <button class="btn-edit" data-task-id="${task.id}">Editar</button>
        <button class="btn-delete" data-task-id="${task.id}">Eliminar</button>
      </td>
    `;

    tablaBody.appendChild(row);
  });

  initUpdateTaskButtonHandler();
  initDeleteTaskButtonHandler();
}

function displayTaskModal(uTask){
  const taskId = document.getElementById("u-task-id");
  const taskTitle = document.getElementById("u-task-title");
  const taskDescription = document.getElementById("u-task-description");
  const taskCompleted = document.getElementById("u-task-completed");
  const taskPriority = document.getElementById("u-task-priority");
  const taskTag = document.getElementById("u-task-tag");
  const taskDate = document.getElementById("u-task-dueDate");

  taskId.value = uTask.id;
  taskTitle.value = uTask.title;
  taskDescription.value = uTask.description;
  taskCompleted.value = uTask.completed;
  taskPriority.value = uTask.priority;
  taskTag.value = uTask.tag;
  taskDate.value = uTask.dueDate;

}

// Funcion que muestra mensaje de carga
function showLoadingMessage() {
  const message = document.getElementById("message");

  message.innerHTML = "Cargando...";

  message.style.display = "block";
}

// Funcion que muestra mensaje de carga
function showInitialMessage() {
  const message = document.getElementById("message");

  message.innerHTML = "No se han creado tareas.";

  message.style.display = "block";
}

// Funcion que muestra mensaje de que no se encuentraron datos
function showNotFoundMessage() {
  const message = document.getElementById("message");

  message.innerHTML = "No se encontraron casas con el filtro proporcionado.";

  message.style.display = "block";
}

// Funcion que oculta mensaje
function hideMessage() {
  const message = document.getElementById("message");

  message.style.display = "none";
}

function resetPage(){
  setTimeout(function () {
    location.reload(); // Recarga la página actual
  }, 1000);
}
//#endregion

//#region 2  boton para agregar, editar y eliminar tareas (VIEW)

function initAddTaskButtonsHandler() {
  //toma el formulario de añadir tarea
  document.getElementById("task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    processSubmitTask();
  });

  //toma el formulario para limpiar los elementos
  document.getElementById("task-form").addEventListener("reset", (event) => {
    event.preventDefault();
    document.getElementById("task-form").reset();
  });
}

function processSubmitTask() {
  const taskTitle = document.getElementById("task-title").value;
  const taskDescription = document.getElementById("task-description").value;
  const taskCompleted = document.getElementById("task-completed").value;
  const taskPriority = document.getElementById("task-priority").value;
  const taskTag = document.getElementById("task-tag").value;
  const taskDate = document.getElementById("task-dueDate").value;

  const taskToSave = new Task(
    null,
    taskTitle,
    taskDescription,
    taskCompleted,
    taskPriority,
    taskTag,
    taskDate
  );

  createTask(taskToSave);
}

function initUpdateTaskButtonHandler(){
  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", () => {
      const taskId = button.getAttribute("data-task-id"); // Obtenemos el ID de la venta
      openAddUModal(taskId); // Llamamos a la función para editar la tarea
    });
  });

  document.getElementById('u-task-form').addEventListener('submit', event => {
    event.preventDefault();
    processUpdateTask();
  });

  document.getElementById('modal-background').addEventListener('click', () => {
    closeAddUTaskModal();
  });
}
function openAddUModal(taskId) {
  getTaskData(taskId);
  document.getElementById('u-task-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
}


function closeAddUTaskModal() {
  document.getElementById('u-task-form').reset();
  document.getElementById('modal-background').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
}

function processUpdateTask(){ 
  const taskId = document.getElementById("u-task-id").value;
  const taskTitle = document.getElementById("u-task-title").value;
  const taskDescription = document.getElementById("u-task-description").value;
  const taskCompleted = document.getElementById("u-task-completed").value;
  const taskPriority = document.getElementById("u-task-priority").value;
  const taskTag = document.getElementById("u-task-tag").value;
  const taskDate = document.getElementById("u-task-dueDate").value;

  const taskToSave = new Task(
    taskId,
    taskTitle,
    taskDescription,
    taskCompleted,
    taskPriority,
    taskTag,
    taskDate
  );

  updateTask(taskToSave);
}




function initDeleteTaskButtonHandler() {
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", () => {
      const taskId = button.getAttribute("data-task-id"); // Obtenemos el ID de la venta
      deleteTask(taskId); // Llamamos a la función para eleminar la tarea
    });
  });
}

//#endregion

//#region 3. Cargar datos desde la api
function getTasksData() {
  fetchAPI(`${apiURL}/tasks`, "GET").then((data) => {
    const taskList = mapAPItoTasks(data);
    displayTasksView(taskList);
  });
}

function createTask(task) {

  fetchAPI(`${apiURL}/tasks`, 'POST', task)
    .then(task => {
      window.alert(`Tarea ${task.id} creada correctamente.`);
      resetPage();
    });

}

function getTaskData(taskId){
  fetchAPI(`${apiURL}/tasks/${taskId}`, 'GET')
    .then(task => {
      //obtemenos los datos de la task para editarlos en el modal
      const uTask =  APItoTask(task)
      displayTaskModal(uTask);

    });

}

function updateTask(task){
  fetchAPI(`${apiURL}/tasks/${task.id}`, 'PUT', task)
    .then( task => {
      closeAddUTaskModal();
      window.alert(`Tarea ${task.id} actualizada correctamente.`);
      resetPage();
    });
}

function deleteTask(taskId) {
  const confirm = window.confirm(
    `¿Estás seguro de que deseas eliminar la tarea ${taskId}?`
  );

  if (confirm) {
    fetchAPI(`${apiURL}/tasks/${taskId}`, "DELETE").then(() => {
      window.alert("tarea eliminada.");
      resetPage();
    });
  }
}

//#region X. Inicializamos funcionalidad (CONTROLLER)

getTasksData();
initAddTaskButtonsHandler();
initUpdateTaskButtonHandler();