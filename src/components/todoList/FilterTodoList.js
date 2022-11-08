import React, { useEffect } from 'react'
import { useState } from "react";

function FilterTodoList() {
  const filterState = ["すべて", "未着手", "進行中", "完了"];
  // stateのプルダウンの値を管理
  const [filterTodo, setFilterTodo] = useState("すべて");
  // stateのプルダウンを動かすための関数
  const handleChange = (e) => {
    setFilterTodo(e.target.value);
  };
  // stateのプルダウンの内容をfirebaseに送信する関数（クリックするたびに送信）
  const filter = () => {
    console.log(filterTodo)
  }
  const filtering = useEffect(() => {
    filter()
  },[filterTodo])

  

  return (
    <div>
      <select
        value={filterTodo}
        onChange={handleChange}
        onClick={filtering}
      >
        {filterState.map((state) => (
          <option n key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterTodoList
