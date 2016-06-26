import { Template } from 'meteor/templating';


Template.Actions_VerificationTargetDate.viewmodel({
  verificationTargetDate: '',
  startDate: new Date(),
  defaultDate: false,
  placeholder: 'Verification - target date',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date } = viewmodel.getData();

    if (date === this.templateInstance.data.verificationTargetDate) {
      return;
    }

    this.completionTargetDate(date);

    this.parent().update({ verificationTargetDate: date });
  },
  getData() {
    return { verificationTargetDate: this.verificationTargetDate() };
  }
});
