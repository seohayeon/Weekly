import LecturePlan from '../components/LecturePlan'
import styles from './AddPlan.module.css'
import React from 'react';

export default function AddPlan({lecture,setModalOpen ,height}){
    const handleClose=()=>{
        setModalOpen(false)
    }
    
    return(
        <div className={`${styles.container}`} style={{height:`${height}px`}}>
          <div className={styles.close} onClick={handleClose}>x</div>
          <LecturePlan lecture={lecture}/>
        </div>
        )
}