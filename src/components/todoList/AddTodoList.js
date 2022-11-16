import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import "./AddTodoList.css"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "../../firebase.js"
import 'firebase/firestore';
import UUID from 'uuidjs';

function AddTodoList({createNewTodo, setCreateNewTodo}) {
  // TODOの各値をuseStateで管理
  const [todoText, setTodoText] = useState("");
  const [todoDetail, setTodoDetail] = useState("");
  const [todoLimitDate, setTodoLimitDate] = useState("");
  const [todoLimitTime, setTodoLimitTime] = useState("");
  
  // TODOリストの期限日時をfirebaseに上手く送れるように加工
  const lim = [todoLimitDate, todoLimitTime];
  const limitDateTime = Date.parse(lim)
  const limit = new Date(limitDateTime);
  
  // uuidで各TODOのdocIdを作成
  const docId = UUID.generate();
  
  // 【送信ボタンを押したときに、firebaseのデータベースにデータを送信（追加）する機能】
  const sendTodo = (e) => {
    e.preventDefault();
    // コレクションは"users"でその中にサブコレクションとして"todos"を作る
    const docRef = doc(db, "users", auth.currentUser.uid, "todos", docId);
    // ブラウザ上で記入したTODOリストをfirebaseに送信
    const data = {
      text:todoText,
      limit:limit,
      detail:todoDetail,
      id:docId,
      state:"未着手",
      userId:auth.currentUser.uid,
      timestamp: serverTimestamp(),
    }
    setDoc(docRef ,data);
    // モーダルウィンドウを閉じる
    setCreateNewTodo(false)
  }
  
  // モーダルウィンドウを閉じる関数
  const closeCreateNewTodoModal = () => {
    setCreateNewTodo(false)
  }
  
  if(createNewTodo){
    return (
      <div>
        <div id="overlay-create" onClick={closeCreateNewTodoModal}>
          <div id="content-create" onClick={(e) => e.stopPropagation()}>
            <form>
              <div className='close-icon'>
                <button onClick={closeCreateNewTodoModal}><CloseIcon /></button>
              </div>
              <div>
                <div className='setTodoText-input'>
                  <input 
                    type="text" 
                    placeholder='タスクを入力'
                    onChange={(e) => setTodoText(e.target.value)}
                  />
                </div>
                <div className='setTodoDetail-input'>
                  <textarea 
                    cols="20"
                    rows="5"
                    type="text" 
                    placeholder='詳細を入力'
                    onChange={(e) => setTodoDetail(e.target.value)}
                  />
                </div>
                <div className='setTodoLimit-input'>
                  <input 
                    className='setTodoLimitDate-input'
                    type="date" 
                    id="date" 
                    name="期限日" 
                    onChange={(e) => setTodoLimitDate(e.target.value)}
                  />
                  <input 
                    className='setTodoLimitTime-input'
                    type="time" 
                    id="time" 
                    name="期限時刻"
                    onChange={(e) => setTodoLimitTime(e.target.value)}
                  />
                </div>
                <div className='todo-submit'>
                  <button 
                    type="submit"
                    onClick={sendTodo}
                  >
                    追加
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default AddTodoList