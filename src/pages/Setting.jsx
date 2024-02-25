import React,{useState} from 'react';
import styles from './Setting.module.css'
import { DB } from '../database'
import { exportToJson,importFromJson,clearDatabase } from '../util/idb-backup-and-restore.mjs'
import CryptoJS from 'crypto-js';
import SlideUp from '../modals/SlideUp'
import Modal from '../modals/ModalFrame'

let data=''
function App() {
  const [manageData,setManageData] = useState(false) 
  let db = {}
  const request = indexedDB.open("chipDB");
  request.addEventListener("success", (e) => {
          db = e.target.result;
   });
  const [inputs,setInputs] = useState({bakPwd:'',restorePwd:''})
  const {bakPwd,restorePwd} = inputs  
  
  const handleExportData=async(pwd)=>{
    exportToJson(db)
    .then(result => {
        const ciphertext = CryptoJS.AES.encrypt(result,bakPwd).toString();
        data=ciphertext
        console.log('Exported JSON string:', ciphertext)
        const element = document.createElement("a");
        element.href = URL.createObjectURL(
        new Blob([ciphertext],{type: 'text/plain'})
        );
        element.download = `weekly-${+new Date()}.bak`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        setInputs({...inputs,bakPwd:''})
        setOpen(false)
    })
    .catch(error => {
        console.error('Something went wrong during export:', error)
    })
  }
  const [file,setFile] = useState('')
  
  const handleImportData=async(pwd)=>{
      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result)
        const bytes = CryptoJS.AES.decrypt(reader.result, pwd)
          const serializedData = bytes.toString(CryptoJS.enc.Utf8);
          clearDatabase(db)
          .then(() => importFromJson(db, serializedData))
          .then(() => {
            console.log('Successfully imported data')
          })
          .catch(error => {
            console.error('Something went wrong during import:', error)
          })
      };
      reader.readAsText(file[0], 'utf-8');
  }
  const [exportDataModal,setExportDataModal] = useState(false) 
  const [importDataModal,setImportDataModal] = useState(false) 
  
  const handleInput=(e)=>{
      const {name,value} = e.target
      setInputs({...inputs,[name]:value})
  }
  return (
    <>
    <div className={styles.menuHeader}>메뉴</div>
    <div className={styles.settingContainer}>
      <button className={styles.settingRow}>버전<div className={styles.version}>1.0.0</div></button>
      <button className={styles.settingRow} onClick={()=>setManageData(!manageData)}>데이터 관리</button>
      <button className={styles.settingRow}>테마</button>
      <button className={styles.settingRow} onClick={()=>{window.location.href = "mailto:ondojung@gmail.com";}}>피드백 보내기</button>
      <button className={styles.settingRow} onClick={()=>{window.open('https://chipsnet.tistory.com/')}}>개발자의 블로그</button>
    </div>
    <SlideUp isOpen={manageData} setModalOpen={setManageData} title='데이터 관리'>
        <div className={styles.settingContainer}>
            <div className={styles.settingRow} onClick={()=>setExportDataModal(true)}>데이터 내보내기</div>
            <Modal isOpen={exportDataModal} setOpen={setExportDataModal} header='데이터 내보내기'>
                <div><input type='password' placeholder='백업 암호' onChange={handleInput} value={bakPwd} name='bakPwd'/></div>
                <button onClick={()=>handleExportData(bakPwd)}>확인</button>
            </Modal>
            <div className={styles.settingRow} onClick={()=>setImportDataModal(true)}>데이터 가져오기</div>
            <Modal isOpen={importDataModal} setOpen={setImportDataModal} header='데이터 가져오기'>
                <input type='file' name='file' onChange={(e)=>setFile(e.target.files)}/>
                <div><input type='password' placeholder='복원 암호' name='restorePwd' value={restorePwd} onChange={handleInput}/></div>
                <button onClick={()=>handleImportData(restorePwd)}>확인</button>
            </Modal>
        </div>
    </SlideUp>
    </>
  );
};


export default App;
