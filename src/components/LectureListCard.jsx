import React from 'react';
import styles from './LectureListCard.module.css'
import { ColorPalette } from '../util/ColorPalette'

function LectureListCard({name,teacher,subject,progress,totalLecture}){
    const percent = Math.floor(progress.length/totalLecture*100)
    
  return(
        <div className={styles.CardContainer}>
         <div>[{subject}] {teacher}</div>
         <div>{name} {progress.length}/{totalLecture}</div>
         <div className={styles.progressContainer}>
           <div className={styles.progressBar} style={{width:`${percent}%`,background:`${ColorPalette[subject]}`}}></div>
         </div>
        </div>
      )
}

export default LectureListCard