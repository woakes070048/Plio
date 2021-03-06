import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


Template.Actions_ToBeCompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeCompletedBy: '',
  placeholder: 'To be completed by',
  selectFirstIfNoSelected: false,
  canCompletionFormBeShown: false,
  completionComments: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected } = viewmodel.getData();

    this.toBeCompletedBy(selected);

    this.parent().update && this.parent().update({ toBeCompletedBy: selected });
  },
  canBeCompleted() {
    return !!this.onComplete && (this.toBeCompletedBy() === Meteor.userId());
  },
  isCompleteButtonVisible() {
    return this.canBeCompleted();
  },
  isCompletionFormVisible() {
    return this.canBeCompleted() && this.canCompletionFormBeShown();
  },
  showCompletionForm() {
    this.canCompletionFormBeShown(true);
  },
  hideCompletionForm() {
    this.canCompletionFormBeShown(false);
  },
  complete() {
    this.onComplete && this.onComplete({
      completionComments: this.completionComments()
    });
  },
  getData() {
    return { toBeCompletedBy: this.toBeCompletedBy() };
  }
});
