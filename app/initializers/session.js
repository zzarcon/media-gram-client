import Ember from "ember";
import config from 'media-gram/config/environment';

var Session = Ember.Object.extend({
  user: null,
  isLogged: Ember.computed.bool('user.id')
});

export default {
  name: 'session',
  after: 'store',

  initialize: function(container, app) {
    app.register('session:main', Session, {singleton: true});

    var adapter = container.lookup('adapter:application');
    var headers = adapter.headers || {};
    var store = container.lookup('store:main');
    var session = container.lookup('session:main');
    var sessionUri = config.host + '/api/session';
    var headerName = 'X-Session-Token';
    var paramName = "session_token";
    var uriToken = document.location.href.split(paramName + '=')[1]; //TODO: Improve way to get the token
    var token = uriToken || localStorage.getItem(paramName);

    if (uriToken) {
      localStorage.setItem(paramName, token);
    }

    headers[headerName] = token;
    adapter.headers = headers;

    $.ajaxSetup({
      beforeSend: function(xhr) {
        xhr.setRequestHeader(headerName, token);
      }
    });

    app.inject('controller', 'session', 'session:main');
    app.inject('route', 'session', 'session:main');
    app.inject('router', 'session', 'session:main');
    app.inject('view', 'session', 'session:main');

    app.deferReadiness();

    Ember.$.get(sessionUri).then(function(response) {
      if (response.user) {
        var user = Ember.merge(response.user, {
          fullName: response.user.user_name,
          profilePicture: response.user.profile_picture
        });

        session.set('user', store.createRecord('user', user));
      }

      app.advanceReadiness();
    }).fail(function() {
      app.advanceReadiness();
    });
  }
};