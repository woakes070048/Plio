import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';
import { insert } from '/imports/api/actions/methods.js';


Template.Actions_Create.viewmodel({
  mixin: ['modal', 'action', 'organization', 'router', 'collapsing'],
  type: '',
  title: '',
  ownerId: Meteor.userId(),
  planInPlace: ActionPlanOptions.NO,
  completionTargetDate: new Date(),
  toBeCompletedBy: Meteor.userId(),
  verificationTargetDate: '',
  toBeVerifiedBy: '',
  save() {
    const data = this.getData();

    for (let key in data) {
      if (!data[key]) {
        const errorMessage = `The new action cannot be created without a ${key}. Please enter a ${key} for your action.`;
        this.modal().setError(errorMessage);
        return;
      }
    }

    this.insert(data);
  },
  insert({ ...args }) {
    const organizationId = this.organizationId();
    const { type } = this.data();

    const allArgs = {
      type,
      organizationId,
      ...args
    };

    this.modal().callMethod(insert, allArgs, (err, _id) => {
      if (err) {
        return;
      } else {
        this.modal().close();

        Meteor.setTimeout(() => {
          const action = this._getActionByQuery({ _id });
          this.goToAction(_id, false);

          this.expandCollapsed(_id);

          this.modal().open({
            _id,
            _title: action ? this._getNameByType(action.type) : '',
            template: 'Actions_Edit'
          });
        }, 400);
      }
    });
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
