import store from '../store';
import _ from 'underscore';
import User from './user';
import Recipe from './recipe';

const Comment = Backbone.Model.extend({

  idAttribute: 'objectId',

  defaults() {
    return {
      recipe: {},
      creator: {}
    }
  },

  toJSON(options) {
    // I'm saving the model
    if(options) {

      return _.extend({}, this.attributes, {
        recipe: {
          "__type": "Pointer",
          "className": "Recipe",
          "objectId": this.get('recipe').objectId
        },
        creator: {
          "__type": "Pointer",
          "className": "_User",
          "objectId": this.get('creator').objectId
        }
      });

    // I'm using toJSON to get a simple object of attributes
    } else {
      return _.clone(this.attributes);
    }
  },

  save() {
    let currentUser = store.getSession().currentUser;
    if(currentUser) {
      if(this.isNew()) {
        this.set('creator', currentUser);
      }
      Backbone.Model.prototype.save.apply(this, arguments);
    } else {
      return new Promise((_, reject) => reject("Invalid session"));
    }
  }
});

export default Comment;
