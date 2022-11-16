
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styles from "./TodoList.css";
import dayjs from 'dayjs';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.js"
import EditIcon from '@mui/icons-material/Edit';
import { useRef, useState } from "react";
import { EditTodoList } from './EditTodoList';
import React, { useEffect } from 'react'

function TodoList({text, limit, detail, id, state}) {
  // 受け取ったlimitをJSで使えるようにtoDate()で変換
  const time = limit.toDate()
  // toDate()で変換したそのままのデータは、「Sat Nov 26 2022 00:00:00 GMT+0900 (日本標準時)」って感じで使いにくいので、使いやすいようにDay.jsで変換
  const limitTime = dayjs(time);

  // TODOリストを削除する
  const handleDeleteTodo = (e) => {
    deleteDoc(doc(db, "users", auth.currentUser.uid, "todos",e));
  };

  // TODOリストの編集画面のモーダルウィンドウ
  const [editShow, setEditShow] = useState(false)
  const openEditModal = () => {
    setEditShow(true)
  }
  
  // stateのプルダウンの内容
  const todoStates = ["未着手", "進行中", "完了"];
  // stateのプルダウンの値を管理
  const [editTodoState, setEditTodoState] = useState(state);
  // stateのプルダウンを動かすための関数
  const handleChange = (e) => {
    setEditTodoState(e.target.value);
  };
  // stateのプルダウンの内容をfirebaseに送信する関数（クリックするたびに送信）
  const sendTodoState = useEffect(() => {
    const docId = id;
    const docEdit = doc(db, "users", auth.currentUser.uid, "todos", docId); 
    updateDoc(docEdit, {
      state:editTodoState
    })
  },[editTodoState])
  
  // 詳細表示の実装
  const childElement = useRef(null);
  const [showChildren, setShowChildren] = useState(false);
  const [childHeight, setChildHeight] = useState(0);
  useEffect(() => {
    if (childElement.current) {
      const height = childElement.current?.clientHeight;
      setChildHeight(height);
    }
  },[]);
  
  // 詳細を表示する矢印ボタンの実装
  const [active, setActive] = useState(false);
  const handleClick = () => {
    if (childElement.current) {
      setShowChildren(!showChildren);
    }
    setActive(!active)
  }

  return (
    <div>
      <ul>
        <li>
          <div className='todolist-index'>
            <div className='todolist-text'>
              <p>{text}</p>
            </div>
            <div className='todolist-limit'>
              <p>期限：{limitTime.format('YYYY-MM-DD HH:mm')}</p>
            </div>
            <div className='state-select-box'>
              <select 
                className='state-select'
                value={editTodoState}
                onChange={handleChange}
                onClick={sendTodoState}
              >
                {todoStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button  className='edit-button' onClick={openEditModal}>
                <EditIcon />
              </button>
              <EditTodoList 
                editShow={editShow} 
                setEditShow={setEditShow}
                text={text}
                detail={detail}
                limitTime={limitTime}
                id={id}
              />
            </div>
            <div>
              <button  className='deleteTodo-button' onClick={() => handleDeleteTodo(id)}>
                <DeleteForeverIcon />
              </button>
            </div>
            <div className={active ? "detail-button-reverse" : "detail-button"} onClick={handleClick}>
              <ArrowBackIosNewIcon onClick={handleClick}/>
            </div>
          </div>
          <div 
            style={{
              height: {detail} && showChildren ? "100%" : "0px",
              opacity: {detail} && showChildren ? 1 : 0,
              overflow: "hidden",
              backgroundColor: "rgb(240 240 240)",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <div className='todo-detail' ref={childElement}>{detail}</div>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default TodoList