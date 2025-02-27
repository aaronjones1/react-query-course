import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { IssueHeader } from './IssueHeader';
import { useUserData } from '../helpers/useUserData';
import { relativeDate } from '../helpers/relativeDate';

function useIssueData(issueNumber) {
  return useQuery(['issues', issueNumber], ({ signal }) => {
    return fetch(`/api/issues/${issueNumber}`, { signal }).then((res) =>
      res.json()
    );
  });
}

function useIssueComments(issueNumber) {
  return useQuery(['issues', issueNumber, 'comments'], ({ signal }) => {
    return fetch(`/api/issues/${issueNumber}/comments`, { signal }).then(
      (res) => res.json()
    );
  });
}

function Comment({ comment, createdBy, createdDate }) {
  const userQuery = useUserData(createdBy);

  if (userQuery.isLoading)
    return (
      <div className='comment'>
        <div>
          <div className='comment-header'>Loading comment...</div>
        </div>
      </div>
    );

  return (
    <div className='comment'>
      <img src={userQuery.data.profilePictureUrl} alt='Commenter avatar' />
      <div>
        <div className='comment-header'>
          <span>{userQuery.data.name}</span> commented{' '}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className='comment-body'>{comment}</div>
      </div>
    </div>
  );
}

export default function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueData(number);
  const commentsQuery = useIssueComments(number);

  return (
    <div className='issue-details'>
      {issueQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <IssueHeader {...issueQuery.data} />
          <main>
            <section>
              {commentsQuery.isLoading ? (
                <p>Loading comments...</p>
              ) : (
                commentsQuery.data?.map((comment) => (
                  <Comment key={comment.id} {...comment} />
                ))
              )}
            </section>
            <aside></aside>
          </main>
        </>
      )}
    </div>
  );
}
