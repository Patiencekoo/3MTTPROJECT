const colors = [
  '#893101',
  '#ed7117',
  '#d16002',
  '#cc5801',
  '#b56727',
  '#d67229',
];
const gridItems = document.querySelectorAll('.task');

gridItems.forEach((item) => {
  // Randomly choose a color from the colors array
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  item.style.backgroundColor = randomColor;
});

const title = document.getElementById('taskTitle');
const desc = document.getElementById('taskDesc');
const priority = document.getElementById('priority');
const deadline = document.getElementById('deadline');
const add = document.getElementById('add');
const allTasks = document.querySelector('.allTasks');

let tasksFromServer = [];

// function to create a new task
add.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    title.value === '' ||
    desc.value === '' ||
    priority.value === '' ||
    deadline.value === ''
  ) {
    alert('All fields are required');
    return;
  }

  const taskData = {
    title: title.value,
    description: desc.value,
    priority: priority.value,
    deadline: new Date(deadline.value),
  };

  fetch('http://localhost:7000/api/tasks/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  credentials: 'include', 
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Task created:', data);
      alert('Task created successfully');
      title.value = '';
      desc.value = '';
      priority.value = '';
      deadline.value = '';

      // Optionally, call renderTasks to add the new task without reloading
      fetch('http://localhost:7000/api/tasks/get-tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          renderTasks(data);
        });
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error creating the task.');
    });
});

// Fetch and render tasks only once when the page loads
window.addEventListener('load', () => {
  fetch('http://localhost:7000/api/tasks/get-tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return response.json();
    })
    .then((data) => {
      // Call the function to render the tasks on the page
      renderTasks(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error fetching tasks.');
    });
});

// render tasks items
function renderTasks(tasks) {
  allTasks.innerHTML = ''; // Clear current tasks
  tasks.forEach((task) => {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task');
    taskItem.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    taskItem.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <div> <p>Priority: ${task.priority}</p>
      <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p></div>
      <div>
      <span>Edit</span>
      <span>Delete</span>
      </div>
     
    `;
    allTasks.appendChild(taskItem);
  });
}

const logOut = document.querySelector('.logOut');

logOut.addEventListener('click', (e) => {
  e.preventDefault();

  fetch('http://localhost:7000/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to log out');
      }
      window.location.href = '/login.html';
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error logging out.');
    });
});
