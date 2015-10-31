import _ from 'underscore';
import Backbone from 'backbone';

import Session from './models/session';
import Recipe from './models/recipe';
import RecipesCollection from './models/recipes-collection';
import CommentsCollection from './models/comments-collection';
import User from './models/user';
import UsersCollection from './models/users-collection';

let session = new Session();
let recipes = new RecipesCollection();
let users = new UsersCollection();

let commentsCache = {};

const Store = _.extend({}, Backbone.Events, {

  initialize() {
    this.listenTo(recipes, 'add change remove', this.trigger.bind(this, 'change'));
    this.listenTo(users, 'add change remove', this.trigger.bind(this, 'change'));
    this.listenTo(session, 'change', this.trigger.bind(this, 'change'));
  },

  getRecipes() {
    return recipes.toJSON();
  },

  fetchRecipes() {
    return recipes.fetch();
  },

  // TODO: do something if id doesn't exist
  getRecipe(id) {
    let recipe = recipes.get(id);
    if(recipe) {
      return recipe.toJSON();
    } else {
      recipes.fetch();
      return {};
    }
  },

  saveRecipe(recipe, options) {
    options = _.extend({}, options, {merge: true});
    return recipes.create(recipe, options);
  },

  destroyRecipe(recipe) {
    return recipes.get(recipe.objectId).destroy();
  },

  invalidateSession() {
    return session.invalidate();
  },

  authenticateSession(options) {
    return session.authenticate(options);
  },

  getSession(){
    return session.toJSON();
  },

  restoreSession() {
    return session.restore();
  },

  createUser(attributes) {
    // TODO: this user should become the currentUser, instead of fetching again
    let user = new User(attributes);
    return user.save().then(() => {
      return session.authenticate({sessionToken: user.get('sessionToken')});
    });
  },

  getCommentsForRecipe(id) {
    let comments = (commentsCache[id] = commentsCache[id] || new CommentsCollection(null, {recipeId: id}));
    this.stopListening(comments);
    this.listenTo(comments, 'add remove change', this.trigger.bind(this, 'change'));
    return comments.toJSON();
  },

  fetchCommentsForRecipe(id) {
    let comments = (commentsCache[id] = commentsCache[id] || new CommentsCollection(null, {recipeId: id}));
    this.stopListening(comments);
    this.listenTo(comments, 'add remove change', this.trigger.bind(this, 'change'));
    return comments.fetch();
  },

  commentOnRecipe(id, comment) {
    let comments = (commentsCache[id] = commentsCache[id] || new CommentsCollection(null, {recipeId: id}));
    this.stopListening(comments);
    this.listenTo(comments, 'add remove change', this.trigger.bind(this, 'change'));
    comments.create({
      recipe: {objectId: id},
      text: comment
    });
  },

  saveUser(user, options) {
    options = _.extend({}, options, {merge: true});
    return users.create(user, options);
  },

  // TODO: do something if id doesn't exist
  getUser(id) {
    let user = users.get(id);
    if(user) {
      return user.toJSON();
    } else {
      users.fetch();
      return {};
    }
  },
});

Store.initialize();

export default Store;
