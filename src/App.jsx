import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  update,
} from "firebase/database";

const App = () => {
  let [task, setTask] = useState("");
  let [todos, setAllTodos] = useState([]);
  let [edit, setEdit] = useState(false);
  let [updatedTask, setUpdatedTask] = useState("");
  let [id , setId]=useState("")

  let handlesubmit = () => {
    const db = getDatabase();
    set(push(ref(db, "todos/")), {
      name: task,
    }).then(() => {
      setTask("");
      alert("Task Added");
    });
  };

  let handleTask = (e) => {
    setTask(e.target.value);
  };

  
  let handleDelete = (id) => {
     const db = getDatabase();
     remove(ref(db, "todos/" + id));
  };

  let handleEdit = (id) => {
    setId(id)
    setEdit(!edit);
  };

  let handleUpdatedTask = (e) => {
    setUpdatedTask(e.target.value);
  };
  let handleupdate = () => {
    const db = getDatabase();
    update(ref(db, "todos/" + id), {
      
      name : updatedTask
    }).then(
      handleEdit("")
    )
  };

  useEffect(() => {
    const db = getDatabase();
    const getTodos = ref(db, "todos/");
    onValue(getTodos, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push({ ...item.val(), id: item.key });
      });
      setAllTodos(array);
    });
  }, []);

  return (
    <>
      <div className="w-[227px] mx-auto text-center">
        <h2 className=" p-4 mt-10 relative">TODO LIST</h2>
        <input
          className="border-2"
          type="text"
          placeholder="ENTER YOUR TASK"
          onChange={handleTask}
          value={task}
        />
        <button
          onClick={handlesubmit}
          className=" border-2 border-black p-2 mt-4 rounded-[30%] mb-[10px]"
        >
          Submit
        </button>
        <ul>
          {todos.map((item) => {
            return (
              <li className="mb-[5px]">
                {item.name}
                <button
                  onClick={() => {
                    handleDelete(item.id);
                  }}
                  className="border-2 bg-red-200 px-1 rounded-[20%] ml-1"
                >
                  x
                </button>
                <button
                  onClick={()=>handleEdit(item.id)}
                  className=" border px-1 rounded-[20%] ml-1 bg-teal-300 text-white "
                >
                  Edit
                </button>
              </li>
            );
          })}
          {edit && (
            <div className="w-[200px] h-[200px] bg-gray-400 mx-auto absolute top-0 left-[50%] translate-x-[-50%] rounded-md">
              <input
                onChange={handleUpdatedTask}
                className="mt-10 rounded-sm"
                type="text"
                placeholder="UPDATE YOUR TEXT"
              />
              <button
                onClick={() => handleupdate()}
                className="border px-1 rounded-[20%] m-2 bg-red-300 text-white"
              >
                Update
              </button>
              <button
                onClick={() => setEdit()}
                className=" border px-1 rounded-[20%] m-2 bg-red-300 text-white "
              >
                x
              </button>
            </div>
          )}
        </ul>
      </div>
    </>
  );
};
export default App;
