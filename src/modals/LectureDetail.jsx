import {LectureList,DB} from '../database'
import LecturePlan from '../components/LecturePlan'
import styles from './LectureDetail.module.css'
import React,{useState,useEffect} from 'react';
import AddPlan from '../modals/AddPlan'
import { ReactComponent as ClearIcon } from "../assets/icons/clear.svg";

export default function LectureDetail({setModalOpen,isOpen,lecture}){
    const handleClose=()=>{
        setModalOpen(false)
    }
    const lectureArr = Array.from({length: lecture?.totalLecture}, (_, i) => i + 1)
    const [addPlanModalOpen,setAddPlanModalOpen] = useState(false)
    
    const [timer,setTimer] = useState()
    const [pressLec,setPressLec] = useState()
    const [progress,setProgress] = useState()
    
    useEffect(()=>{
        setProgress(lecture?.progress)
    },[lecture])
    
    const [viewHeight,setViewHeight] = useState()
    
    useEffect(()=>{
        setViewHeight(window.innerHeight)
        window.addEventListener('resize',function(){
            setViewHeight(window.innerHeight)
        })
    },[])
    
    const timeOutEvent=(lecNum)=>{
        if(progress.indexOf(lecNum) == -1){
          setProgress(prev=>[...prev,lecNum])
          clearLecture(progress,lecture.id,lecNum,'ADD')
        }else{
            setProgress(prev=>prev.filter(e=>e !== lecNum))
            clearLecture(progress,lecture.id,lecNum,'DEL')
        } 
    }
    
    const handleMouseDown=async(lecNum)=>{
        if(timer) clearTimeout(timer);
        setPressLec(lecNum)
        setTimer(setTimeout(()=>timeOutEvent(lecNum), 800));
    }
    
    const handleMouseUp=()=>{
        setPressLec()
        clearTimeout(timer);
    }

    
    
    return(
        <div className={`${styles.container} ${isOpen?styles.open:styles.closeModal}`} style={{overflow:addPlanModalOpen?'hidden':null}}>
            <div className={styles.close} onClick={handleClose}>x</div>
            <div className={styles.detailContainer} >
               <div>[{lecture?.subject}] {lecture?.name}</div>
               <div>{lecture?.teacher}</div>
               <button onClick={()=>setAddPlanModalOpen(!addPlanModalOpen)}>계획추가</button>
               {
                   lectureArr.map(e=>
                       <>
                       <div className={`${styles.eachLec}`} 
                       onMouseDown={()=>handleMouseDown(e)} 
                       onMouseUp={handleMouseUp}
                       onTouchStart={()=>handleMouseDown(e)}
                       onTouchEnd={handleMouseUp}
                       onTouchMove={handleMouseUp}>
                       <div className={`${styles.gauge} ${pressLec==e&&styles.pressing}`}></div>
                       <div className={styles.lectureInfo}>
                       {e}강
                       {progress?.find(item=>item==e)?<div className={styles.clear}><ClearIcon width={25} height={25} fill='#23D160'/></div>
                       :null}
                       </div>
                       </div>
                       
                       </>
                   )
               }
             </div>
             {addPlanModalOpen&&<AddPlan setModalOpen={setAddPlanModalOpen} lecture={lecture} height={viewHeight}/>}
        </div>
        )
}

async function clearLecture(progress,lectureID,lecNum,type){
        const pgrSet= new Set(progress)
        
        if(type=='ADD') pgrSet.add(lecNum)
        else if(type=='DEL') pgrSet.delete(lecNum)
        const arraySet = Array.from(pgrSet)
        await LectureList.find({value:lectureID,key:'id'}).update({progress:arraySet})
      
}