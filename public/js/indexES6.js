class Course {
    constructor(title, image, price, caption) {
        this.courseId = Math.floor(Math.random()*10000);
        this.title = title;
        this.image = image;
        this.caption = caption;
        this.price = price;
    }
}

class UI {
    addCourseToList(course) {
        const section = document.getElementById('course-items');

        var html = `
    <div class="course-item" id="course-item">
    <img src="${course.image}"
        alt="" id="course-image">
    <div class="course-detail">
        <h1 id="course-title">${course.title}</h1>
        <p id="course-caption">
            ${course.caption}
        </p>
    </div>
    <div class="course-footer">
        <span id="course-price">${course.price}$</span>
        <button id="fav-btn"><i class="fas fa-heart"></i></button>
        <button id="delete-btn"><i data-id="${course.courseId}" class="fas fa-trash-alt delete"></i></button>
    </div>
</div>
    `

        section.innerHTML += html
    }
    clearControls() {
        const title = document.getElementById('course-title-input').value = ""
        const image = document.getElementById('course-image-input').value = ""
        const caption = document.getElementById('course-caption-input').value = ""
        const price = document.getElementById('course-price-input').value = ""
    }
    deleteCourse(element) {
        const ui = new UI()
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.parentElement.remove();
            ui.showAlert('The course has been deleted', 'danger')
        }
    }
    showAlert(message, classname) {
        var alert = `
        <div class="alert alert-${classname}" role="alert">
                 ${message}
         </div>
        `;
        const content = document.querySelector('.content');
        // beforeBegin - afterBegin - beforeEnd - afterEnd
        content.insertAdjacentHTML('beforeBegin', alert);

        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 1500)
    }
}

class Storage {
    static getCourses() {
        let courses;

        if (localStorage.getItem('course-items') === null) {
            courses = [];
        } else {
            courses = JSON.parse(localStorage.getItem('course-items'));
        }

        return courses
    }

    static displayCourses() {
        const courses = Storage.getCourses();

        courses.forEach(course => {
            const ui = new UI();
            ui.addCourseToList(course)
        });
    }

    static addCourse(course) {
        const courses = Storage.getCourses()

        courses.push(course);
        localStorage.setItem('course-items', JSON.stringify(courses));
    }

    static deleteCourse(element) {
        if (element.classList.contains('delete')) {
            const id = element.getAttribute('data-id');
            const courses = Storage.getCourses();

            courses.forEach((course, index) =>{
                if(course.courseId == id){
                    courses.splice(index, 1);
                }
            });

            localStorage.setItem('course-items', JSON.stringify(courses));
            
            // element.parentElement.parentElement.parentElement.remove();
            // ui.showAlert('The course has been deleted', 'danger')
        }
    }
}

document.addEventListener('DOMContentLoaded', Storage.displayCourses);

document.getElementById('new-course').addEventListener('submit', function (e) {

    const title = document.getElementById('course-title-input').value;
    const image = document.getElementById('course-image-input').value;
    const caption = document.getElementById('course-caption-input').value;
    const price = document.getElementById('course-price-input').value;

    // Create New Course Object
    const course = new Course(title, image, caption, price);
    console.log(course)

    // Create UI
    const ui = new UI();
    if (title === '' || caption === '' || price === '' || image === '') {
        ui.showAlert('Please complete the from', 'warning')
    } else {
        // Add Course to list
        ui.addCourseToList(course) |
            // Save to LS
            Storage.addCourse(course)
        // Clear controls
        ui.clearControls();

        ui.showAlert('The course has been added', 'success')
    }

    e.preventDefault();
});


document.getElementById('course-items').addEventListener('click', function (e) {
    const ui = new UI();
    ui.deleteCourse(e.target);
    // Delete course from LS
    Storage.deleteCourse(e.target);
});