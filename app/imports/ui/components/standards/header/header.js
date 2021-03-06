import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  share: ['standard', 'window', 'search'],
  mixin: ['standard', 'collapsing', 'organization', 'mobile'],
  standardFilters() {
    return StandardFilters;
  },
  selectFilter(filter) {
    this.searchText('');
    FlowRouter.setQueryParams({ by: filter });
    this.expandCollapsed(this.standardId());
  }
});
