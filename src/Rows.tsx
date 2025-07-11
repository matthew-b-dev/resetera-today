import type { Thread } from './types';
import commentIcon from './assets/comment_icon.svg';
import eyeIcon from './assets/eye_icon.svg';

const Rows = ({ threads }: { threads: Thread[] }) => {
  const unknownViewsText = (
    <span
      title="Views have not yet been calculated"
      className="underline decoration-dashed"
    >
      +?
    </span>
  );
  return threads.map((thread, _) => (
    <tr key={_} className="border-b bg-gray-800 border-gray-700">
      <th scope="row" className="px-6 py-1 font-medium text-white">
        <a
          href={thread.url}
          target="_blank"
          rel="nofollow"
          className="hover:underline hover:text-gray-300"
        >
          {thread.title}
        </a>
      </th>
      <td className="px-6 py-2">
        <div className="flex">
          <img
            src={eyeIcon}
            className="h-[12px] mt-[5px] mr-1"
            alt="views icon"
          />
          <div className="mr-2">
            {thread.viewsDelta ? `+${thread.viewsDelta}` : unknownViewsText}
          </div>
        </div>
        <div className="flex">
          <img
            src={commentIcon}
            className="h-[12px] mt-[5px] mr-1"
            alt="comment icon"
          />
          <div className="">+{thread.commentsDelta || 1}</div>
        </div>
      </td>
    </tr>
  ));
};

export default Rows;
