import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SexToggleBtn from './SexToggleBtn';

export default function FormDialog(props : any) {
  const [open, setOpen] = React.useState(true);
  const [sex, setSex] = React.useState(0);
  const [age, setAge] = React.useState(20);

  function handleSubmit(){
    setOpen(false)
    // data 들 보내기.
    console.log('sex : ' + sex);
    console.log('age : ' + age);
  }

  const handleChange = (event : any) =>{
    const id = event.currentTarget.id;
    const value  : any = event.currentTarget.value;
    if(id === "age"){
      console.log('age change');
      setAge(value);
    }
  }
  
  return (
    <div>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">사용자 정보 입력</DialogTitle>
        <DialogContent>
          <DialogContentText>
            당신에 대해 알려주세요 ! 당신이 원하는 음식점을 가르쳐드릴게요 !
          </DialogContentText>
          <SexToggleBtn sex={sex} setSex={setSex}/>
          <TextField
            autoFocus
            margin="dense"
            id="age"
            label="연령대"
            type="number"
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
