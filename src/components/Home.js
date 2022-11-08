import { signOut } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import AddTodoList from "./todoList/AddTodoList";
import TodoList from "./todoList/TodoList";
import { collection, getDocs } from "firebase/firestore"
import "./home.css"
import FilterTodoList from "./todoList/FilterTodoList";
import { matchSorter } from 'match-sorter'

const Home = () => {
  // サインアウトしているとログイン画面に遷移する
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  };

  // TODOリストをfirebaseのtodoというコレクションに追加する
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const postData = collection(db, "todo");
    getDocs(postData).then((querySnapshot) => {
      setTodos(querySnapshot.docs.map((doc) => doc.data()))
    });
  }, [])
  
  // フィルター機能
  const filterState = ["すべて", "未着手", "進行中", "完了"];
  // stateのプルダウンの値を管理
  const [filterTodo, setFilterTodo] = useState("すべて");
  // stateのプルダウンを動かすための関数
  const handleChange = (e) => {
    setFilterTodo(e.target.value);
  };
     
  
  // 【絞り込み機能】
  // 表示用のstate
  const [filteredTodoLists, setFilteredTodoLists] = useState([...todos]);
  useEffect(() => {
    if(filterTodo === 'すべて'){
      setFilteredTodoLists([...todos])
    } else {
      setFilteredTodoLists(todos.filter(todo => {
        return todo.state == filterTodo
      }))
    }     
  }, [filterTodo])
  
  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>ログアウト</button>
      <div className="add-todolist">
        <AddTodoList/>
        {/* <FilterTodoList /> */}
          <select
          value={filterTodo}
          onChange={handleChange}
          // onClick={filtering}
        >
          {filterState.map((state) => (
            <option n key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      
      {/* TODOリストの内容を表示する部分 */}
      {/* {todos.map((todo) => (   */}
      {filteredTodoLists.map((todo) => (  
          <TodoList 
            key={todo.id}
            id={todo.id}
            text={todo.text}
            limit={todo.limit}
            detail={todo.detail}
            state={todo.state}
        />
      ))}     
      
    </div>
  );
      
  // const allTodo = todos;
  // const notStartedTodo = matchSorter(todos, '未着手', {keys:[item => item.state]})
  // const inProgressTodo = matchSorter(todos, '進行中', {keys:[item => item.state]})
  // const completedTodo = matchSorter(todos, '完了', {keys:[item => item.state]})
  
  // console.log("todos：", todos)
  // console.log("すべて：", allTodo);
  // console.log("未着手：", notStartedTodo);
  // console.log("進行中：", inProgressTodo);
  // console.log("完了：", completedTodo);
  
  // const switchTodo = () => {
  //   switch(filterState){
  //     case 'すべて' :
  //       return(
  //         <div>
  //           <button className="logout-button" onClick={handleLogout}>ログアウト</button>
  //           <div className="add-todolist">
  //             <AddTodoList/>
  //              {/* <FilterTodoList /> */}
  //              <select
  //               value={filterTodo}
  //               onChange={handleChange}
  //               onClick={filtering}
  //             >
  //               {filterState.map((state) => (
  //                 <option n key={state} value={state}>
  //                   {state}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           {/* TODOリストの内容を表示する部分 */}
  //           {allTodo.map((todo) => (  
  //             <TodoList 
  //               key={todo.id}
  //               id={todo.id}
  //               text={todo.text}
  //               limit={todo.limit}
  //               detail={todo.detail}
  //               state={todo.state}
  //             />
  //           ))}     
  //         </div>
  //       )
  //     case '未着手' :
  //       return(
  //         <div>
  //           <button className="logout-button" onClick={handleLogout}>ログアウト</button>
  //           <div className="add-todolist">
  //             <AddTodoList/>
  //              {/* <FilterTodoList /> */}
  //              <select
  //               value={filterTodo}
  //               onChange={handleChange}
  //               onClick={filtering}
  //             >
  //               {filterState.map((state) => (
  //                 <option n key={state} value={state}>
  //                   {state}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           {/* TODOリストの内容を表示する部分 */}
  //           {notStartedTodo.map((todo) => (  
  //             <TodoList 
  //               key={todo.id}
  //               id={todo.id}
  //               text={todo.text}
  //               limit={todo.limit}
  //               detail={todo.detail}
  //               state={todo.state}
  //             />
  //           ))}     
  //         </div>
  //       )
  //     case '進行中' :
  //       return(
  //         <div>
  //           <button className="logout-button" onClick={handleLogout}>ログアウト</button>
  //           <div className="add-todolist">
  //             <AddTodoList/>
  //              {/* <FilterTodoList /> */}
  //              <select
  //               value={filterTodo}
  //               onChange={handleChange}
  //               onClick={filtering}
  //             >
  //               {filterState.map((state) => (
  //                 <option n key={state} value={state}>
  //                   {state}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           {/* TODOリストの内容を表示する部分 */}
  //           {inProgressTodo.map((todo) => (  
  //             <TodoList 
  //               key={todo.id}
  //               id={todo.id}
  //               text={todo.text}
  //               limit={todo.limit}
  //               detail={todo.detail}
  //               state={todo.state}
  //             />
  //           ))}     
  //         </div>
  //       )
  //     case '完了' :
  //       return(
  //         <div>
  //           <button className="logout-button" onClick={handleLogout}>ログアウト</button>
  //           <div className="add-todolist">
  //             <AddTodoList/>
  //              {/* <FilterTodoList /> */}
  //              <select
  //               value={filterTodo}
  //               onChange={handleChange}
  //               onClick={filtering}
  //             >
  //               {filterState.map((state) => (
  //                 <option n key={state} value={state}>
  //                   {state}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>
  //           {/* TODOリストの内容を表示する部分 */}
  //           {completedTodo.map((todo) => (  
  //             <TodoList 
  //               key={todo.id}
  //               id={todo.id}
  //               text={todo.text}
  //               limit={todo.limit}
  //               detail={todo.detail}
  //               state={todo.state}
  //             />
  //           ))}     
  //         </div>
  //       )
  //   }
  //   return (
  //     <>
  //       {switchTodo()}
  //     </>
  //   )
  // }
  
};

export default Home;