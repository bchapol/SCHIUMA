document.addEventListener("DOMContentLoaded", function () {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const sidebar = document.querySelector(".sidebar");

    hamburgerMenu.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        console.log("Sidebar colapsado:", sidebar.classList.contains("collapsed"));
    });
});

function setActiveLink() {
    const links = document.querySelectorAll('.sidebar a');
    const listItems = document.querySelectorAll('.sidebar ul li');
    links.forEach(link => {
        link.addEventListener('click', function() {
            listItems.forEach(item => {
                item.classList.remove('active');
            });

            const parentLi = link.parentElement;
            parentLi.classList.add('active');
        });
    });
}

window.addEventListener('load', setActiveLink);

//Para cambiar de main
const menuItems = document.querySelectorAll('.sidebar nav ul li');

const sections = document.querySelectorAll('.section-content');

menuItems.forEach(item => {
    item.addEventListener('click', function() {
        sections.forEach(section => section.classList.remove('active'));
        
        const sectionId = item.querySelector('a').getAttribute('href').substring(1);
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
        }
        
        menuItems.forEach(item => item.classList.remove('active'));
        item.classList.add('active');
    });
});


// Columna de acciones
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".btn-acciones").forEach((boton) => {
        boton.addEventListener("click", function (event) {
            event.stopPropagation(); // Evita que se cierre inmediatamente al hacer click
            let contenedor = this.closest(".contenedor-acciones");
            
            // Cierra otros cuadros antes de abrir el nuevo
            document.querySelectorAll(".contenedor-acciones").forEach((c) => {
                if (c !== contenedor) c.classList.remove("active");
            });

            // Alterna la visibilidad del cuadro de opciones
            contenedor.classList.toggle("active");
        });
    });

    // Cierra el cuadro si se hace clic fuera
    document.addEventListener("click", function () {
        document.querySelectorAll(".contenedor-acciones").forEach((contenedor) => {
            contenedor.classList.remove("active");
        });
    });
});

//Pagination
document.addEventListener("DOMContentLoaded", function() {
    let currentPage = 1;
    const totalPages = 5;
    const pageDropdown = document.getElementById("page-dropdown");
    const pageList = document.getElementById("page-list");
    const currentPageElement = document.getElementById("page-dropdown");
    const arrow = pageDropdown.querySelector(".arrow");

    function generatePageList() {
        pageList.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            let listItem = document.createElement("li");
            listItem.textContent = i;
            listItem.addEventListener("click", function() {
                currentPage = i;
                currentPageElement.innerHTML = `${currentPage} <span class="arrow">›</span>`;
                arrow.style.transform = "rotate(90deg)";
                pageDropdown.classList.remove("active");
                pageList.classList.add("hidden");
            });
            pageList.appendChild(listItem);
        }
    }

    pageDropdown.addEventListener("click", function() {
        generatePageList();
        pageList.classList.toggle("hidden");
        pageDropdown.classList.toggle("active");
        arrow.style.transform = pageDropdown.classList.contains("active") ? "rotate(270deg)" : "rotate(90deg)";
    });

    document.addEventListener("click", function(event) {
        if (!pageDropdown.contains(event.target) && !pageList.contains(event.target)) {
            pageList.classList.add("hidden");
            pageDropdown.classList.remove("active");
            arrow.style.transform = "rotate(90deg)";
        }
    });
});

