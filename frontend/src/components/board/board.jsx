import React, { useEffect, useRef, useState } from 'react';
import styles from './board.module.css'
import BoardRow from '../boardRow/boardRow';
import BoardCategory from '../boardCategory/boardCategory';

const Board = ({list, categoryList, onCategorySelect}) => {
  const toggledElement = useRef(null)
  const [toggledRow, setToggledRow] = useState(null)

  useEffect(() => {
    toggledElement.current && toggledElement.current.scrollIntoView({
      behavior: 'smooth',
    })
  }, [toggledElement.current])


  function handleToggling(id, element) {
    toggledRow === id ? setToggledRow(null) : setToggledRow(id)
    toggledElement.current = toggledElement.current === element ? null : element
  }
  
  return (
    <div>
      <BoardCategory categoryList={categoryList} onCategorySelect={onCategorySelect}/>
      <div className={styles.board}>
        {list && list.map((item) => {
          const toggled = item._id === toggledRow ? true : false
          return <BoardRow id={item._id} info={item} isToggled={toggled} onToggle={handleToggling}/>
        })}
      </div>
    </div>
  );

}

export default Board;
