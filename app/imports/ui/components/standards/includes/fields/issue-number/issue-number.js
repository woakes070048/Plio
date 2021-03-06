import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.ESIssueNumber.viewmodel({
  mixin: 'callWithFocusCheck',
  issueNumber: 1,
  update(e) {
    if (!this._id) return;
    const { issueNumber } = this.getData();
    this.callWithFocusCheck(e, () => {
      this.parent().update({ issueNumber });
    });
  },
  getData() {
    const { issueNumber } = this.data();
    return { issueNumber: parseInt(issueNumber, 10) };
  }
});
