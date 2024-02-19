import {LectureList,DB} from '../database'
import LecturePlan from '../components/LecturePlan'
import styles from './AddLecture.module.css'
import React,{useState} from 'react';

export default function AddPlan({setModalOpen,isOpen,setView}){
    const handleClose=()=>{
        setModalOpen(false)
    }
    const [inputs,setInputs]=useState({
      subject:'',
      name:'',
      totalLecture:'',
      teacher:'',
      progress:[]
  })
  const {subject,name,teacher,totalLecture}=inputs
  const handleInputsChange=(e)=>{
      const {name,value} = e.target
      setInputs({
          ...inputs,
          [name]:value
      })
  }
  const handleAddSubmit=async()=>{
      const date = new Date();
      const addData={
        id:+date,
        subject:inputs.subject,
        name:inputs.name,
        totalLecture:Number(inputs.totalLecture),
        teacher:inputs.teacher,
        progress:[]
      }
      await DB.open()
      await LectureList.add(addData)
      setView(prev=>[addData,...prev])
      setModalOpen(false)

  }
    return(
        <div className={`${styles.container} ${isOpen?styles.open:styles.closeModal}`}>
            <div className={styles.close} onClick={handleClose}>x</div>
            <div className={styles.formContainer} >
               <div><input className={styles.input} type='text' name='subject' placeholder='과목' value={subject} onChange={handleInputsChange}/></div>
               <div><input className={styles.input}  type='text' name='name' placeholder='강좌명' value={name} onChange={handleInputsChange}/></div>
               <div><input className={styles.input}  type='text' name='teacher' placeholder='선생님' value={teacher} onChange={handleInputsChange}/></div>
               <div><input className={styles.input} type='number' placeholder='강좌수' name='totalLecture' value={totalLecture} onChange={handleInputsChange}/></div>
             <button className={styles.submitBtn}  onClick={handleAddSubmit}>등록</button>
             </div>
        </div>
        )
}