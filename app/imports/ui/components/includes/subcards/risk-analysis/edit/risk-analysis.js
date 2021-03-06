import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Subcards_RiskAnalysis_Edit.viewmodel({
  mixin: 'riskScore',
  score: '',
  tableData() {
    return {
      xHeading: 'Probability',
      yHeading: 'Impacts',
      data: [
        {
          _id: 1,
          label: 'Catastrophic',
          rows: [45, 65, 91, 95, 100]
        },
        {
          _id: 2,
          label: 'Significant',
          rows: [35, 60, 75, 80, 85]
        },
        {
          _id: 3,
          label: 'Moderate',
          rows: [26, 51, 54, 59, 66]
        },
        {
          _id: 4,
          label: 'Minor',
          rows: [15, 26, 30, 36, 42]
        },
        {
          _id: 5,
          label: 'Limited',
          rows: [1, 8, 12, 16, 20]
        },
        {
          _id: 6,
          label: '',
          rows: ['V.Low', 'Low', 'Med', 'High', 'V.High'],
        }
      ]
    };
  },
  getScoreLabel() {
    const score = this.score() && this.score().value;
    return this.score() ? `<span>${this.getNameByScore(score)}</span> <span class="label impact-${this.getClassByScore(score)}">${score}</span>` : '';
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update({ ...args }, cb) {
    const _args = _.keys(args)
                    .map(key => ({ [`score.${key}`]: args[key] }) )
                    .reduce((prev, cur) => ({ ...prev, ...cur }));
    this.parent().update(_args, cb);
  },
  getData() {
    const { score } = this.data();
    return { score };
  }
});
