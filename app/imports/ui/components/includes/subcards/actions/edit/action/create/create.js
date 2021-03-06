import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';
import { insert } from '/imports/api/actions/methods.js';


Template.Actions_CreateSubcard.viewmodel({
  type: '',
  title: '',
  ownerId: Meteor.userId(),
  planInPlace: ActionPlanOptions.NO,
  completionTargetDate: new Date(),
  toBeCompletedBy: Meteor.userId(),
  verificationTargetDate: '',
  toBeVerifiedBy: '',
  linkedTo: [],
  isLinkedToEditable() {
    return !this.linkedTo().length;
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
