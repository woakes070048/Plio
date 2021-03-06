import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import pluralize from 'pluralize';

Template.DashboardPage.viewmodel({
  mixin: ['organization', { 'counter': 'counter' }],
  autorun: [
    function() {
      const template = this.templateInstance;
      const organizationId = this.organizationId();
      this._subHandlers([
        template.subscribe('standardsCount', 'standards-count', organizationId),
        template.subscribe('standardsNotViewedCount', 'standards-not-viewed-count', organizationId),
        template.subscribe('organizationUsers', this.organization().users.map(({ _id }) => _id)),
        template.subscribe('nonConformitiesCount', 'non-conformities-count', organizationId),
        template.subscribe('nonConformitiesNotViewedCount', 'non-conformities-not-viewed-count', organizationId),
        template.subscribe('risksCount', 'risks-count', organizationId),
        template.subscribe('risksNotViewedCount', 'risks-not-viewed-count', organizationId),
        template.subscribe('actionsCount', 'actions-count', organizationId),
        template.subscribe('actionsNotViewedCount', 'actions-not-viewed-count', organizationId),
        template.subscribe('myCurrentFailedActions', 'actions-failed-count', organizationId)
      ]);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  isReady: false,
  _subHandlers: [],
  _renderMetrics(pluralizeWord = '', totalCounterName = '', notViewedCounterName = '') {

    // Workaround for https://github.com/blakeembrey/pluralize/pull/12
    const lowerCaseLastSChar = (str) => {
      let lastChar = str.substr(str.length - 1);
      if (str.length > 2 && lastChar === 'S') {
        return str.substr(0, str.length - 1) + lastChar.toLowerCase();
      } else {
        return str;
      }
    }

    const total = this.counter.get(totalCounterName);
    const notViewed = this.counter.get(notViewedCounterName);
    const notViewedText = notViewed ? `, ${notViewed} new` : '';
    return this.isReady() ? lowerCaseLastSChar(pluralize(pluralizeWord, total, true)) + notViewedText : '';
  },
  standardsMetrics() {
    return this._renderMetrics('standard', 'standards-count', 'standards-not-viewed-count');
  },
  NCsMetrics() {
    return this._renderMetrics('NC', 'non-conformities-count', 'non-conformities-not-viewed-count');
  },
  actionsMetrics() {
    return this._renderMetrics('Action', 'actions-count', 'actions-not-viewed-count');
  },
  actionsLabel() {
    return this.counter.get('actions-failed-count');
  },
  risksMetrics() {
    return this._renderMetrics('Risk', 'risks-count', 'risks-not-viewed-count');
  }
});
