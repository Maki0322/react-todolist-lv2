import { signOut } from "firebase/auth";
import { createContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import AddTodoList from "./todoList/AddTodoList";
import TodoList from "./todoList/TodoList";
import { collection, getDocs } from "firebase/firestore"
import "./home.css"
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export const userIdInfo = createContext();

const Home = () => {
  // サインアウトしているとログイン画面に遷移する
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  };

  // 【TODOリストを管理】
  // TODOリストの内容をを管理
  const [todos, setTodos] = useState([]);
  // TODOリストをfirebaseのtodoというコレクションに追加する
  // useEffect(() => {
  //   const postData = collection(db, "todo");
  //   getDocs(postData).then((querySnapshot) => {
  //     setTodos(querySnapshot.docs.map((doc) => doc.data()))
  //   });
  // }, [])
  // TODOリストをfirebaseのusersというコレクションに追加する
  useEffect(() => {
    const postData = collection(db, "users", auth.currentUser.uid, "todos");
    getDocs(postData).then((querySnapshot) => {
      setTodos(querySnapshot.docs.map((doc) => doc.data()))
    });
  }, [])
  

  // 【フィルターボタン（<select>タグ）を実装】
  // フィルターボタンのプルダウンの内容
  const filterState = ["すべて", "未着手", "進行中", "完了"];
  // プルダウンの値を管理
  const [filterTodo, setFilterTodo] = useState("すべて");
  // プルダウンを動かすための関数
  const handleChange = (e) => {
    setFilterTodo(e.target.value);
  };
     
  // 【フィルターボタンで選択した内容をTODOリストに反映させる】
  // フィルターで絞り込んだTODOの値を管理
  const [filteredTodoLists, setFilteredTodoLists] = useState([...todos]);
  // todos（TODOリストの内容） と filterTodo（フィルターボタンの内容） が更新されるたびに filteredTodoLists を更新することで、<select>タグと表示されるTODOリストを連携
  useEffect(() => {
    if(filterTodo === 'すべて'){
      setFilteredTodoLists([...todos])
    } else {
      setFilteredTodoLists(todos.filter(todo => {
        return todo.state == filterTodo
      }))
    }     
  }, [todos, filterTodo])


  // TODOリスト追加のモーダルウィンドウ
  const [createNewTodo, setCreateNewTodo] = useState(false)
  const openCreateNewTodoModal = () => {
    setCreateNewTodo(true)
  }

  return (
    <div>
      <div className="header">
        <div className="header-contents">
          <div className="add-todolist">
            <button className='openCreateNewTodoModal' onClick={openCreateNewTodoModal}>
              新規タスクを追加<span>＋</span>
            </button>
            <AddTodoList
              createNewTodo={createNewTodo}
              setCreateNewTodo={setCreateNewTodo}
            />
          </div>
          <div className="sort-todo-totle">
            絞り込み：
          </div>
          <div className="sort-todo-box">
            <select
              className="sort-todo"
              value={filterTodo}
              onChange={handleChange}
            >
              {filterState.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <button className="logout-button" onClick={handleLogout}>ログアウト</button>
        </div>

        </div>
      {/* TODOリストの内容を表示する部分 */}
      <div className="todolist">
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
    </div>
  ); 
};

export default Home;