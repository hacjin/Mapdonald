import React from 'react';
import Review from '../interface/Review'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';



interface Props{
  review : Review
}
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});
export default function ReviewCard(props : Props){
  const classes = useStyles();
  const {review} = props
  const star: String = '★'
  return(
    <div>
      <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {star.repeat(review.score)}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {review.reg_time}
        </Typography>
        <Typography variant="body2" component="p">
          {review.content}
        </Typography>
      </CardContent>
    </Card>
    </div>
  )
}