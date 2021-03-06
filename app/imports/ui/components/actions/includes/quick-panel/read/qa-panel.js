import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Actions_QAPanel_Read.viewmodel({
  mixin: ['action', 'user', 'date', 'utils', 'modal'],
  document: '',
  showQAPanel({ isVerified, isCompleted, toBeCompletedBy, toBeVerifiedBy }) {
    return !isVerified && this.chooseOne(isCompleted)(toBeVerifiedBy, toBeCompletedBy) === Meteor.userId();
  },
  getActionButtonText({ isCompleted }) {
    return this.chooseOne(isCompleted)('Verify', 'Complete');
  },
  getActionDescription({ type, isCompleted, toBeCompletedBy, toBeVerifiedBy, completionTargetDate, verificationTargetDate }) {
    const chooseOne = this.chooseOne(isCompleted);
    const completedOrVerified = chooseOne('verified', 'completed');
    const assignee = chooseOne(toBeVerifiedBy, toBeCompletedBy);
    const targetDate = chooseOne(verificationTargetDate, completionTargetDate);
    return `
      ${this._getNameByType(type)} to be ${completedOrVerified} by ${this.userFullNameOrEmail(assignee)} by ${this.renderDate(targetDate)}
    `;
  },
  openQAModal({ _id, isCompleted }) {
    const _title = this.getActionButtonText({ isCompleted });
    const content = `${this.templateName().replace('Read', 'Edit')}_${_title}`; // Example: Actions_QAPanel_Edit_Verify
    this.modal().open({
      _id,
      _title,
      content,
      closeCaption: 'Cancel',
      guideHtml: 'Enter any verification comments below, then click either "Verified as effective" or "Assessed as ineffective"',
      template: 'Actions_QAPanel_Edit'
    });
  }
});
