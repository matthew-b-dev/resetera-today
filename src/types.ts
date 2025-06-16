export type Thread = {
  id: number;
  title: string;
  views?: number;
  comments?: number;
  url?: string;
  viewsDelta?: number;
  commentsDelta?: number;
};

export type Snapshot = {
  threads: Thread[];
  timestamp: string;
};
