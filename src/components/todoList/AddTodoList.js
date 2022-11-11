import React, { useState } from 'react'
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import "./AddTodoList.css"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../../firebase.js"
import 'firebase/firestore';
import UUID from 'uuidjs';

function AddTodoList() {
  const [addTodoText, setAddTodoText] = useState("");
  const [addTodoDetail, setAddTodoDetail] = useState("");
  const [addTodoLimitDate, setAddTodoLimitDate] = useState("");
  const [addTodoLimitTime, setAddTodoLimitTime] = useState("");

  // TODOリストの期限日時をfirebaseに上手く送れるように加工
  const lim = [addTodoLimitDate, addTodoLimitTime];
  const limitDateTime = Date.parse(lim)
  const limit = new Date(limitDateTime);

  const docId = UUID.generate();
  

  // 【firebaseのデータベースにデータを送信（追加）する】
  const sendTodo = (e) => {
    // 送信ボタンを押したときに、画面がリロードしないようにpreventDefaultが必要。
    e.preventDefault();
    // コレクションは"users"でその中にサブコレクションとして"todos"を作る
    const docRef = doc(db, "todo", docId);
    // ブラウザ上で記入したTODOリストをfirebaseに送信
    const data = {
      text:addTodoText,
      limit:limit,
      detail:addTodoDetail,
      id:docId,
      state:"未着手",
      userId:auth.currentUser.uid,
    }
    setDoc(docRef, data);
  }


  return (
    <div>
      <button>
        <label className='open' htmlFor="pop-up">タスクを追加</label>
      </button>
      <input  type="checkbox" id="pop-up"/>
      <div className='overlay'>
        <div className='window'>
          <label className="close" htmlFor="pop-up"><CloseIcon/></label>
          <div className="text">
            <form>
              <div className='addTodoText_input'>
                <input 
                  type="text" 
                  placeholder='タスクを入力'
                  onChange={(e) => setAddTodoText(e.target.value)}
                />
              </div>
              <div className='addTodoDetail_input'>
                <input 
                  type="text" 
                  placeholder='詳細を入力'
                  onChange={(e) => setAddTodoDetail(e.target.value)}
                />
              </div>
              <div className='addTodoLimit_input'>
                <input 
                  type="date" 
                  id="date" 
                  name="期限日" 
                  onChange={(e) => setAddTodoLimitDate(e.target.value)}
                />
                <input 
                  type="time" 
                  id="time" 
                  name="期限時刻"
                  onChange={(e) => setAddTodoLimitTime(e.target.value)}
                />
               
              </div>
              <div className='addTodo_submit'>
                <Button 
                  type="submit"
                  onClick={sendTodo}
                >
                  追加
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTodoList