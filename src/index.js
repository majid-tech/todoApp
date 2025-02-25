import './styles.css';


document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    const projectSelect = document.getElementById('project-select');
    const projectList = document.getElementById('project-list');
    const main = document.getElementById('main');
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-btn');

    let projects = JSON.parse(localStorage.getItem('projects')) || { General: [] };
    let currentProject = 'General';

    updateProjectList();
    updateTodoList();

    addBtn.addEventListener('click', createCard);
    projectSelect.addEventListener('change', changeProject);
    menuBtn.addEventListener('click', toggleSidebar);

    function createCard() {
        if (!projects[currentProject]) projects[currentProject] = [];
        
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        
        cardContainer.innerHTML = `
            <input type="text" class="title" placeholder="Title">
            <textarea class="content" placeholder="Content"></textarea>
            <div class="buttons">
                <button class="save-btn">Save</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        cardContainer.querySelector('.save-btn').addEventListener('click', () => saveCard(cardContainer));
        cardContainer.querySelector('.delete-btn').addEventListener('click', () => deleteCard(cardContainer));

        main.appendChild(cardContainer);
    }

    function saveCard(cardContainer) {
        const title = cardContainer.querySelector('.title').value;
        const content = cardContainer.querySelector('.content').value;
        if (title.trim() === '' && content.trim() === '') return;

        projects[currentProject].push({ title, content });
        updateLocalStorage();
        updateTodoList();
    }

    function deleteCard(cardContainer) {
        const title = cardContainer.querySelector('.title').value;
        projects[currentProject] = projects[currentProject].filter(note => note.title !== title);
        updateLocalStorage();
        cardContainer.remove();
        updateTodoList();
    }

    function updateTodoList() {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';
        
        projects[currentProject].forEach((note, index) => {
            const li = document.createElement('li');
            li.textContent = note.title || 'Untitled';
            li.addEventListener('click', () => openNoteInMain(index));
            todoList.appendChild(li);
        });
    }

    function openNoteInMain(index) {
        const note = projects[currentProject][index];
        createCard();
        const newCard = main.lastElementChild;
        newCard.querySelector('.title').value = note.title;
        newCard.querySelector('.content').value = note.content;
    }

    function toggleSidebar() {
        sidebar.style.transform = sidebar.style.transform === 'translateX(0px)' ? 'translateX(-100%)' : 'translateX(0px)';
    }

    function changeProject() {
        currentProject = projectSelect.value;
        if (!projects[currentProject]) projects[currentProject] = [];
        updateLocalStorage();
        updateTodoList();
    }

    function updateProjectList() {
        projectSelect.innerHTML = '';
        projectList.innerHTML = '';
        
        Object.keys(projects).forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            projectSelect.appendChild(option);
            
            const projectItem = document.createElement('li');
            projectItem.textContent = project;
            projectItem.addEventListener('click', () => {
                projectSelect.value = project;
                changeProject();
            });
            projectList.appendChild(projectItem);
        });
    }

    function addProject() {
        const projectName = prompt('Enter new project name:');
        if (projectName && !projects[projectName]) {
            projects[projectName] = [];
            updateLocalStorage();
            updateProjectList();
        }
    }

    function updateLocalStorage() {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    document.getElementById('add-project-btn').addEventListener('click', addProject);
});
