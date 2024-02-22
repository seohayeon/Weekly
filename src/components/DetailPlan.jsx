import React, { useState, useEffect } from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import {Planner,DB,LectureList} from '../database'
import styles from './LecturePlan.module.css'


function planWithDate(LecturesPerDay,checkItems,startDate) {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  let currentDate = new Date(startDate);
  
  let lecturesRemaining = checkItems.length;
  const dateArr = {}
  let lectureNum = 0
  
  if(Object.values(LecturesPerDay).every(val => val === 0)){
        for (var i = 0; i < lecturesRemaining; i++) {
          if(!checkItems[i]) break
          dateArr[checkItems[i]] = new Date()
      }
  }
  while (lecturesRemaining > 0) {
    const currentDayOfWeek = currentDate.getDay();
    let lecturesToday = LecturesPerDay[currentDayOfWeek];
    if(isNaN(lecturesToday)){
        currentDate.setDate(currentDate.getDate() + 1);
         LecturesPerDay[currentDayOfWeek] = 0;
    }else if (lecturesToday > 0) {
      
      for (var i = 0; i < lecturesToday; i++) {
          if(!checkItems[lectureNum]) break
          dateArr[checkItems[lectureNum]] = new Date(currentDate)
          lectureNum++
      }
      currentDate.setDate(currentDate.getDate() + 1);
      lecturesRemaining -= lecturesToday;
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (lecturesRemaining <= 0 || Object.values(LecturesPerDay).every(val => val === 0)) {
      break;
    }
  }
  
  currentDate.setDate(currentDate.getDate() - 1)
  return dateArr;
}

function DetailPlan({
    LecturesPerDay,
    checkItems,
    handleAllCheck,
    lectureArr,
    checkHandled,
    startDate,
    lecture}){
    
    const [lecturesDate,setLectureDate] = useState({}) 
    
    useEffect(()=>{
        const plansDate = planWithDate(LecturesPerDay,checkItems.sort(function(a,b){return a-b}),startDate)
        setLectureDate(plansDate)
    },[LecturesPerDay,lectureArr,checkItems,startDate])
    
    const handleDetailDate=(value,lecNum)=>{
        
        setLectureDate({...lecturesDate,
            [lecNum]:new Date(value)
        })
        
    }
    
    const submitPlan=async ()=>{
         
      const filter = (data) => {
          const today = new Date()
          today.setHours(0,0,0,0);
          return data.date>=today
      }
      await DB.open()
      const isExist = await Planner.find({value:lecture.id,index:'lectureID'},filter).delete()
          
          const keyList = Object.keys(lecturesDate)
          for (var i = 0; i < keyList.length; i++) {
              await Planner.add({id:+new Date(),lectureID:lecture.id,name:lecture.name,lectureNum:Number(keyList[i]),date:lecturesDate[keyList[i]],subject:lecture.subject,clear:false,memo:''})
          }
          alert("등록되었습니다.")
    }
  return (
      <>
          <div className={styles.LectureListContainer}>
        
          <div className={styles.lectureRow}>
          <input type="checkbox" onChange={handleAllCheck} checked={checkItems.length==lectureArr.length?true:false} className={styles.checkBox} id='selectAll'/>
                 <label htmlFor='selectAll'></label>
                 전체선택
        </div>
           {
               lectureArr.map(e=>
               <div className={styles.lectureRow}>
                 <input checked={checkItems.indexOf(e)==-1?false:true} id={e} type='checkbox' onChange={checkHandled} className={styles.checkBox}/>
                 <label htmlFor={e}></label>
                 {e}강
                 {lecturesDate[e]?<input type='date' value={format(lecturesDate[e], 'yyyy-MM-dd')} onChange={(event)=>handleDetailDate(event.target.value,e)}/>:null}
                </div> 
               )
           }
      </div>
      <button onClick={submitPlan} className={styles.setPlanBtn}>계획세우기</button>
      </>
  );
};

export default DetailPlan;
