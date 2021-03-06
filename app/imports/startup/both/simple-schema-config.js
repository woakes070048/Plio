import pluralize from 'pluralize';

SimpleSchema.messages({
  "regEx": [
    {msg: "Failed regular expression validation"},
    {exp: SimpleSchema.RegEx.Email, msg: '"[value]" must be a valid e-mail address'},
  ],
  "regEx number": [
    {msg: '"[value]" is not a valid phone number'},
  ],
  "minNumber timeValue": "Reminders for actions should be in range of [min] and [max]",
  "maxNumber timeValue": "Reminders for actions should be in range of [min] and [max]",
  "minCount standardsIds": "At least one standard must be attached",
  "minNumber issueNumber": "Issue number must be in range of [min] and [max]",
  "maxNumber issueNumber": "Issue number must be in range of [min] and [max]",
  "minString title": "[label] must be at least [min] character(s)"
});
