'use strict';
/* eslint-disable camelcase, max-len */
// imports
var expect  = require('chai').expect;
var request = require('supertest');
var server = (require('./create-test-models'))()

// tests
describe('NestedFilter', function() {
  it('Test filter at level 1 nest + list of excludes generation, should return 2 results', function(done) {
    const filter1 = {
      include: [{
        relation: 'app1',
        scope: {
          where: {'prop': 1}, // true
        },
      }],
      excludeIfEmpty: true,
    };

    request(server).get(`/apps?filter=${unescape(JSON.stringify(filter1))}`)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.length).to.equal(2);
        
        done();
      });
  });

  it('Test filter at level 1 nest + list of excludes generation, should not return results', function(done) {
    const filter1 = {
      include: [{
        relation: 'app1',
        scope: {
          where: {'prop': 0}, // false
          include: [
            {
              relation: 'app11',
              scope: {
                include: [
                  'app111',
                  {
                    relation: 'app112',
                    scope: {
                      where: {'prop': 0}, // true
                    },
                  },
                ],
                where: {'prop': 1}, // true
              },
            }, {
              relation: 'app12',
              scope: {
                include: 'app121',
                scope: {
                  where: {'prop': 1}, // true
                },
              },
            },
          ],
        },
      }, 'app2'],
      excludeIfEmpty: true,
    };

    request(server).get(`/apps?filter=${unescape(JSON.stringify(filter1))}`)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.length).to.equal(0);
        
        done();
      });
  });

  it('Test filter at level 3 nest + list of excludes generation, should return 1 result', function(done) {
    const filter1 = {
      include: [{
        relation: 'app1',
        scope: {
          where: {'prop': 1}, // true
          include: [
            {
              relation: 'app11',
              scope: {
                include: [
                  'app111',
                  {
                    relation: 'app112',
                    scope: {
                      where: {'prop': 0}, // true
                    },
                  },
                ],
                where: {'prop': 1}, // true
              },
            }, {
              relation: 'app12',
              scope: {
                include: 'app121',
                scope: {
                  where: {'prop': 1}, // true
                },
              },
            },
          ],
        },
      }, 'app2'],
      excludeIfEmpty: true,
    };

    request(server).get(`/apps?filter=${unescape(JSON.stringify(filter1))}`)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.length).to.equal(1);
        const result = res.body[0];
        expect(result.app1);
        expect(result.app2);
        
        done();
      });
  });

  it('Test filter at level 3 nest + list of excludes generation, should not return results', function(done) {
    const filter1 = {
      include: [{
        relation: 'app1',
        scope: {
          where: {'prop': 1}, // true
          include: [
            {
              relation: 'app11',
              scope: {
                include: [
                  'app111',
                  {
                    relation: 'app112',
                    scope: {
                      where: {'prop': 1}, // false
                    },
                  },
                ],
                where: {'prop': 1}, // true
              },
            }, {
              relation: 'app12',
              scope: {
                include: 'app121',
                scope: {
                  where: {'prop': 1}, // true
                },
              },
            },
          ],
        },
      }, 'app2'],
      excludeIfEmpty: true,
    };

    request(server).get(`/apps?filter=${unescape(JSON.stringify(filter1))}`)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.length).to.equal(0);
        
        done();
      });
  });

  it('Test filter at level 3 nest + specify excludes, should return 1 result', function(done) {
    const filter1 = {
      include: [{
        relation: 'app1',
        scope: {
          where: {'prop': 1}, // true
          include: [
            {
              relation: 'app11',
              scope: {
                include: [
                  'app111',
                  {
                    relation: 'app112',
                    scope: {
                      where: {'prop': 0}, // true
                    },
                  },
                ],
                where: {'prop': 1}, // true
              },
            }, {
              relation: 'app12',
              scope: {
                include: 'app121',
                scope: {
                  where: {'prop': 1}, // true
                },
              },
            },
          ],
        },
      }, 'app2'],
      excludeIfEmpty: ['app1.app11', 'app1.app11.app112'],
    };

    request(server).get(`/apps?filter=${unescape(JSON.stringify(filter1))}`)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.length).to.equal(1);
        const result = res.body[0];
        expect(result.app1);
        expect(result.app2);
        
        done();
      });
  });

  it('Test filter at level 3 nest + specify excludes, should not return results (fail at level 2)', function(done) {
    const filter1 = {
      include: [{
        relation: 'app1',
        scope: {
          where: {'prop': 0}, // false
          include: [
            {
              relation: 'app11',
              scope: {
                include: [
                  'app111',
                  {
                    relation: 'app112',
                    scope: {
                      where: {'prop': 0}, // true
                    },
                  },
                ],
                where: {'prop': 1}, // true
              },
            }, {
              relation: 'app12',
              scope: {
                include: 'app121',
                scope: {
                  where: {'prop': 1}, // true
                },
              },
            },
          ],
        },
      }, 'app2'],
      excludeIfEmpty: ['app1.app11', 'app1.app11.app112'],
    };

    request(server).get(`/apps?filter=${unescape(JSON.stringify(filter1))}`)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.length).to.equal(0);
        
        done();
      });
  });

  it('Test filter at level 3 nest + specify excludes, should not return results (fail at level 3)', function(done) {
    const filter1 = {
      include: [{
        relation: 'app1',
        scope: {
          where: {'prop': 1}, // true
          include: [
            {
              relation: 'app11',
              scope: {
                include: [
                  'app111',
                  {
                    relation: 'app112',
                    scope: {
                      where: {'prop': 0}, // true
                    },
                  },
                ],
                where: {'prop': 0}, // false
              },
            }, {
              relation: 'app12',
              scope: {
                include: 'app121',
                scope: {
                  where: {'prop': 1}, // true
                },
              },
            },
          ],
        },
      }, 'app2'],
      excludeIfEmpty: ['app1.app11', 'app1.app11.app112'],
    };

    request(server).get(`/apps?filter=${unescape(JSON.stringify(filter1))}`)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.length).to.equal(0);
        
        done();
      });
  });

  it('Test filter at level 3 nest + specify excludes, should return 1 result (fail at level 2 should be ignored)', function(done) {
    const filter1 = {
      include: [{
        relation: 'app1',
        scope: {
          where: {'prop': 1}, // true
          include: [
            {
              relation: 'app11',
              scope: {
                include: [
                  'app111',
                  {
                    relation: 'app112',
                    scope: {
                      where: {'prop': 0}, // true
                    },
                  },
                ],
                where: {'prop': 1}, // true
              },
            }, {
              relation: 'app12',
              scope: {
                include: 'app121',
                scope: {
                  where: {'prop': 0}, // false
                },
              },
            },
          ],
        },
      }, 'app2'],
      excludeIfEmpty: ['app1.app11', 'app1.app11.app112'],
    };

    request(server).get(`/apps?filter=${unescape(JSON.stringify(filter1))}`)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.length).to.equal(1);
        
        done();
      });
  });
});
