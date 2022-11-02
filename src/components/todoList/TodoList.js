
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import "./TodoList.css";
import dayjs from 'dayjs';
import { doc, deleteDoc} from "firebase/firestore";
import { db } from "../../firebase";



function TodoList({text, limit, detail, id}) {
  // 受け取ったlimitをJSで使えるようにtoDate()で変換
  const time = limit.toDate()
  // toDate()で変換したそのままのデータは、「Sat Nov 26 2022 00:00:00 GMT+0900 (日本標準時)」って感じで使いにくいので、使いやすいようにDay.jsで変換
  const limitTime = dayjs(time);
  
  // TODOリストを削除する
  const handledeleteTodo = (e) => {
    deleteDoc(doc(db, "todo", e));
  };

  return (
    <div>
      <ul>
        <li>
          <div className='todolist-index'>
            <p className='todolist-title'>
              {text}
            </p>
            <p className='todolist-limit'>
              期限{limitTime.format('YYYY-MM-DD HH:mm')}
            </p>
            <select>
              <option>未着手</option>
              <option>進行中</option>
              <option>完了</option>
            </select>
            <button className='deleteTodo-button' onClick={() => handledeleteTodo(id)}>
              <DeleteForeverIcon />
            </button>
            <ArrowBackIosNewIcon className='todolist-details-bottun'/>
          </div>
          <p>{detail}</p>
        </li>
      </ul>
    </div>
  )
}

export default TodoList