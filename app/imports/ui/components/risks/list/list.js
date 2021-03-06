import { Template } from 'meteor/templating';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ProblemsStatuses } from '/imports/api/constants.js';

Template.RisksList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapse', 'organization', 'modal', 'risk', 'problemsStatus', 'collapsing', 'router'],
  autorun() {
    if (!this.focused() && !this.animating() && !this.searchText()) {
      const query = this._getQueryForFilter();

      const contains = this._getRiskByQuery({ ...query, _id: this.riskId() });
      if (!contains) {
        const risk = this._getRiskByQuery({ ...query, ...this._getFirstRiskQueryForFilter() });

        if (risk) {
          const { _id } = risk;
          Meteor.setTimeout(() => {
            this.goToRisk(_id);
            this.expandCollapsed(this.riskId());
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            this.goToRisks();
          }, 0)
        }
      }
    }
  },
  onCreated() {
    this.searchText('');
  },
  onRendered() {
    this.expandCollapsed(this.riskId());
  },
  _getQueryForFilter() {
    switch(this.activeRiskFilter()) {
      case 'type':
        return { typeId: { $in: this.types().map(({ _id }) => _id) } };
        break;
      case 'status':
        return { status: { $in: this.statuses() } };
        break;
      case 'department':
        return { departments: { $in: this.departments().map(({ _id }) => _id) } };
        break;
      default:
        return {};
        break;
    };
  },
  _getFirstRiskQueryForFilter() {
    switch(this.activeRiskFilter()) {
      case 'type':
        return { typeId: this.types().length > 0 && this.types()[0]._id };
        break;
      case 'status':
        return { status: this.statuses().length > 0 && this.statuses()[0] };
        break;
      case 'department':
        return { departments: this.departments().length > 0 && this.departments().map(({ _id }) => _id)[0] };
        break;
      case 'deleted':
        return { _id: this.risksDeleted().count() > 0 && this.risksDeleted().fetch()[0]._id };
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
    return this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]);
  },
  _getTypeQuery({ _id:typeId }) {
    return { typeId };
  },
  types() {
    const organizationId = this.organizationId();
    const query = { organizationId };
    const options = { sort: { title: 1 } };
    return RiskTypes.find(query, options).fetch().filter(({ _id:typeId }) => {
      return this._getRisksByQuery({ typeId, ...this._getSearchQuery() }).count() > 0;
    });
  },
  _getStatusQuery(status) {
    return { status };
  },
  statuses() {
    return _.keys(ProblemsStatuses)
            .map(status => parseInt(status, 10))
            .filter(status => this._getRisksByQuery({ status, ...this._getSearchQuery() }).count() > 0);
  },
  _getDepartmentQuery({ _id:departments }) {
    return { departments };
  },
  departments() {
    const query = { organizationId: this.organizationId() };
    const options = { sort: { name: 1 } };
    return Departments.find(query, options).fetch().filter(({ _id:departments }) => {
      return this._getRisksByQuery({ departments, ...this._getSearchQuery() }).count() > 0;
    });
  },
  risksDeleted() {
    const query = { ...this._getSearchQuery() };
    const options = { sort: { deletedAt: -1 } };
    return this._getRisksByQuery(query, options);
  },
  focused: false,
  animating: false,
  expandAllFound() {
    const ids = _.flatten(ViewModel.find('RiskSectionItem').map(vm => vm.risks && vm.risks().fetch().map(item => item._id)));

    const vms = ViewModel.find('ListItem', (viewmodel) => {
      return !!viewmodel.collapsed() && this.findRecursive(viewmodel, ids);
    });

    this.searchResultsNumber(ids.length);

    if (vms.length > 0) {
      this.animating(true);

      this.expandCollapseItems(vms, {
        expandNotExpandable: true,
        complete: () => this.onAfterExpand()
      });
    }
  },
  expandSelected() {
    const vms = ViewModel.find('ListItem', vm => !vm.collapsed() && !this.findRecursive(vm, this.riskId()));

    this.animating(true);

    if (vms.length > 0) {
      this.expandCollapseItems(vms, {
        expandNotExpandable: true,
        complete: () => this.expandSelectedRisk()
      });
    } else {
      this.expandSelectedRisk();
    }
  },
  expandSelectedRisk() {
    this.expandCollapsed(this.riskId(), () => {
      this.onAfterExpand();
    });
  },
  onAfterExpand() {
    this.animating(false);
    Meteor.setTimeout(() => this.focused(true), 500);
  },
  openAddRiskModal() {
    this.modal().open({
      _title: 'Risk',
      template: 'CreateRisk',
      variation: 'save'
    });
  }
});
