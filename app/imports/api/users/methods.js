import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ValidationError } from 'meteor/mdg:validation-error';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles';

import UserService from './user-service.js';
import { UserProfileSchema, PhoneNumberSchema } from './user-schema.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { IdSchema, UserIdSchema } from '../schemas.js';
import { UserRoles, UserMembership } from '../constants.js';

export const remove = new ValidatedMethod({
  name: 'Users.remove',

  validate: new SimpleSchema({}).validator(),

  run({}) {
    const _id = this.userId;
    if (!_id) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete account'
      );
    }
    return UserService.remove({ _id });
  }
});

export const selectOrganization = new ValidatedMethod({
  name: 'Users.selectOrganization',

  validate: new SimpleSchema({
    selectedOrganizationSerialNumber: {
      type: Number
    }
  }).validator(),

  run({ selectedOrganizationSerialNumber }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot select organizations'
      );
    }
    const orgExists = !!Organizations.findOne({
      'users.userId': userId,
      serialNumber: selectedOrganizationSerialNumber
    });
    if (!orgExists) {
      throw new Meteor.Error('not-found', 'Could not find selected organization.');
    }

    return UserService.update(userId, {
      selectedOrganizationSerialNumber
    });
  }
});

export const updateProfile = new ValidatedMethod({
  name: 'Users.updateProfile',

  validate(doc) {
    const validationContext = new SimpleSchema([
      IdSchema,
      UserProfileSchema
    ]).newContext();

    for (let key in doc) {
      if (!validationContext.validateOne(doc, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  run({ _id, ...args}) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update profile'
      );
    }

    if (userId !== _id) {
      throw new Meteor.Error(403, 'User cannot update another user');
    }

    UserService.updateProfile(_id, args);
  }
});

export const unsetProfileProperty = new ValidatedMethod({
  name: 'Users.unsetProfileProperty',

  validate: new SimpleSchema([
    IdSchema,
    {
      fieldName: {
        type: String,
        allowedValues: UserProfileSchema.objectKeys()
      }
    }
  ]).validator(),

  run({ _id, fieldName }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update profile'
      );
    }

    if (userId !== _id) {
      throw new Meteor.Error(403, 'User cannot update another user');
    }

    const fieldDef = UserProfileSchema.getDefinition(fieldName);
    if (!(fieldDef.optional === true)) {
      throw new Meteor.Error(
        400,
        UserProfileSchema.messageForError('required', fieldName, null, '')
      );
    }

    UserService.unsetProfileProperty({ _id, fieldName });
  }
});

export const updateEmail = new ValidatedMethod({
  name: 'Users.updateEmail',

  validate: new SimpleSchema([IdSchema, {
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }]).validator(),

  run({ _id, email }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update email'
      );
    }

    if (userId !== _id) {
      throw new Meteor.Error(403, 'User cannot update another user\'s email');
    }

    return UserService.updateEmail(_id, email);
  }
});

export const updatePhoneNumber = new ValidatedMethod({
  name: 'Users.updatePhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    PhoneNumberSchema
  ]).validator(),

  run({ userId, ...args }) {
    const currUserId = this.userId;
    if (!currUserId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update phone numbers'
      );
    }

    if (userId !== currUserId) {
      throw new Meteor.Error(
        403, 'User cannot update another user\'s phone numbers'
      );
    }

    return UserService.updatePhoneNumber({ userId, ...args });
  }
});

export const addPhoneNumber = new ValidatedMethod({
  name: 'Users.addPhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    PhoneNumberSchema
  ]).validator(),

  run({ userId, ...args }) {
    const currUserId = this.userId;
    if (!currUserId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot add phone numbers'
      );
    }

    if (userId !== currUserId) {
      throw new Meteor.Error(
        403, 'User cannot add phone numbers to another users'
      );
    }

    return UserService.addPhoneNumber({ userId, ...args });
  }
});

export const removePhoneNumber = new ValidatedMethod({
  name: 'Users.removePhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    IdSchema
  ]).validator(),

  run({ userId, ...args }) {
    const currUserId = this.userId;
    if (!currUserId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove phone numbers'
      );
    }

    if (userId !== currUserId) {
      throw new Meteor.Error(
        403, 'User cannot remove another user\'s phone numbers'
      );
    }

    return UserService.removePhoneNumber({ userId, ...args });
  }
});

const changeRoleSchema = new SimpleSchema([IdSchema, {
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  role: {
    type: String,
    allowedValues: _.values(UserRoles)
  }
}]);

const ensureUserCanChangeRoles = (userId, orgId) => {
  const canChangeRoles = Roles.userIsInRole(
    userId, UserRoles.EDIT_USER_ROLES, orgId
  );

  if (!canChangeRoles) {
    throw new Meteor.Error(
      403,
      'User is not authorized for changing user\'s superpowers in this organization'
    );
  }
};

const ensureIsNotOrgOwner = (userId, orgId) => {
  const isOrgOwner = !!Organizations.findOne({
    _id: orgId,
    users: {
      $elemMatch: {
        userId,
        role: UserMembership.ORG_OWNER
      }
    }
  });

  if (isOrgOwner) {
    throw new Meteor.Error(
      403, 'Organization owner\'s superpowers cannot be changed'
    );
  }
};

export const assignRole = new ValidatedMethod({
  name: 'Users.assignRole',

  validate: changeRoleSchema.validator(),

  run({ _id, organizationId, role }) {
    ensureUserCanChangeRoles(this.userId, organizationId);

    ensureIsNotOrgOwner(_id, organizationId);

    return Roles.addUsersToRoles(_id, role, organizationId);
  }
});

export const revokeRole = new ValidatedMethod({
  name: 'Users.revokeRole',

  validate: changeRoleSchema.validator(),

  run({ _id, organizationId, role }) {
    ensureUserCanChangeRoles(this.userId, organizationId);

    ensureIsNotOrgOwner(_id, organizationId);

    return Roles.removeUsersFromRoles(_id, role, organizationId);
  }
});

export const sendVerificationEmail = new ValidatedMethod({
  name: 'Users.sendVerificationEmail',
  validate: new SimpleSchema({}).validator(),
  run() {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Cannot verify an email of an unauthorized user'
      );
    }

    if (!this.isSimulation) {
      return Accounts.sendVerificationEmail(userId);
    }
  }
});

export const setNotifications = new ValidatedMethod({
  name: 'Users.setNotifications',

  validate: new SimpleSchema([
    IdSchema,
    {
      enabled: { type: Boolean }
    }
  ]).validator(),

  run({ _id, enabled }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot change notification settings'
      );
    }

    if (userId !== _id) {
      throw new Meteor.Error(
        403, 'User cannot change another user\'s notification settings'
      );
    }

    return UserService.setNotifications({ _id, enabled });
  }
});

export const setNotificationSound = new ValidatedMethod({
  name: 'Users.setNotificationSound',

  validate: new SimpleSchema([
    IdSchema,
    {
      soundFile: { type: String }
    }
  ]).validator(),

  run({ _id, soundFile }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot change notification sounds'
      );
    }

    if (userId !== _id) {
      throw new Meteor.Error(
        403, 'User cannot change another user\'s notification sounds'
      );
    }

    return UserService.setNotificationSound({ _id, soundFile });
  }
});
