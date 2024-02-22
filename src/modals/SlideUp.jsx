import styles from './SlideUp.module.css'
import React,{useState,useEffect} from 'react';

export default function SlideUp({setModalOpen,isOpen,children,title}){
    const handleClose=()=>{
        setModalOpen(false)
    }
    
      
    return(
        <div className={`${styles.container} ${isOpen?styles.open:styles.closeModal}`}>
        <div className={styles.header}>
            <div className={styles.headerTitle}>{title}</div>
             <div className={styles.close} onClick={handleClose}>x</div>
        </div>
           {children}
        </div>
        )
}