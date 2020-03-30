<template>
  <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10"
  >
    <v-container fill-height fluid grid-list-xl>
      <v-layout justify-center wrap mt-5>
        <v-flex xs12 md8>
          <card title="맛집 검색">
            <v-form>
              <v-container py-0>
                <v-layout wrap>
                  <v-flex xs12 md12>
                    <v-text-field v-model="storeName" label="음식점 이름" />
                  </v-flex>
                  <v-flex xs12 text-center>
                    <v-btn
                      large
                      class="indigo white--text ma-5"
                      rounded
                      color="blue lighten-1"
                      @click="onSubmit"
                    >GO!</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </card>
          <v-divider class="mx-4" />
        </v-flex>

        <v-flex xs12 md8>
          <v-flex v-for="store in stores" :key="store.id" pa-4>
            <store-list-card
              :id="store.id"
              :name="store.name"
              :categories="store.categories"
              :address="store.address"
              :tel="store.tel"
            />
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Card from "@/components/Card";
import StoreListCard from "@/components/StoreListCard";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Card,
    StoreListCard
  },
  data: () => ({
    storeName: "",
    loading: true
  }),
  computed: {
    ...mapState({
      stores: state => state.data.storeSearchList,
      page: state => state.data.storeSearchPage
    })
  },
  methods: {
    ...mapActions("data", ["getStores"]),
    onSubmit: async function() {
      const params = {
        name: this.storeName,
        page: 1,
        append: false
      };
      await this.getStores(params);
      this.loading = false;
    },
    loadMore: async function() {
      this.loading = true;
      const params = {
        name: this.storeName,
        page: this.page,
        append: true
      };
      await this.getStores(params);
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
};
</script>
