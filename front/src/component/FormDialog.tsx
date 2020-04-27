import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import './FormDialog.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    boreder: `1px solid ${theme.palette.divider}`,
    flexWrap: 'wrap',
  },
}))

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    padding: theme.spacing(0, 1),
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup)

interface Props{
  submit : Function,

}
function FormDialog(props : Props) {
  const {submit} = props
  const [open, setOpen] = React.useState(true)
  const [gender, setGender] = React.useState(1) // 1 : 남 , 0 : 여
  const [like, setLike] = React.useState('')
  const [age, setAge] = React.useState(20)

  function handleSubmit() {
    setOpen(false)
    let list: HTMLElement | null = document.getElementById('menu_wrap')
    if (list !== null) list.style.visibility = 'visible'
    submit(gender, age, like)
  }
  const handleChange = (event : any) => {
    const name = event.target.name
    const value = event.target.value
    switch(name){
      case 'gender':
        setGender(value)
        break
      case 'age':
        setAge(value)
        break
      case 'like':
        setLike(value)
        break
    }
  }
  const classes = useStyles()
  return (
    <div>
      <Dialog  className="m-dialog" open={open} onClose={handleSubmit} aria-labelledby="form-dialog-title">
        <DialogTitle className="m-dialog-title" id="form-dialog-title">안녕하세요</DialogTitle>
        <DialogContent>
          <DialogContentText className="m-dialog-content">
            더 정확한 맛집 추천을 위해
            <br />
            다음 정보를 입력해주세요
          </DialogContentText>
          <div>
            <Paper elevation={0} className={classes.paper}>
              <StyledToggleButtonGroup size="small" value={gender} exclusive onChange={handleChange} aria-label="text alignment">
                <ToggleButton className="m-gender-btn" value={1} aria-label="man">
                  남자
                </ToggleButton>
                <ToggleButton className="m-gender-btn" value={0} aria-label="woman">
                  여자
                </ToggleButton>
              </StyledToggleButtonGroup>
            </Paper>
          </div>
          <TextField className="m-info-field" autoFocus margin="dense" name="age" label="나이" type="number" value={age} onChange={handleChange}/>
          <br />
          <TextField className="m-info-field" autoFocus margin="dense" name="like" label="좋아하는음식" type="text" value={like} onChange={handleChange}/>
        </DialogContent>
        <DialogActions className="m-margintop">
          <Button onClick={handleSubmit} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
export default FormDialog
