import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import LessonsService from './lessons-service.js';
import { LessonsSchema, requiredSchema } from './lessons-schema.js';
import { Lessons } from './lessons.js';
import { IdSchema } from '../schemas.js';

const organizationIdSchema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});

export const insert = new ValidatedMethod({
  name: 'Lessons.insert',

  validate: new SimpleSchema([requiredSchema, organizationIdSchema]).validator(),

  run({ documentId }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create a lesson');
    }

    const lesson = Lessons.findOne({ documentId });

    if (!!lesson) {
      throw new Meteor.Error(403, 'Lesson learned for that document already exists!');
    }

    return LessonsService.insert(...args);
  }
});

export const update = new ValidatedMethod({
  name: 'Lessons.update',

  validate: new SimpleSchema([IdSchema, requiredSchema]).validator(),

  run({_id, ...args}) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update a lesson');
    }

    return LessonsService.update({ _id, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Lessons.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot remove a lesson');
    }

    return LessonsService.remove({ _id });
  }
});
