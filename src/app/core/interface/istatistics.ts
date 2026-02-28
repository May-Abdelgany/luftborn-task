export interface Istatistics {
  statistics: Statistic[];
  lastUpdated: string;
}

export interface Statistic {
  id: string;
  title: string;
  icon: string;
  value: number;
  change: string;
  changeLabel: string;
  changeType: string;
  color: string;
}
