import Vue from "vue";
import VueRouter from "vue-router";
import TreeView1 from "../views/TreeView1.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "TreeView1",
    component: TreeView1,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
