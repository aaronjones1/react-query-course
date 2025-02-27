import { Link } from 'react-router-dom';
import { GoIssueClosed, GoIssueOpened, GoComment } from 'react-icons/go';
import { relativeDate } from '../helpers/relativeDate';
import { useUserData } from '../helpers/useUserData';
import { Label } from './Label';
import { useQueryClient } from 'react-query';
import fetchWithError from '../helpers/fetchWithError';

export function IssueItem({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}) {
  const assigneeUser = useUserData(assignee);
  const createdByUser = useUserData(createdBy);
  const queryClient = useQueryClient();

  return (
    <li
      onMouseEnter={() => {
        queryClient.prefetchQuery(['issues', number.toString()], () =>
          fetchWithError(`/api/issues/${number}`)
        );
        queryClient.prefetchQuery(
          ['issues', number.toString(), 'comments'],
          () => fetch(`/api/issues/${number}/comments`)
        );
      }}
    >
      <div>
        {status === 'done' || status === 'cancelled' ? (
          <GoIssueClosed style={{ color: 'red' }} />
        ) : (
          <GoIssueOpened style={{ color: 'green' }} />
        )}
      </div>
      <div className='issue-content'>
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <Label key={label} label={label} />
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)}{' '}
          {createdByUser.isSuccess ? `by ${createdByUser.data.name}` : ''}
        </small>
      </div>
      {assignee ? (
        <img
          src={
            assigneeUser.isSuccess ? assigneeUser.data.profilePictureUrl : ''
          }
          className='assigned-to'
          alt={
            assigneeUser.isSuccess
              ? `Avatar for ${assigneeUser.data.name}`
              : 'Avatar for assignee'
          }
        />
      ) : null}
      <span className='comment-count'>
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
}
