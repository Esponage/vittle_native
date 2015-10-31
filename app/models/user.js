import Backbone from 'backbone';
import store from '../store';

const User = Backbone.Model.extend({
  idAttribute: 'objectId',
  urlRoot: "https://api.parse.com/1/users"
});

export default User;
