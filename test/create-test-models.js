'use strict'
// imports
var loopback = require('loopback');
var NestedFilter = require('../nested-filter.js');

// exports
module.exports = createTestServer;

// logic
function createTestServer() {
  var server, db, AppModel, AppModel_1, AppModel_2, AppModel_1_1, AppModel_1_1_1, AppModel_1_1_2,
    AppModel_1_2, AppModel_1_2_1, AppModel_2_1,
    App, App_1, App_2, App_1_1, App_2_1, App_1_1_1, App_1_1_2, App_1_2, App_1_2_1;

  var app = loopback();
  app.set('legacyExplorer', false);
  app.use(loopback.rest());
  db = app.dataSource('db', { adapter: 'memory' });
  db.setMaxListeners(15)

  AppModel = app.registry.createModel('app');
  AppModel_1 = app.registry.createModel('app_1');
  AppModel_2 = app.registry.createModel('app_2');
  AppModel_1_1 = app.registry.createModel('app_1_1');
  AppModel_2_1 = app.registry.createModel('app_2_1');
  AppModel_1_1_1 = app.registry.createModel('app_1_1_1');
  AppModel_1_1_2 = app.registry.createModel('app_1_1_2');
  AppModel_1_2 = app.registry.createModel('app_1_2');
  AppModel_1_2_1 = app.registry.createModel('app_1_2_1');

  App = app.model(AppModel, { dataSource: 'db', properties: { 'prop': { 'type': 'number' } } });
  App_1 = app.model(AppModel_1, { dataSource: 'db', properties: { 'prop': { 'type': 'number' } } });
  App_2 = app.model(AppModel_2, { dataSource: 'db', properties: { 'prop': { 'type': 'number' } } });
  App_1_1 = app.model(AppModel_1_1, { dataSource: 'db', properties: { 'prop': { 'type': 'number' } } });
  App_2_1 = app.model(AppModel_2_1, { dataSource: 'db', properties: { 'prop': { 'type': 'number' } } });
  App_1_1_1 = app.model(AppModel_1_1_1, { dataSource: 'db', properties: { 'prop': { 'type': 'number' } } });
  App_1_1_2 = app.model(AppModel_1_1_2, { dataSource: 'db', properties: { 'prop': { 'type': 'number' } } });
  App_1_2 = app.model(AppModel_1_2, { dataSource: 'db', properties: { 'prop': { 'type': 'number' } } });
  App_1_2_1 = app.model(AppModel_1_2_1, { dataSource: 'db', properties: { 'prop': { 'type': 'number' } } });

  App.hasMany(App_1, { as: 'app1', foreignKey: 'relationId' });
  App.hasMany(App_2, { as: 'app2', foreignKey: 'relationId' });
  App_1.hasMany(App_1_1, { as: 'app11', foreignKey: 'relationId' });
  App_1.hasMany(App_1_2, { as: 'app12', foreignKey: 'relationId' });
  App_2.hasMany(App_2_1, { as: 'app21', foreignKey: 'relationId' });
  App_1_1.hasMany(App_1_1_1, { as: 'app111', foreignKey: 'relationId' });
  App_1_1.hasMany(App_1_1_2, { as: 'app112', foreignKey: 'relationId' });
  App_1_2.hasMany(App_1_2_1, { as: 'app121', foreignKey: 'relationId' });

  App_1.belongsTo(App, { as: 'app1', foreignKey: 'relationId' });
  App_2.belongsTo(App, { as: 'app2', foreignKey: 'relationId' });
  App_1_1.belongsTo(App_1, { as: 'app11', foreignKey: 'relationId' });
  App_1_2.belongsTo(App_1, { as: 'app12', foreignKey: 'relationId' });
  App_2_1.belongsTo(App_2, { as: 'app21', foreignKey: 'relationId' });
  App_1_1_1.belongsTo(App_1_1, { as: 'app111', foreignKey: 'relationId' });
  App_1_1_2.belongsTo(App_1_1, { as: 'app112', foreignKey: 'relationId' });
  App_1_2_1.belongsTo(App_1_2, { as: 'app121', foreignKey: 'relationId' });

  // Setup Mixin
  NestedFilter(App);
  NestedFilter(App_1);
  NestedFilter(App_2);
  NestedFilter(App_1_1);
  NestedFilter(App_1_1_1);
  NestedFilter(App_1_1_2);
  NestedFilter(App_1_2);
  NestedFilter(App_1_2_1);
  NestedFilter(App_2_1);

  // Populate
  App.create({ 'prop': 1 });
    App_1.create({ 'prop': 1, relationId: 1 });
      App_1_1.create({ 'prop': 1, relationId: 1 });
        App_1_1_1.create({ 'prop': 1, relationId: 1 });
        App_1_1_2.create({ 'prop': 0, relationId: 1 });
      App_1_2.create({ 'prop': 0, relationId: 1 });
        App_1_2_1.create({ 'prop': 1, relationId: 1 });
    App_2.create({ 'prop': 0, relationId: 1 });
      App_2_1.create({ 'prop': 1, relationId: 1 });

  App.create({ 'prop': 1 });
    App_1.create({ 'prop': 1, relationId: 2 });
  
  return app;
}