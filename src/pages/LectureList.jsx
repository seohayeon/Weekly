import React, { useState,useEffect } from 'react';
import {Planner,LectureList,DB} from '../database'
import BoxDB from 'bxd';
import styles from './LectureList.module.css'
import LectureListCard from '../components/LectureListCard'
import AddLecture from '../modals/AddLecture'
import LectureDetail from '../modals/LectureDetail'

function App() {
  
  const [view,setView] = useState([])
  const [selectLecture,setSelectLecture] = useState(null) 
  const [LecDetailModalOpen,setLecDetailModalOpen] = useState(false)
  
  useEffect(()=>{
      DB.open()
      .then(async ()=>{
          const data = await LectureList.find().get();
          setView(data)
      })
  },[LecDetailModalOpen]) 
  
  const [AddLecModalOpen,setAddLecModalOpen] = useState(false)
  
  
  return (
    <div>
     
     <div className={styles.AddCardContainer} onClick={()=>setAddLecModalOpen(!AddLecModalOpen)}>
        + 새 강좌 추가 
    </div>
      
     <div>
       {
           view.map((e)=>
             <div onClick={()=>{setLecDetailModalOpen(!LecDetailModalOpen);setSelectLecture(e)}}>
             <LectureListCard subject={e.subject} name={e.name} teacher={e.teacher} totalLecture={e.totalLecture} progress={e.progress}/>
             </div>
           )
       }
     </div>
     <AddLecture setModalOpen={setAddLecModalOpen} isOpen={AddLecModalOpen} setView={setView}/>
     <LectureDetail setModalOpen={setLecDetailModalOpen} isOpen={LecDetailModalOpen} lecture={selectLecture}/>
    </div>
  );
};

export default App;
