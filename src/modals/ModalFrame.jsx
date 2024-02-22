import React, { useState, useRef,useEffect } from 'react';
import styles from './ModalFrame.module.css'


export default function Menu({isOpen,setOpen,children}){
    
    return(
        isOpen?
        <div className={styles.container} onClick={()=>{setOpen(!isOpen);}}>
          <div className={styles.innerContainer} onClick={(e)=>e.stopPropagation()}>
            <div>데이터 내보내기</div>
            <div>{children}</div>
          </div>
        </div>
        :null
        )
}