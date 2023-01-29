import { formatDistanceToNow, parseISO } from "date-fns";
import { Note } from "../../models/Session";

const TimeStamp = ({ createdAt }:Note) => {
  let timeAgo = '';
  if(createdAt){
    const date = parseISO(createdAt.toString());
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;

  }
    return (
      <span className="post-time-ago" title={createdAt?.toString()}>
         <i>{timeAgo}</i>
      </span>
  )
}

export default TimeStamp