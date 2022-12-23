export interface IUtil extends IUtilState {
  startLoading: () => void;
  endLoading: () => void;
  turnOffGlobalLoading: () => () => void;
  getState: () => IUtil;
}

export interface IUtilState {
  isLoadingCnt: number;
  isShowLoading: boolean;
}
