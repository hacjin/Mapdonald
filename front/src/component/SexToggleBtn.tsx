import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles((theme) => ({
  toggleContainer: {
    margin: theme.spacing(2, 0),
  },
}));

interface Props {
  sex : number,
  setSex : Function,
}

export default function SexToggleBtn(props : Props) {
  const {sex, setSex} = props
  // default : 0 , 남자 : 1 , 여자 : 2

  const handleSex = (event : any, sex : number) => {
    setSex(sex);
  };

  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item sm={12} md={6}>
        <div className={classes.toggleContainer}>
          <ToggleButtonGroup
            value={sex}
            exclusive
            onChange={handleSex}
            aria-label="text alignment"
          >
            <ToggleButton value={1}>
              남자
            </ToggleButton>
            <ToggleButton value={2}>
              여자
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Grid>
    </Grid>
  );
}