export default {
  DataAccessor: class {
    fetchRows() {
      console.log("fetchRows in DataAccessor mock was called");
      return Promise.resolve([]);
    }
  },
};
