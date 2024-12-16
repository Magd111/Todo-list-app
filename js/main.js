const formElement = document.querySelector("form");
const inputElemet = document.querySelector("input");
const apiKey = "676056f760a208ee1fde385f"
const loadingScreen = document.querySelector(".loading");
let allTodos = []
getAllTodos()



formElement.addEventListener("submit" , function(e){
    e.preventDefault()
    addTodo()
})

async function addTodo(){

    showLoading()

    const todo = {
        title: inputElemet.value,
        apiKey: apiKey
    }

    const response = await fetch("https://todos.routemisr.com/api/v1/todos" , {
        method:"post",
        body:JSON.stringify(todo),
        headers:{
            "Content-Type":"application/json"
        }
    })
    
    if (response.ok) {
        const data = await response.json()

        if (data.message === "success") {
            toastr.success('Added Successfully', 'Toastr App')
            await getAllTodos()
            formElement.reset()
        }
        else{
            toastr.error("Title Is empty")
        }
    }

    hideLoading()
}


async function getAllTodos(){
    showLoading()
    const response = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`)
    if (response.ok) {
        const data = await response.json()

        if (data.message === "success") {
            allTodos = data.todos;
            displayData()
            console.log(allTodos);
            
        }
    }
hideLoading()
}

function displayData(){
    var cartona = ""
    for (const todo of allTodos){
        cartona += `
        <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">

          <span onclick="markCompleted('${todo._id}')" style = "${todo.completed ? "text-decoration: line-through;" : ""}" class="task-name">${todo.title}</span>


          <div class="d-flex align-items-center gap-4">
            ${todo.completed ? '<span><i class="fa-regular fa-circle-check" style="color: #63E6BE;"></i></span>' : ''}
            <span onclick = "deleteTodo('${todo._id}')" class="icon"> <i class="fa-solid fa-trash-can"></i></span>
          </div>

        </li>
        `
    }
    document.querySelector(".task-container").innerHTML=cartona;

    changeProgress()
}


async function deleteTodo(idTodo){
    //alert delete
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then( async (result) => {
        if (result.isConfirmed) {

            showLoading()

            const todoData = {
                "todoId":idTodo
            }
            
        
            const response = await fetch("https://todos.routemisr.com/api/v1/todos" , {
                method: "DELETE",
                body:JSON.stringify(todoData),
                headers:{
                    "Content-Type": "application/json"
                }
            })
        
            if (response.ok) {
                const data = await response.json()
                if (data.message === "success") {

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your todo has been deleted.",
                        icon: "success"
                      });

                    getAllTodos()
                    
                }
            }

            hideLoading()
        }
      });
}

async function markCompleted(idTodo){


    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Complete it!"
      }).then( async (result) => {
        if (result.isConfirmed) {

            showLoading()

            const todoData = {
                todoId: idTodo
            }
            
            const response = await fetch("https://todos.routemisr.com/api/v1/todos" , {
                method: "PUT",
                body: JSON.stringify(todoData),
                headers:{
                    "Content-Type": "application/json"
                }
            })
            if (response.ok) {
                const data = await response.json()
                if (data.message === "success") {

                    Swal.fire({
                        title: "Compeleted!",
                        icon: "success"
                      });

                    getAllTodos()
                }
            }

            hideLoading()
        }
      });

    
}

function showLoading(){
    loadingScreen.classList.remove("d-none")
}

function hideLoading(){
    loadingScreen.classList.add("d-none")
}

function changeProgress(){
    const completedTaskNumber = allTodos.filter((todo) => todo.completed).length;
    const totalTaskNumber = allTodos.length;

    document.getElementById("progress").style.width = `${(completedTaskNumber / totalTaskNumber) * 100}%`


    const statusNumber = document.querySelectorAll(".status-number span")

    statusNumber[0].innerHTML = completedTaskNumber

    statusNumber[1].innerHTML = totalTaskNumber
}