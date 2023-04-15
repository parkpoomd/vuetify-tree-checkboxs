<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <p>Organizations {{ selectedOrganizations.length }}</p>
      </v-col>
      <v-col cols="12" sm="4">
        <p>Employees {{ filterEmployeesSelected.length }}</p>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <div>
          <v-checkbox
            label="Select All"
            :input-value="statusSelectedAllEmployee === 'all'"
            :indeterminate="statusSelectedAllEmployee === 'indeterminate'"
            @change="handleSelectedAllOrganization($event)"
          ></v-checkbox>
          <ul
            class="pl-0"
            style="list-style: none; height: 380px; overflow: auto"
          >
            <DynamicScroller :items="organizations" :min-item-size="54">
              <template v-slot="{ item, index, active }">
                <tree-view-item-4
                  key-field="organization_uuid"
                  :node="item"
                  :active="active"
                  :index="index"
                  :handleSelected="handleSelectedOrganization"
                />
              </template>
            </DynamicScroller>
            <!-- <tree-view-item-4
              v-for="organization in organizations"
              :key="organization.organization_uuid"
              :node="organization"
              :handleSelected="handleSelectedOrganization"
            /> -->
          </ul>
        </div>
      </v-col>

      <v-col cols="12" sm="4">
        <div>
          <v-checkbox
            label="Select All"
            :input-value="statusSelectedAllEmployee === 'all'"
            :indeterminate="statusSelectedAllEmployee === 'indeterminate'"
            @change="handleSelectedAllEmployee($event)"
          ></v-checkbox>
          <RecycleScroller
            style="height: 380px"
            :items="employees"
            :item-size="36"
            key-field="employee_uuid"
            v-slot="{ item }"
          >
            <ul class="pl-0" style="list-style: none">
              <v-checkbox
                class="mt-2"
                :label="`${item.firstname_th} ${item.lastname_th}`"
                :input-value="item.checked"
                @change="handleSelectedEmployee($event, item)"
                hide-details
              ></v-checkbox>
            </ul>
          </RecycleScroller>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";

import { RecycleScroller, DynamicScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import TreeViewItem4 from "../components/TreeViewItem4.vue";

import {
  employees as employeesData,
  organizations as organizationsData,
} from "../data";

export default {
  name: "TreeView4",

  components: { RecycleScroller, DynamicScroller, TreeViewItem4 },

  data() {
    return {
      statusSelectedAllOrganization: false,
      selectedOrganizations: [],
      organizations: [],
      employees: [],
    };
  },

  created() {
    this.organizations = organizationsData.map((organization) => ({
      ...organization,
      checked: false,
    }));

    this.employees = employeesData.map((employee) => ({
      ...employee,
      checked: false,
    }));
  },

  computed: {
    statusSelectedAllEmployee() {
      if (_.every(this.employees, ["checked", true])) {
        return "all";
      } else if (_.some(this.employees, ["checked", true])) {
        return "indeterminate";
      } else {
        return "blank";
      }
    },

    filterEmployeesSelected() {
      return this.employees.filter((employee) => employee.checked);
    },
  },

  methods: {
    handleSelectedAllOrganization(checked) {
      const statusChecked = checked ? "checked" : "blank";
      this.statusSelectedAllOrganization = statusChecked;

      this.organizations.forEach((organization) => {
        const node = this.setAllCheckOrganizationRecursive(organization);
        this.handleSelectedOrganization(node);
      });
    },

    handleSelectedOrganization(node) {
      this.setOrganizationCheckRecursive(node);

      this.employees = this.employees.map((employee) => {
        if (this.selectedOrganizations.includes(employee.nodeId)) {
          return { ...employee, checked: true };
        }
        return { ...employee, checked: false };
      });
    },

    setOrganizationCheckRecursive(node) {
      if (node.checked === "checked") {
        const index = this.selectedOrganizations.findIndex(
          (id) => id === node.id
        );
        if (index === -1) {
          this.selectedOrganizations = [...this.selectedOrganizations, node.id];
        }
      } else {
        this.selectedOrganizations = this.selectedOrganizations.filter(
          (id) => id !== node.id
        );
      }

      if (node.children && node.children.length) {
        node.children.forEach((children) => {
          this.setOrganizationCheckRecursive(children);
        });
      }
    },

    setAllCheckOrganizationRecursive(node) {
      node.checked = this.statusSelectedAllOrganization;

      if (node.children && node.children.length) {
        node.children.forEach((children) => {
          this.setAllCheckOrganizationRecursive(children);
        });
      }
      return node;
    },

    handleSelectedAllEmployee(checked) {
      this.employees = this.employees.map((employee) => ({
        ...employee,
        checked,
      }));

      // this.handleSelectedAllOrganization(checked);
    },

    handleSelectedEmployee(event, employee) {
      const isChecked = event;
      const { id } = employee;

      this.employees = this.employees.map((employee) => {
        if (employee.id === id) {
          return { ...employee, checked: isChecked };
        }
        return employee;
      });

      const isOrgChecked = _.every(
        this.employees.filter((emp) => emp.nodeId === employee.nodeId),
        ["checked", isChecked]
      );

      let statusChecked = "";
      if (isChecked && isOrgChecked) {
        statusChecked = "checked";
      } else if (isChecked && !isOrgChecked) {
        statusChecked = "indeterminate";
      } else if (!isChecked && !isOrgChecked) {
        statusChecked = "indeterminate";
      } else {
        statusChecked = "blank";
      }

      this.organizations.forEach((org) => {
        this.setOrganizationEmployeeRecursive(
          org,
          employee.nodeId,
          statusChecked
        );
      });
    },

    setOrganizationEmployeeRecursive(node, id, statusChecked) {
      if (node.id === id) {
        node.checked = statusChecked;
      }
      if (node.children && node.children.length) {
        node.children.forEach((children) => {
          this.setOrganizationEmployeeRecursive(children, id, statusChecked);
        });
      }
    },
  },
};
</script>
