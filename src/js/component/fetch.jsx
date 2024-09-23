import React, { useState, useEffect } from "react";
import { BsFillEraserFill } from "react-icons/bs";



/// pendientes: arreglar que se vean las viñetas quitando el flex pero acomodando que queden los iconos del lado derecho sin moverse...
/// preguntas a irio y gaston: como uso position relative y absolute para los iconos 


const ToDoList = () => {

    const [tasks, setTasks] = useState([])
    const [inputValue, setInputValue] = useState("")
    const [error, setError] = useState(false)
    const [error2, setError2] = useState(false)

    const user = "AleRugg"
    const getUserUrl = "https://playground.4geeks.com/todo/users/AleRugg"

   


    const inputHandler = (e) => {

        setInputValue(e.target.value)
    }

    const handlerKeyDown = (e) => {

        if (e.key === "Enter" && inputValue.trim() !== "") {

            setTasks([...tasks, inputValue])
            setInputValue(""); // Limpia el input despues de la interaccion
        }


    }

    useEffect(()=> {
        if(tasks.length == 10) {
            setError(true)
           // alerta de maximas tareas diarias (10)
        }

        else setError(false)
    },[tasks])

    let maxLength = 100;

    useEffect(() => {
        if( inputValue.length == maxLength) { // alerta de maximos caracateres
            setError2(true)
        }
        else {setError2(false)}
        
       
    }, [inputValue])

    const deleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index); // borrar articulos de la lista 
        setTasks(newTasks)}; 


      useEffect(() => {

        fetch(getUserUrl)
        .then(response => response.json()) 
        .then(data => {
          if (data.todos) { setTasks(data.todos)}
        })   // aqui estamos obteniendo la informacion del usuario desde el servidor, en este caso son tareas por loq ue asignamos las tareas a setTasks
        .catch(error => {
          console.error(`Ha habido un error:${error}`)
        })

      }, [])

      



    return (

        <div className="container toDoWrapper">

            <div className="card bg-dark cont" >
                <div className=" d-flex justify-content-center align-items-center mt-2">
                    <div className="maxAlerts">
                    <input
                        type="text"
                        placeholder="Añade tu tarea y pulsa Enter para añadirla a la lista..."
                        value={inputValue}
                        onChange={inputHandler}
                        onKeyDown={handlerKeyDown}
                        disabled={tasks.length >= 10}
                        maxLength={100}
                          
                    />
                    
                    
                    { error && <span className=" mxLength">Solo puedes añadir 10 tareas a tu lista!</span>}
                    { error2 && <span className=" maxArticles">Tus tareas pueden tener como maximos 100 caracteres, lo siento!</span>}
                    </div>


                </div>
                <h4 className="title">Lista de tareas por hacer:</h4>

                <div className="card-body">
                    <ul>
                        {tasks.map((task, index) => {

                            return (

                                <li className="text-white liGenerado"
                                    value={task.label}
                                    key={index}
                                    
                                >
                                    {task.label}                                    
                                        <BsFillEraserFill className="eraserIcon" onClick={() => deleteTask(index)} />                                    
                                </li>

                            )
                        })}
                    </ul>
                    <div className="card.footer text-white footer">Llevas {tasks.length} / 10 tareas agregadas a tu lista.</div>
                </div>
            </div>
        </div>
    )
}

export { ToDoList }









// import React, { useState, useEffect } from "react";
// import { BsFillEraserFill } from "react-icons/bs";

// /// pendientes: arreglar que se vean las viñetas quitando el flex pero acomodando que queden los iconos del lado derecho sin moverse...
// /// preguntas a irio y gaston: como uso position relative y absolute para los iconos

// const ToDoList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [error, setError] = useState(false);
//   const [error2, setError2] = useState(false);

//   const user = "AleRugg";

//   const getUserUrl = `https://playground.4geeks.com/todo/users/${user}`;
//   const postUserUrl = `https://playground.4geeks.com/todo/users/${user}`;
//   const putUserUrl = "";
//   const deleteUserUrl = "";

//   const getToDoUrl = "";
//   const postToDoUrl = `https://playground.4geeks.com/todo/todos/${user}`;
//   const putToDoUrl = "";
//   const deleteToDoUrl = "";


//   const inputHandler = (e) => {
//     setInputValue(e.target.value);
//   };

//   useEffect(() => {
//     if (tasks.length == 10) {
//       setError(true);
//       // alerta de maximas tareas diarias (10)
//     } else setError(false);
//   }, [tasks]);

//   useEffect(() => {
//     let maxLength = 100;
//     if (inputValue.length == maxLength) {
//       // alerta de maximos caracateres
//       setError2(true);
//     } else {
//       setError2(false);
//     }
//   }, [inputValue]);

//   const deleteTask = (id) => {
//     // const newTasks = tasks.filter((_, id) => id !== id); // borrar articulos de la liksta
//     // setTasks(newTasks);
//     // paso 1: deberiamos hacer fecth a delete
//     // que necesitamos? url y el id 
//     fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
//         method: "DELETE"
//     })
//     .then(() => setTasks(tasks.filter((task) => id !== task.id ))) // esto devuelve un objeto filtrado ver funcion filter mejor
    
    
//   };

  

//   const handlerKeyDown = (e) => {
//     if (e.key === "Enter" && inputValue !== "") {
//       addToDo({
//         label: inputValue,
//         is_done: false,
//       });
//     }
//   };

//   useEffect(() => {
//     fetch(getUserUrl)
//       .then((response) => response.json()) // con esto obtenemos la informacion del usuario almacenado/ creado en el servidor de la app
//       .then((data) => {
//         if (data.todos) {
//           setTasks(data.todos);
//         }
//       });

//     // utilizar el todos porque es el nombre del array de objetos que trae el metodo desde la API
//   }, []);

//   const addToDo = (body) => {
//     fetch(postToDoUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     })
//       .then((response) => response.json())
//       .then((data) => setTasks([...tasks, data]))
//       .then(() => setInputValue(""))
//       .catch((error) => console.error(error));
//   };

//   return (
//     <div className="container toDoWrapper">
//       <div className="card bg-dark cont">
//         <div className=" d-flex justify-content-center align-items-center mt-2">
//           <div className="maxAlerts">
//             <input
//               type="text"
//               placeholder="Añade tu tarea y pulsa Enter para añadirla a la lista..."
//               value={inputValue}
//               onChange={inputHandler}
//               onKeyDown={handlerKeyDown}
//               disabled={tasks.length >= 10}
//               maxLength={100}
//             />

//             {error && (
//               <span className=" mxLength">
//                 Solo puedes añadir 10 tareas a tu lista!
//               </span>
//             )}
//             {error2 && (
//               <span className=" maxArticles">
//                 Tus tareas pueden tener como maximos 100 caracteres, lo siento!
//               </span>
//             )}
//           </div>
//         </div>
//         <h4 className="title">Lista de tareas por hacer:</h4>

//         <div className="card-body">
//           <ul>
//             {tasks.map((task, index) => {
//               return (
//                 <li
//                   className="text-white liGenerado"
//                   // value={task.label}
//                   key={index}
//                 >
//                   {task.label}
//                   <BsFillEraserFill
//                     className="eraserIcon"
//                     onClick={() => deleteTask(task.id)}
//                   />
//                   {task.is_done === false ? "sin hacer" : "ya hecho"}
//                 </li>
//               );
//             })}
//           </ul>
//           <div className="card.footer text-white footer">
//             Llevas {tasks.length} / 10 tareas agregadas a tu lista.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { ToDoList };

// EXTRA agregar un boton de finalizar tarea, comn put y cambiar el isdone de falso a true


