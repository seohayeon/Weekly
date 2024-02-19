import BoxDB from 'bxd';
import {DB} from './DB'

const LectureList = DB.create('lectureList', {
  id: {
    type: BoxDB.Types.NUMBER,
    key: true, 
    autoIncrement:true
  },
  subject: {
    type: BoxDB.Types.STRING,
    index: true, 
  },
  name: {
    type: BoxDB.Types.STRING,
    index: true, 
  },
  teacher: {
    type: BoxDB.Types.STRING,
    index: true, 
  },
  totalLecture: {
    type: BoxDB.Types.NUMBER,
  },
  progress: {
    type: BoxDB.Types.ARRAY,
    default:[]
  }
});

export {LectureList}