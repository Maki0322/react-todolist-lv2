import { signOut } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AddTodoList from "./todoList/AddTodoList";
import TodoList from "./todoList/TodoList";
import { collection, getDocs } from "firebase/firestore"
import "./home.css"


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
  
  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>ログアウト</button>
      {/* TODOリストを入力する部分 */}
      <div className="add-todolist">
        <AddTodoList/>
      </div>

      {/* TODOリストの内容を表示する部分 */}
      {todos.map((todo) => (  
          <TodoList 
            key={todo.id}
            id={todo.id}
            text={todo.text}
            limit={todo.limit}
            detail={todo.detail}
        />
      ))}     
    </div>
  );
};

export default Home;