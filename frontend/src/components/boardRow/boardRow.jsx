import React, { useEffect, useRef } from 'react';
import styles from './boardRow.module.css'
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser'
import { useMediaQuery } from 'react-responsive';

const BoardRow = ({id, info, isToggled, onToggle}) => {
  const {title, writer, date, content, file: fileLink} = info
  const fileName = fileLink.split('/').pop()
  const isTabletOrMobile = useMediaQuery({query: '(max-width: 1024px)'})

  function handleToggling(e) {
    onToggle(id, e.currentTarget)
  }

  function handleWriter(w) {
    return w.split('/')[0]
  }

  function handleDate(d) {
    return d.slice(2, 10)
  }

  function transformContentImg(node, index) {
    if (node.name === 'img'){
      const src = node.attribs.src
      node.attribs = {
        src:src,
        width:'100%'
      }
      return convertNodeToElement(node, index, transformContentImg)
    }
  }

  return (
    <div className={styles.row_container}>
      <div className={`${styles.row} ${isToggled && styles.toggled}`} onClick={handleToggling}>
        <div className={styles.title}>{title}</div>
        <div className={`${styles.metadata} ${isTabletOrMobile && styles.tablet_mobile}`}>
          <div className={styles.writer}>{handleWriter(writer)}</div>
          <div className={styles.date}>{handleDate(date)}</div>
        </div>
      </div>
      {
        isToggled && 
        <div className={styles.content}>
          {ReactHtmlParser(content, {transform: transformContentImg})}
          {fileLink && <div className={styles.file_container}><a href={fileLink}>{fileName}</a></div>}
        </div>
      }
    </div> 
  );
}

export default BoardRow;