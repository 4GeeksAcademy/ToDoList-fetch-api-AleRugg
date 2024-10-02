import React, { useState, useEffect } from "react";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // aqui almacenaramos los datos de los usuarios en base de datos para crear usuarios y no puedas meter uno que ya existe y no de error el post
  const [user, setUser] = [];
  let maxLength = 70;

  const user1 = "AleRugg";

  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  const handlerKeyDown = (e) => {
    if (e.key === "Enter" && inputValue !== "") {
      createToDo();
      setInputValue(""); // Limpia el input despues de la interaccion
    }
  };

  //GETS

  const getUserTasks = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`https://playground.4geeks.com/todo/users/${user1}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setTasks(result.todos))
      .catch((error) => console.error(error));
  };

  const getUsers = () => {
    const requestOptions = {
      method: "GET", // este GET nos trae todos los usuarios existentes en la base de datos
    };
    fetch(
      "https://playground.4geeks.com/todo/users?offset=0&limit=100",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.users) {
          const userNames = result.users.map((user) => user.name); // con esto obtenemos los nombres para poder hacer comparaciones de si existen o no
          const userExists = userNames.includes(user1);
          console.log(userExists)      
          if(userExists === true) {console.log("Ya existe este usuario") }
          else {createUser()}
        }
      })
      .catch((error) => console.error(error));
  };

  // DELETES

  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id); // borrar articulos de la lista
    deleteToDo(id);
    console.log(id);
    setTasks(newTasks);
  };

  const deleteAllTasks = () => {
    tasks.forEach((task) => {
      deleteToDo(task.id);
    });
  };

  const deleteToDo = (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`https://playground.4geeks.com/todo/todos/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          getUserTasks();
        }
        response.json();
      })
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const createToDo = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      label: inputValue,
      is_done: false,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("https://playground.4geeks.com/todo/todos/AleRugg", requestOptions)
      .then((response) => response.json())
      .then((result) => setTasks([...tasks, result]))
      .catch((error) => console.error(error));
  };

  const doneUpdate = (task) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    task.is_done = !task.is_done;
    const taskMap = tasks.map((taskItem) => {
      if (taskItem.id === task.id) {
        return task;
      }
      return taskItem;
    });

    setTasks(taskMap);
    const raw = JSON.stringify(task);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
    };

    fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const createUser = () => {
    fetch("https://playground.4geeks.com/todo/users/AleRugg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  //comparativa para que cree el usuario al iniciar la app // crea el usuario pero no esta ejecutando la condicion por el momento

  const findAName = () => {
    const existingUser = allUsers.find((user) => user === user1); // Accedes al estado allUsers directamente
    console.log(allUsers);
    if (allUsers && existingUser) {
      console.log("Ya Creado");
    } else {
      createUser();
      console.log(allUsers);
      console.log(user);
    }
  };

  // useEffect(() => {
  //   const userExists = allUsers.includes(user1);
  //   console.log(userExists)

  //   userExists === true ? console.log("Ya existe este usuario") : createUser();
  // }, []);

  useEffect(() => {
    if (tasks.length === 10) {
      setError(true);
      // alerta de maximas tareas diarias (10)
    } else setError(false);
  }, [tasks]);

  useEffect(() => {
    if (inputValue.length === maxLength) {
      // alerta de maximos caracateres
      setError2(true);
    } else {
      setError2(false);
    }
  }, [tasks, inputValue]);

  useEffect(() => {
    getUserTasks();
  }, []);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    findAName();
  }, []);

  useEffect(() => {
    console.log(allUsers);
    console.log(tasks);
  }, [allUsers, tasks]);

  return (
    <div className="container toDoWrapper">
      <div className="card bg-dark cont">
        <div className=" d-flex justify-content-center align-items-center mt-2">
          <div className="maxAlerts">
            <input
              className="inputResponsive"
              type="text"
              placeholder="Añade tu tarea y pulsa Enter para añadirla a la lista..."
              value={inputValue}
              onChange={inputHandler}
              onKeyDown={handlerKeyDown}
              disabled={tasks.length >= 10}
              maxLength={70}
            />
            {error && (
              <span className="mxLength">
                Solo puedes añadir 10 tareas a tu lista!
              </span>
            )}
            {error2 && (
              <span className=" maxArticles">
                Tus tareas pueden tener como maximos 100 caracteres, lo siento!
              </span>
            )}
          </div>
        </div>
        <h4 className="title">Lista de tareas por hacer:</h4>
        <div className="card-body">
          <ul>
            {tasks.map((task, index) => {
              return (
                <li
                  className="text-white liGenerado"
                  value={task.label}
                  key={index}
                >
                  {task.label}
                  <div
                    className="btn-group md-0"
                    role="group"
                    aria-label="Basic mixed styles example"
                  >
                    <button
                      type="button"
                      id="checkButton"
                      className={`btn  ${
                        task.is_done ? "btn-success" : "btn-warning"
                      }`}
                      onClick={() => doneUpdate(task)}
                    >
                      {task.is_done ? "Terminada" : "Pendiente de hacer "}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      Borrar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="card.footer text-white footer">
            Llevas {tasks.length} / 10 tareas agregadas a tu lista.
            <button
              type="button"
              className="btn btn-danger delete"
              onClick={() => deleteAllTasks(tasks.id)}
            >
              Borrar todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ToDoList };

// import React, { useState, useEffect } from "react";

// const ToDoList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [error, setError] = useState(false);
//   const [error2, setError2] = useState(false);
//   const [allUsers, setAllUsers] = useState([]);
//   // Nuevo estado para controlar la carga
//   const [isLoading, setIsLoading] = useState(true);
//   let maxLength = 70;

//   const user1 = "AleRugg";

//   const inputHandler = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handlerKeyDown = (e) => {
//     if (e.key === "Enter" && inputValue !== "") {
//       createToDo();
//       setInputValue("");
//     }
//   };

//   //GETS

//   const getUserTasks = () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };
//     fetch(`https://playground.4geeks.com/todo/users/${user1}`, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         setTasks(result.todos);
//         // Indicar que la carga ha terminado
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error(error);
//         // Asegurarse de que isLoading se establezca en false incluso si hay un error
//         setIsLoading(false);
//       });
//   };

//   const getUsers = () => {
//     const requestOptions = {
//       method: "GET",
//     };
//     fetch(
//       "https://playground.4geeks.com/todo/users?offset=0&limit=100",
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         if (result.users) {
//           const userNames = result.users.map((user) => user.name);
//           setAllUsers(userNames);
//         }
//       })
//       .catch((error) => console.error(error));
//   };

//   // DELETES

//   const deleteTask = (id) => {
//     const newTasks = tasks.filter((task) => task.id !== id);
//     deleteToDo(id);
//     console.log(id);
//     setTasks(newTasks);
//   };

//   const deleteAllTasks = () => {
//     tasks.forEach((task) => {
//       deleteToDo(task.id);
//     });
//   };

//   const deleteToDo = (id) => {
//     const requestOptions = {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//     };

//     fetch(`https://playground.4geeks.com/todo/todos/${id}`, requestOptions)
//       .then((response) => {
//         if (response.ok) {
//           getUserTasks();
//         }
//         response.json();
//       })
//       .then((result) => console.log(result))
//       .catch((error) => console.error(error));
//   };

//   const createUser = () => {
//     fetch("https://playground.4geeks.com/todo/users/AleRugg", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(),
//     })
//       .then((response) => response.json())
//       .then((data) => console.log(data))
//       .catch((error) => console.error(error));
//   };

//   // Modificado para ejecutarse después de que los datos se hayan cargado
//   useEffect(() => {
//     if (!isLoading && allUsers.length > 0) {
//       const userExists = allUsers.includes(user1);
//       userExists === true ? console.log("Ya existe este usuario") : createUser();
//     }
//   }, [isLoading, allUsers, tasks]);

//   const findAName = () => {
//     const existingUser = allUsers.find((user) => user === user1);
//     console.log(allUsers);
//     if (allUsers && existingUser) {
//       console.log("Ya Creado");
//     } else {
//       createUser();
//       console.log(allUsers);
//     }
//   };

//   useEffect(() => {
//     if (tasks.length == 10) {
//       setError(true);
//     } else setError(false);
//   }, []);

//   useEffect(() => {
//     if (inputValue.length == maxLength) {
//       setError2(true);
//     } else {
//       setError2(false);
//     }
//   }, []);

//   // Modificado para usar Promise.all y esperar a que ambas llamadas API se completen
//   useEffect(() => {
//     Promise.all([getUserTasks(), getUsers()]).then(() => {
//       setIsLoading(false);
//     });
//   }, []);

//   // Nuevo useEffect para ejecutar findAName después de que los datos se hayan cargado
//   useEffect(() => {
//     if (!isLoading && allUsers.length > 0) {
//       findAName();
//     }
//   }, [isLoading, allUsers]);

//   useEffect(() => {
//     console.log(allUsers);
//     console.log(tasks);
//   }, [allUsers, tasks]);

//   const createToDo = () => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       label: inputValue,
//       is_done: false,
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//     };

//     fetch("https://playground.4geeks.com/todo/todos/AleRugg", requestOptions)
//       .then((response) => response.json())
//       .then((result) => setTasks([...tasks, result]))
//       .catch((error) => console.error(error));
//   };

//   const doneUpdate = (task) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     task.is_done = !task.is_done;
//     const taskMap = tasks.map((taskItem) => {
//       if (taskItem.id === task.id) {
//         return task;
//       }
//       return taskItem;
//     });

//     setTasks(taskMap);
//     const raw = JSON.stringify(task);

//     const requestOptions = {
//       method: "PUT",
//       headers: myHeaders,
//       body: raw,
//     };

//     fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, requestOptions)
//       .then((response) => response.text())
//       .then((result) => console.log(result))
//       .catch((error) => console.error(error));
//   };

//   // Añadido un indicador de carga
//   if (isLoading) {
//     return <div>Cargando...</div>;
//   }

//   return (
//     <div className="container toDoWrapper">
//       <div className="card bg-dark cont">
//         <div className=" d-flex justify-content-center align-items-center mt-2">
//           <div className="maxAlerts">
//             <input
//               className="inputResponsive"
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
//                   value={task.label}
//                   key={index}
//                 >
//                   {task.label}
//                   <div
//                     className="btn-group md-0"
//                     role="group"
//                     aria-label="Basic mixed styles example"
//                   >
//                     <button
//                       type="button"
//                       id="checkButton"
//                       className={`btn  ${
//                         task.is_done ? "btn-success" : "btn-warning"
//                       }`}
//                       onClick={() => doneUpdate(task)}
//                     >
//                       {task.is_done ? "Terminada" : "Pendiente de hacer "}
//                     </button>
//                     <button
//                       type="button"
//                       className="btn btn-danger delete"
//                       onClick={() => deleteTask(task.id)}
//                     >
//                       Borrar
//                     </button>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>

//           <div className="card.footer text-white footer">
//             Llevas {tasks.length} / 10 tareas agregadas a tu lista.
//             <button
//               type="button"
//               className="btn btn-danger delete"
//               onClick={() => deleteAllTasks(tasks.id)}
//             >
//               Borrar todo
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { ToDoList };
