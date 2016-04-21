# PLIO

The first on-demand system for compliance management in the enterprise, using lean principles

Plio is built using the Meteor JS framework, following the architecture, style guide and best practices defined in [Meteor Guide 1.3](guide.meteor.com).

# MOTIVATION

Plio is a collaborative software tool designed to support a new approach to compliance management based on the principles of continuous improvement.

Regulated organizations face particular challenges. Not only do they need to meet the requirements of customers but also the requirements of their regulatory agency. By applying the principles of continuous improvement, businesses can streamline the compliance management process whilst simultaneously finding ways to reduce cost and waste.

Plio helps an organization to create and maintain a standards book for its key processes and policies, supporting real-time discussion around each process.  It also helps streamline the management of corrective and preventative actions that are implemented to improve these processes and policies. 

![Continuous Improvement](https://cloud.githubusercontent.com/assets/2095940/14455609/0322fe72-00a9-11e6-8efb-f781c30e0a7b.png)

Source: https://www.getvetter.com/posts/129-define-continuous-improvement-8-experts-definitions

Also see: http://www.oceg.org/resources/leangrc-lean-grc-series/

# GETTING STARTED

## 1. Clone this repository ##

`cd <PROJECTS_FOLDER>`

`git clone https://github.com/sives/Plio.git`

## 2. Install Meteor ##

### OS X or Linux ###
Install the latest official Meteor release from your terminal:
`curl https://install.meteor.com/ | sh`
### Windows ###
[Download the official Meteor installer](https://install.meteor.com/windows)

## 3. Run a Meteor project locally ##

Go to the Meteor project directory (/app) and execute
`meteor`

**Note!** 

If you're getting an error *'Can't listen on port 3000. Perhaps another Meteor is running?
'*, you'll need to specify the port explicitly (and choose some other available port):

`meteor -p 2000`

#DEVELOPMENT

## Contribution process

In order to contribute to this repository you should follow next steps:

1. Choose unassigned card from Trello's "Backlog" or take already assigned to you card.
2. Move your card into "In progress" column.
3. Create new branch based on `devel`. Give you branch name that makes sense. Include the id of the task if there is any (like `PL2-org-settings`).
4. Start working on your task. If you don't know how to do something, then google it. If you stuck on something for more that 15 minutes, ask your colleagues for help. 
5. When card is finished, review your code and refactor complex/hard to understand parts of it (usually long functions or lines of code).
6. Test all features that was changed/edited/improved by you. Fix all bugs you found. Next, run `./lint.sh` and fix all linter errors.
7. If there are new commits on `devel` merge `devel` to your branch using `--no-ff` flag (see "Merging" section for details).
8. Create pull to `devel`. The name of PR (Pull Request) should contain the id and short description. It should be simple but not ambiguous. Put your pull request's url into related card's description.
9. Move your card into Trello's "Review" column. Someone of your collegues will review\* it. If your pull request was merged go to step #10. If your pull request is closed you should review comments in pull request go to step #1. If you don't understand any comment on your pull request, ask reviewer about it.
10. Congratulations! Your task is done! Go to step 1.

\* All pull requests should be __reviewed__ by other team member before merging with `devel`.


## Merging

Always merge your code with `--no-ff` option, so git will create separate commit for merging and you will be able to review changes after merging on github.

This approach allows to avoid old code appearing in merged version.

## Style Guide

### General recomendations: 
* Use variable's names that makes sense.
* Use `let` and `const` instead of `var`.
* Extract complex logic into separate class.
* Don't use global variables.
* Avoid unovious solutions. If you are using unobvious solution, then you should write a comment that expalins it.
* Don't leave `console.log` or any other __debuging/commented__ code in pull request's code.
* Do not put function into `Namespace` if it only used in 1 or 2 files.
* If your function has more than 15 lines it makes sense to split it on 2 or couple separate functions.
* Use single quotes instead of double (`'my string'` instead of `"my string"`).
* Use `Collection.find({ _id: id })` instead of `Collection.find(id)`.
* Write `{ someProperty: itsValue }` instead of `{ "someProperty": itsValue }` (except cases when property contains dot or other special character like `{ 'profile.fristname': 'Test' }`).
* Use ES6 string extrapolation (e.g. `"Hello, ${username}!"`) and dynamic attributes (e.g. `{ [myPropertyName]: someValue }`).
* IF YOU ARE WORKING WITH UNSATISFIED QUALITY CODE, PELASE, REWRITE IT FOLLOWING THIS GUIDE.

### Client side (Blaze):
* Correct order for Blaze's template configuration methods: `onCreated, onRendered, helpers, events, onDestroyed`.
* Don't use `Session` if you can pass data using template context.
* Don't use global JQuery selectors (use `this.$('.my-element')` instead of `$('.my-element')`).
* Don't use dynamic data attributes (e.g. `data-id="{{_id}}"`)
* Use `this.autorun` and `this.subscribe` (not `Meteor.autorun` and `Meteor.subscribe`) inside template.
* Don't use jquery if you can write the same thing through Blaze.
* Don't use inline styles.
* Isolate your styles using SaaS's namespacing feature:

```
.my-custom-component {
   ul > li {
     width: 300px;
   }
}
```

### Server side:
* Each argument should be checked using `check(target, Type)` inside all publishers and methods.
* Use ValidatedMethods instead of regular Meteor methods.

#License

The source code for Plio is made available under the GNU General Public License v3.0 (commercial license also available).
