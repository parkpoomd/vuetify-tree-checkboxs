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
          <v-checkbox
            label="Select All"
            :input-value="statusSelectedAllEmployee === 'all'"
            :indeterminate="statusSelectedAllEmployee === 'indeterminate'"
            @change="handleSelectedAllOrganization($event)"
          ></v-checkbox>
          <ul class="pl-0" style="list-style: none">
            <tree-view-item-2
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
          <v-checkbox
            label="Select All"
            :input-value="statusSelectedAllEmployee === 'all'"
            :indeterminate="statusSelectedAllEmployee === 'indeterminate'"
            @change="handleSelectedAllEmployee($event)"
          ></v-checkbox>
          <ul class="pl-0" style="list-style: none">
            <li v-for="employee in employees" :key="employee.id">
              <v-checkbox
                class="mt-2"
                :label="employee.name"
                :input-value="employee.checked"
                @change="handleSelectedEmployee($event, employee)"
                hide-details
              ></v-checkbox>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";
import TreeViewItem2 from "../components/TreeViewItem2.vue";

export default {
  name: "TreeView2",

  components: { TreeViewItem2 },

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
      this.statusSelectedAllOrganization = checked;

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

    handleSelectedAllEmployee(checked) {
      this.employees = this.employees.map((employee) => ({
        ...employee,
        checked,
      }));

      this.handleSelectedAllOrganization(checked);
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

      if (isOrgChecked) {
        this.organizations.forEach((org) => {
          this.setOrganizationEmployeeRecursive(
            org,
            employee.nodeId,
            isChecked
          );
        });
      }
    },

    setOrganizationEmployeeRecursive(node, id, isChecked) {
      if (node.id === id) {
        node.checked = isChecked;
      }
      if (node.children && node.children.length) {
        node.children.forEach((children) => {
          this.setOrganizationEmployeeRecursive(children, id, isChecked);
        });
      }
    },
  },
};
</script>
