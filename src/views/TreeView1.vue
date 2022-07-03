<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <p>Employee {{ filterEmployeesSelected.length }}</p>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <div>
          <label class="d-inline-flex align-center pl-8 pb-2">
            <input
              type="checkbox"
              :checked="statusSelectedAllOrganization"
              @input="handleSelectedAllOrganization($event)"
            />
            <span class="ml-2">Select All</span>
          </label>
          <ul style="list-style: none">
            <tree-view-item-1
              v-for="organization in organizations"
              :key="organization.id"
              :node="organization"
              :handleSelected="handleSelectedOrganization"
            />
          </ul>
        </div>
      </v-col>

      <v-col cols="12" sm="4">
        <div>
          <label class="d-inline-flex align-center pl-6 pb-2">
            <input
              type="checkbox"
              :checked="statusSelectedAllEmployee"
              @input="handleSelectedAllEmployee($event)"
            />
            <span class="ml-2">Select All</span>
          </label>
          <ul class="pl-6" style="list-style: none">
            <li v-for="employee in employees" :key="employee.id">
              <label>
                <input
                  type="checkbox"
                  :checked="employee.checked"
                  @input="handleSelectedEmployee($event, employee)"
                />
                <span class="ml-2">
                  {{ employee.name }}
                </span>
              </label>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";
import TreeViewItem1 from "../components/TreeViewItem1.vue";

export default {
  name: "HomeView",

  components: { TreeViewItem1 },

  data() {
    return {
      statusSelectedAllOrganization: false,
      selectedOrganizations: [],
      organizations: [
        {
          id: "1",
          label: "Folder 1",
          checked: false,
          children: [
            {
              id: "1.1",
              label: "Folder 1.1",
              checked: false,
              children: [
                { id: "1.1.1", label: "Folder 1.1.1", checked: false },
              ],
            },
          ],
        },
        {
          id: "2",
          label: "Folder 2",
          checked: false,
          children: [
            {
              id: "2.1",
              label: "Folder 2.1",
              checked: false,
            },
            {
              id: "2.2",
              label: "Folder 2.2",
              checked: false,
            },
            {
              id: "2.3",
              label: "Folder 2.3",
              checked: false,
            },
          ],
        },
      ],
      employees: [
        { id: "1", name: "name 1", checked: false, nodeId: "1" },
        { id: "2", name: "name 1", checked: false, nodeId: "1" },
        { id: "3", name: "name 1.1", checked: false, nodeId: "1.1" },
        { id: "4", name: "name 1.1.1", checked: false, nodeId: "1.1.1" },
        { id: "5", name: "name 2", checked: false, nodeId: "2" },
        { id: "6", name: "name 2.1", checked: false, nodeId: "2.1" },
        { id: "7", name: "name 2.1", checked: false, nodeId: "2.1" },
        { id: "8", name: "name 2.2", checked: false, nodeId: "2.2" },
        { id: "9", name: "name 2.3", checked: false, nodeId: "2.3" },
        { id: "10", name: "name 2.3", checked: false, nodeId: "2.3" },
      ],
    };
  },

  computed: {
    statusSelectedAllEmployee() {
      return _.every(this.employees, ["checked", true]);
    },

    filterEmployeesSelected() {
      return this.employees.filter((employee) => employee.checked);
    },
  },

  methods: {
    handleSelectedAllOrganization(event) {
      const isChecked = event.target.checked;
      this.statusSelectedAllOrganization = isChecked;

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
      if (node.checked) {
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

    handleSelectedAllEmployee(event) {
      const isChecked = event.target.checked;

      this.employees = this.employees.map((employee) => ({
        ...employee,
        checked: isChecked,
      }));

      this.handleSelectedAllOrganization(event);
    },

    handleSelectedEmployee(event, employee) {
      const isChecked = event.target.checked;
      const { id } = employee;

      this.employees = this.employees.map((employee) => {
        if (employee.id === id) {
          return { ...employee, checked: isChecked };
        }
        return employee;
      });
    },
  },
};
</script>
