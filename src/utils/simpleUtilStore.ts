import { IUtil, IUtilState } from "./utilStore.type";

// DO MAKE YOUR OWN STORE IMPLEMENTATION
const simpleUtilStore: IUtil = {
  getState(): IUtil {
    return this;
  },
  isLoadingCnt: 0,
  endLoading(): void {
    this.isLoadingCnt = this.isLoadingCnt - 1 > 0 ? this.isLoadingCnt - 1 : 0;
  },
  startLoading(): void {
    this.isLoadingCnt = this.isLoadingCnt + 1;
  },
  isShowLoading: false,
  turnOffGlobalLoading(): () => void {
    this.isShowLoading = false;
    return () => {
      this.isShowLoading = true;
    };
  },
};
export default simpleUtilStore;
