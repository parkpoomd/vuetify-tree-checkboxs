import Vue from "vue";
import VueRouter from "vue-router";
import TreeView1 from "../views/TreeView1.vue";
import TreeView2 from "../views/TreeView2.vue";
import TreeView3 from "../views/TreeView3.vue";
import TreeView4 from "../views/TreeView4.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "TreeView1",
    component: TreeView1,
  },
  {
    path: "/tree-view-2",
    name: "TreeView2",
    component: TreeView2,
  },
  {
    path: "/tree-view-3",
    name: "TreeView3",
    component: TreeView3,
  },
  {
    path: "/tree-view-4",
    name: "TreeView4",
    component: TreeView4,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
