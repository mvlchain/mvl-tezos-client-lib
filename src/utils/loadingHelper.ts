import utilStore from './simpleUtilStore';

export const loadingFunction = <T>(originFunc: Function) => {
  return async (...args: any): Promise<T> => {
    try {
      utilStore.getState().startLoading();
      const result: T = await originFunc(...args);
      utilStore.getState().endLoading();
      return result;
    } catch (e) {
      utilStore.getState().endLoading();
      throw new Error(`error:  ${e}`);
    }
  };
};
