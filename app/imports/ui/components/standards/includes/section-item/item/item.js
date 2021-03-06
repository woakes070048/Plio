import { Template } from 'meteor/templating';

import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { updateViewedBy } from '/imports/api/standards/methods.js';

Template.Standards_Item_Read.viewmodel({
  share: ['standard', 'window'],
  mixin: ['organization', 'standard', 'user', 'date'],
  title: '',
  sectionId: '',
  typeId: '',
  owner: '',
  issueNumber: '',
  status: 'issued',
  nestingLevel: 1,
  viewedBy: [],
  notify: '',
  autorun() {
    if (this._id() === this.standardId() && this.isNew()) {
      Tracker.nonreactive(() => this.updateViewedBy());
    }
  },
  standardType() {
    const typeId = this.typeId && this.typeId();
    return StandardTypes.findOne({ _id: typeId });
  },
  typeName() {
    return this.standardType() && this.standardType().name;
  },
  isNew() {
    return this.viewedBy && !_.contains(this.viewedBy(), Meteor.userId());
  },
  select() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ standardId: this._id() });
  },
  updateViewedBy() {
    const _id = this._id();

    updateViewedBy.call({ _id });
  }
});
