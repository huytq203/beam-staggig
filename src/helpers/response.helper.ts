export const ResponseHelpers = {
  CheckSucessResponse: (x: any) => {
    if (x?.data?.code == 200 && x?.data?.message == 'OK') {
      return true;
    }
    return false;
  },
};
