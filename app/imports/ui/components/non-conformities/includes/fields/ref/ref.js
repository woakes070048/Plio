import { Template } from 'meteor/templating';

Template.NC_Ref_Edit.viewmodel({
  mixin: 'urlRegex',
  text: '',
  url: '',
  update(e) {
    let { text, url } = this.data();
    const context = this.templateInstance.data;

    if (!text || !url) return;

    if (text === context.text && url === context.url) return;

    if (!this._id) return;

    if (url.search(/^https?\:\/\//) === -1) {
      url = `http://${url}`;
    }

    if (!!url && !this.IsValidUrl(url)) {
      ViewModel.findOne('ModalWindow').setError('Url is not valid!');
      return;
    }

    const ref = { text, url };

    this.parent().update({ ref, e, withFocusCheck: true });
  }
});
