
import "./AddTodoList.css"
import 'firebase/firestore';
import "./EditTodoList.css";
import { useState } from "react";
import React from 'react'
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import CloseIcon from '@mui/icons-material/Close';

export const EditTodoList = ({editShow, setEditShow, text, detail, limitTime, id}) => {

  // モーダルウィンドウを閉じる
  const closeEditModal = () => {
    setEditShow(false)
  }

  // モーダルウィンドウを開いた際の期限日時の初期値を入れるため、limitTimeの値を加工する
  const defaultLimitDate=limitTime.format('YYYY-MM-DD')
  const defaultLimitTime=limitTime.format('HH:mm')
 
  // 各値をuseStateで設定、初期値は編集前のものを設定しておく
  const [editTodoText, setEditTodoText] = useState(text);
  const [editTodoDetail, setEditTodoDetail] = useState(detail);
  const [editTodoLimitDate, setEditTodoLimitDate] = useState(defaultLimitDate);
  const [editTodoLimitTime, setEditTodoLimitTime] = useState(defaultLimitTime);

  // 期限日時をfirebaseに上手く送れるように加工する
  const newLim = [editTodoLimitDate, editTodoLimitTime];
  const newLimitDateTime = Date.parse(newLim)
  const newLimit = new Date(newLimitDateTime);

  // 変更(送信)ボタンを押したときにはしる関数
  const sendEditTodo = (e) => {
    // 送信ボタンを押したときに、画面がリロードしないようにpreventDefaultが必要。
    e.preventDefault();

    const docId = id;
    
    // ブラウザ上で記入したTODOリストをfirebaseに送信
    const docEdit = doc(db, "todo", docId);
    updateDoc(docEdit, {
      text:editTodoText,
      detail:editTodoDetail,
      limit:newLimit,
    });
  }
  

  if (editShow) {
    return (
      <div id="overlay" onClick={closeEditModal}>
        <div id="content" onClick={(e) => e.stopPropagation()}>
          <form>
            <button onClick={closeEditModal}><CloseIcon /></button>
            <div className='addTodoText_input'>
              <input 
                type="text" 
                defaultValue={text}
                onChange={(e)=>setEditTodoText(e.target.value)}
              />
            </div>
            <div className='addTodoDetail_input'>
              <input 
                type="text" 
                defaultValue={detail}
                onChange={(e) => setEditTodoDetail(e.target.value)}
              />
            </div>
            <div className='addTodoLimit_input'>
              <input 
                type="date" 
                id="date" 
                name="期限日" 
                defaultValue={limitTime.format('YYYY-MM-DD')}
                onChange={(e) => setEditTodoLimitDate(e.target.value)}
              />
              <input 
                type="time" 
                id="time" 
                name="期限時刻"
                defaultValue={limitTime.format('HH:mm')}
                onChange={(e) => setEditTodoLimitTime(e.target.value)}
              />
            </div>
            <div className='addTodo_submit'>
              <button 
                type="submit"
                onClick={sendEditTodo}
              >
                変更
              </button>
            </div>
          </form>
        </div>
      </div >
    )
  } else {
    return null;
  }
}
