import {DB} from './DB'
import BoxDB from 'bxd';
const Planner = DB.create('Planner', {
  id:{
    type: BoxDB.Types.NUMBER,
    key: true, 
    autoIncrement:true    
  },
  lectureID: {
    type: BoxDB.Types.NUMBER,
    index: true, 
  },
  subject:{
    type: BoxDB.Types.STRING,
  },
  name: {
    type: BoxDB.Types.STRING,
  },
  lectureNum: {
    type: BoxDB.Types.NUMBER,
  },
  date: {
    type: BoxDB.Types.DATE,
  },
  memo: {
    type: BoxDB.Types.STRING,
  },
  clear:{
     type: BoxDB.Types.BOOLEAN,
  }
});

export {Planner}