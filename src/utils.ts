import type { Thread } from './types';

const getCommentsDelta = (thread: Thread) =>
  typeof thread.commentsDelta === 'undefined'
    ? thread.comments || 1
    : thread.commentsDelta || 1;

const getViewsDelta = (thread: Thread) =>
  typeof thread.viewsDelta === 'undefined'
    ? thread.views || 1
    : thread.viewsDelta || 1;

/* Order threads by comments delta, fallback to views delta */
export const sortByComments = (arr: Thread[]): Thread[] => {
  return arr.sort((a, b) => {
    if (getCommentsDelta(a) === getCommentsDelta(b)) {
      return getViewsDelta(b) - getViewsDelta(a);
    } else {
      return getCommentsDelta(b) - getCommentsDelta(a);
    }
  });
};

/* Order threads by views delta, fallback to comments delta */
export const sortByViews = (arr: Thread[]): Thread[] => {
  return arr.sort((a, b) => {
    if (getViewsDelta(a) === getViewsDelta(b)) {
      return getCommentsDelta(b) - getCommentsDelta(a);
    } else {
      return getViewsDelta(b) - getViewsDelta(a);
    }
  });
};
