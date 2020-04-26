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
import './Main_dialog.css'

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

function FormDialog() {
  const [open, setOpen] = React.useState(true)
  const [alignment, setAlignment] = React.useState('')

  const handleClose = () => {
    setOpen(false)
    let list: HTMLElement | null = document.getElementById('menu_wrap')
    if (list !== null) list.style.visibility = 'visible'
  }
  const handleAlignment = (event: any, newAlignment: any) => {
    setAlignment(newAlignment)
  }
  const classes = useStyles()
  return (
    <div>
      <Dialog  className="m-dialog" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className="m-dialog-title" id="form-dialog-title">안녕하세요</DialogTitle>
        <DialogContent>
          <DialogContentText className="m-dialog-content">
            더 정확한 맛집 추천을 위해
            <br />
            다음 정보를 입력해주세요
          </DialogContentText>
          <div>
            <Paper elevation={0} className={classes.paper}>
              <StyledToggleButtonGroup size="small" value={alignment} exclusive onChange={handleAlignment} aria-label="text alignment">
                <ToggleButton className="m-gender-btn" value="man" aria-label="man">
                  남자
                </ToggleButton>
                <ToggleButton className="m-gender-btn" value="woman" aria-label="woman">
                  여자
                </ToggleButton>
              </StyledToggleButtonGroup>
            </Paper>
          </div>
          <TextField className="m-info-field" autoFocus margin="dense" id="age" label="나이" type="number" />
          <br />
          <TextField className="m-info-field" autoFocus margin="dense" id="like" label="좋아하는음식" type="text" />
        </DialogContent>
        <DialogActions className="m-margintop">
          <Button onClick={handleClose} color="primary">
            취소
          </Button>
          <Button onClick={handleClose} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
export default FormDialog
