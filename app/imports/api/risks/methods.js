import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RisksService from './risks-service.js';
import { RisksUpdateSchema, RequiredSchema } from './risks-schema.js';
import { Risks } from './risks.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  UserIdSchema
} from '../schemas.js';

import { checkAnalysis } from '../checkers.js';

export const insert = new ValidatedMethod({
  name: 'Risks.insert',

  validate: new SimpleSchema([RequiredSchema, {
    standardId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    }
  }]).validator(),

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a risk'
      );
    }

    return RisksService.insert({ ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'Risks.update',

  validate: new SimpleSchema([
    IdSchema, RisksUpdateSchema, optionsSchema
  ]).validator(),

  run({ _id, options, query, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a risk'
      );
    }

    const risk = Risks.findOne({ _id });

    if (!risk) {
      throw new Meteor.Error(
        400, 'Risk does not exist'
      );
    }

    checkAnalysis(risk, args);

    if (_.has('args', ['scoredBy', 'scoredAt']) && !risk.score) {
      throw new Meteor.Error(
        403, 'Access denied'
      )
    }

    return RisksService.update({ _id, options, query, ...args });
  }
});

export const updateViewedBy = new ValidatedMethod({
  name: 'Risks.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a risk'
      );
    }

    if (!Risks.findOne({ _id })) {
      throw new Meteor.Error(
        400, 'Risk does not exist'
      );
    }

    if (!!Risks.findOne({ _id, viewedBy: this.userId })) {
      throw new Meteor.Error(
        400, 'You have been already added to this list'
      );
    }

    return RisksService.updateViewedBy({ _id, userId: this.userId });
  }
});


export const remove = new ValidatedMethod({
  name: 'Risks.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a risk'
      );
    }

    const risk = Risks.findOne({ _id });

    if (!risk) {
      throw new Meteor.Error(
        400, 'Risk with the given id does not exist'
      );
    }

    return RisksService.remove({ _id, deletedBy: userId, isDeleted: risk.isDeleted});
  }
});
