import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { OrgCurrencies,  UserMembership } from '/imports/api/constants.js';
import { BaseEntitySchema, TimePeriodSchema } from '../schemas.js';


const orgUserSchema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  role: {
    type: String,
    allowedValues: _.values(UserMembership)
  },
  isRemoved: {
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  removedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  removedAt: {
    type: Date,
    optional: true
  }
});

const workflowDefaultsSchema = new SimpleSchema({
  minorNc: {
    type: TimePeriodSchema
  },
  majorNc: {
    type: TimePeriodSchema
  },
  criticalNc: {
    type: TimePeriodSchema
  }
});

const reminderSchema = new SimpleSchema({
  start: {
    type: TimePeriodSchema
  },
  interval: {
    type: TimePeriodSchema
  },
  until: {
    type: TimePeriodSchema
  }
});

const remindersSchema = new SimpleSchema({
  minorNc: {
    type: reminderSchema
  },
  majorNc: {
    type: reminderSchema
  },
  criticalNc: {
    type: reminderSchema
  },
  improvementPlan: {
    type: reminderSchema
  }
});

const ncGuidelinesSchema = new SimpleSchema({
  minor: {
    type: String
  },
  major: {
    type: String
  },
  critical: {
    type: String
  }
});

const OrganizationCurrencySchema = {
  currency: {
    type: String,
    allowedValues: _.values(OrgCurrencies),
    optional: true
  }
};

const OrganizationEditableFields = {
  name: {
    type: String,
    min: 1,
    max: 40
  },
  workflowDefaults: {
    type: workflowDefaultsSchema,
    optional: true
  },
  reminders: {
    type: remindersSchema,
    optional: true
  },
  ncGuidelines: {
    type: ncGuidelinesSchema,
    optional: true
  },
  ...OrganizationCurrencySchema
};

const transferSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  newOwnerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  createdAt: {
    type: Date
  }
});

const OrganizationSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationEditableFields,
  {
    serialNumber: {
      type: Number,
      min: 0
    },
    users: {
      type: [orgUserSchema],
      minCount: 1
    },
    transfer: {
      type: transferSchema,
      optional: true
    }
  }
]);

export { OrganizationEditableFields, OrganizationSchema, OrganizationCurrencySchema };
