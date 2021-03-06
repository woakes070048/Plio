import { Template } from 'meteor/templating';

import { insert } from '/imports/api/risks/methods.js';

Template.CreateRisk.viewmodel({
  mixin: ['modal', 'organization', 'router', 'collapsing'],
  save() {
    const data = this.getData();

    for (let key in data) {
      if (!data[key]) {
        const errorMessage = `The new risk cannot be created without a ${key}. Please enter a ${key} for your risk.`;
        this.modal().setError(errorMessage);
        return;
      }
    }

    this.insert(data);
  },
  insert({ ...args }) {
    const organizationId = this.organizationId();

    const allArgs = {
      ...args,
      organizationId
    };

    this.modal().callMethod(insert, allArgs, (err, _id) => {
      if (err) {
        return;
      }

      this.modal().close();

      Meteor.setTimeout(() => {
        this.goToRisk(_id, false);

        this.expandCollapsed(_id);

        this.modal().open({
          _id,
          _title: 'Risk',
          template: 'EditRisk'
        });
        }, 400);
    });
  },
  getData() {
    let data = {};

    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => data = { ...data, ...vm.getData() });

    return data;
  }
});
