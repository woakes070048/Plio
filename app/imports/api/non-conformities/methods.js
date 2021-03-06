import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import NonConformitiesService from './non-conformities-service.js';
import { NonConformitiesUpdateSchema, RequiredSchema } from './non-conformities-schema.js';
import { NonConformities } from './non-conformities.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  UserIdSchema
} from '../schemas.js';

import { checkAnalysis } from '../checkers.js';

export const insert = new ValidatedMethod({
  name: 'NonConformities.insert',

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
        403, 'Unauthorized user cannot create a non-conformity'
      );
    }

    return NonConformitiesService.insert({ ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'NonConformities.update',

  validate: new SimpleSchema([
    IdSchema, NonConformitiesUpdateSchema, optionsSchema
  ]).validator(),

  run({_id, options, query, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a non-conformity'
      );
    }

    const NC = NonConformities.findOne({ _id });

    checkAnalysis(NC, args);

    return NonConformitiesService.update({ _id, options, query, ...args });
  }
});

export const updateViewedBy = new ValidatedMethod({
  name: 'NonConformities.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a non-conformity'
      );
    }

    if (!NonConformities.findOne({ _id })) {
      throw new Meteor.Error(
        400, 'Non-conformity does not exist'
      );
    }

    if (!!NonConformities.findOne({ _id, viewedBy: this.userId })) {
      throw new Meteor.Error(
        400, 'You have been already added to this list'
      );
    }

    return NonConformitiesService.updateViewedBy({ _id, userId: this.userId });
  }
});


export const remove = new ValidatedMethod({
  name: 'NonConformities.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a non-conformity'
      );
    }

    const NC = NonConformities.findOne({ _id });

    if (!NC) {
      throw new Meteor.Error(
        400, 'Non-conformity with the given id does not exists'
      );
    }

    return NonConformitiesService.remove({ _id, deletedBy: userId, isDeleted: NC.isDeleted});
  }
});
