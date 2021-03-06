import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { ActionUndoTimeInHours } from '/imports/api/constants.js';


Template.Actions_VerifiedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  verifiedBy: '',
  verifiedAt: '',
  placeholder: 'Verified by',
  selectFirstIfNoSelected: false,
  currentTime: '',
  undoDeadline: '',
  onCreated() {
    this.interval = Meteor.setInterval(() => {
      this.currentTime(Date.now());
    }, 1000);
  },
  autorun() {
    const undoDeadline = new Date(this.verifiedAt().getTime());
    undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);
    this.undoDeadline(undoDeadline);
  },
  onDestroyed() {
    this.clearInterval();
  },
  clearInterval() {
    Meteor.clearInterval(this.interval);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:verifiedBy } = viewmodel.getData();

    this.verifiedBy(verifiedBy);

    this.parent().update && this.parent().update({ verifiedBy });
  },
  canBeUndone() {
    const currentTime = this.currentTime();
    const undoDeadline = this.undoDeadline();

    let isTimeLeftToUndo = false;
    if (_.isDate(undoDeadline) && _.isFinite(currentTime)) {
      isTimeLeftToUndo = currentTime < undoDeadline;
    }

    return isTimeLeftToUndo && (this.verifiedBy() === Meteor.userId());
  },
  passedFromVerified() {
    return moment(this.verifiedAt()).from(this.currentTime());
  },
  leftToUndo() {
    return moment(this.undoDeadline()).to(this.currentTime(), true);
  },
  getData() {
    return { verifiedBy: this.verifiedBy() };
  }
});
