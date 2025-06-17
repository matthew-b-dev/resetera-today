import { useEffect, useState } from 'react';
import './App.css';

import axios from 'axios';
import type { Snapshot } from './types';
import { sortByComments, sortByViews } from './utils';
import Rows from './Rows';
import ReactPaginate from 'react-paginate';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');
const LATEST_SNAPSHOTS_GIST_ID = 'f7f1ca0942dabb6d928bd20d9a07b482';
const FILE_NAME = 'data.json';
const ITEMS_PER_PAGE = 10;

const App = () => {
  const [getSnapshotResponse, setGetSnapshotResponse] = useState<{
    loading: boolean;
    data: Snapshot | null;
  }>({
    loading: false,
    data: null,
  });

  const [threadSort, setThreadSort] = useState<'comments' | 'views'>(
    'comments'
  );

  useEffect(() => {
    setGetSnapshotResponse({
      loading: true,
      data: null,
    });
    axios
      .get(`https://api.github.com/gists/${LATEST_SNAPSHOTS_GIST_ID}`)
      .then((response) => {
        const gistData = response.data;
        const snapshot = JSON.parse(gistData.files[FILE_NAME].content);
        setGetSnapshotResponse({
          loading: false,
          data: { ...snapshot, threads: sortByComments(snapshot.threads) },
        });
      });
  }, []);

  useEffect(() => {
    if (getSnapshotResponse.data) {
      setGetSnapshotResponse({
        loading: false,
        data: {
          timestamp: getSnapshotResponse.data.timestamp,
          threads:
            threadSort === 'comments'
              ? sortByComments(getSnapshotResponse.data.threads)
              : sortByViews(getSnapshotResponse.data.threads),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadSort]);

  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + ITEMS_PER_PAGE;

  if (getSnapshotResponse?.data?.threads) {
    const responseThreads = getSnapshotResponse?.data?.threads;
    const currentThreadsPage = getSnapshotResponse.data.threads.slice(
      itemOffset,
      endOffset
    );
    const pageCount = Math.ceil(responseThreads.length / ITEMS_PER_PAGE);
    const handlePageClick = (event: { selected: number }) => {
      const newOffset = (event.selected * 10) % responseThreads.length;
      setItemOffset(newOffset);
    };

    return (
      <>
        <div className="flex flex-col items-center justify-center">
          <div className="">
            <h1 className="mb-4 text-3xl text-center font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl text-white">
              resetera
              <span className="text-gray-400">.</span>today
            </h1>
            <p className="mb-6 text-sm md:text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-400">
              24-hour statistics for Gaming Forum threads
            </p>
          </div>

          <div className="overflow-x-auto w-full min-w-[250px] max-w-[850px] testtest">
            <div className="w-full flex justify-between mb-2">
              <div
                className="text-sm mt-3 underline decoration-dashed hidden sm:block pl-2"
                title="Updated hourly"
              >
                Last updated{' '}
                <span>
                  {timeAgo.format(
                    new Date(getSnapshotResponse?.data.timestamp)
                  )}
                </span>
              </div>
              <form className="max-w-sm">
                <div className="flex">
                  <label
                    htmlFor="order-by"
                    className="block mb-2 text-sm font-medium text-white whitespace-nowrap mt-2 mr-2 pl-2"
                  >
                    Order by
                  </label>
                  <select
                    id="order-by"
                    className="border text-sm rounded-lg focus:ring-blue-500 block w-full px-2 py-1 bg-gray-700 border-gray-600 placeholder-gray-400 text-white ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                      setThreadSort(e.target.value as 'comments' | 'views')
                    }
                  >
                    <option
                      value="comments"
                      selected={threadSort === 'comments'}
                    >
                      Comments
                    </option>
                    <option value="views">Views</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="table-wrapper">
              <table className="table-fixed text-sm w-full text-left rtl:text-right text-gray-400">
                <thead className="text-xs bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Thread
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 whitespace-nowrap w-[100px] underline decoration-dashed"
                      title="Views and Comments gained in the last 24 hours"
                    >
                      24hr Stats
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <Rows threads={currentThreadsPage} />
                </tbody>
              </table>
            </div>
            <div className="flex justify-between pl-2">
              <div className="flex">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="NEXT"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  previousLabel="PREV"
                  renderOnZeroPageCount={null}
                  className="pagination-controls mt-4"
                  pageClassName="page-item-none"
                  breakClassName="page-item-none"
                  previousLinkClassName="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold md:py-2 md:px-4 py-1 px-2 rounded-l"
                  nextLinkClassName="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold md:py-2 md:px-4 py-1 px-2 rounded-r"
                />
                <div className="mt-3 ml-3 hidden sm:block">
                  <span className="text-sm">Showing {itemOffset + 1} to </span>
                  {endOffset < responseThreads.length
                    ? endOffset
                    : responseThreads.length}{' '}
                  of {responseThreads.length}
                </div>
              </div>
              <div className="mt-3 text-sm">
                <a
                  href="https://github.com/matthew-b-dev/resetera-today"
                  target="_blank"
                  rel="nofollow"
                  className="hover:underline hover:text-gray-300 underline pr-2"
                >
                  Github: matthew-blair-dev
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <div></div>;
  }
};

export default App;
