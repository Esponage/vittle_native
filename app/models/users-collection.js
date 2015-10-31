import User from './user';

const UsersCollection = Backbone.Collection.extend({
  model: User,
  url: "https://api.parse.com/1/users",
  parse(response) {
    return response.results;
  }
});

export default UsersCollection;
