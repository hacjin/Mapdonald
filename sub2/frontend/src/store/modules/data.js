import api from "../../api";

// initial state
const state = {
  storeSearchList: [],
  storeSearchPage: "1",

  store: {
    id: "",
    name: "",
    branch: "",
    area: "",
    tel: "",
    address: "",
    lat: 0.0,
    lng: 0.0,
    categories: []
  }
};

// actions
const actions = {
  async getStores({ commit }, params) {
    const append = params.append;
    const resp = await api.getStores(params);
    const stores = resp.data.results.map(d => ({
      id: d.id,
      name: d.store_name,
      branch: d.branch,
      area: d.area,
      tel: d.tel,
      address: d.address,
      lat: d.latitude,
      lng: d.longitude,
      categories: d.category_list
    }));

    if (append) {
      commit("addStoreSearchList", stores);
    } else {
      commit("setStoreSearchList", stores);
    }
    commit("setStoreSearchPage", resp.data.next);
  }
};

// mutations
const mutations = {
  setStoreSearchList(state, stores) {
    state.storeSearchList = stores.map(s => s);
  },
  addStoreSearchList(state, stores) {
    state.storeSearchList = state.storeSearchList.concat(stores);
  },
  setStoreSearchPage(state, url) {
    state.storeSearchPage = new URL(url).searchParams.get("page");
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
