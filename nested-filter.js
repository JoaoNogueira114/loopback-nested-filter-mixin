'use strict';

module.exports = function(Model, options) {
  Model.beforeRemote('find', function event(ctx, options, next) {
    /* Allows nested filters to be applied */
    if (ctx.args.filter && ctx.args.filter.excludeIfEmpty === true) {
      ctx.args.filter.excludeIfEmpty = generateExcludeArray(ctx.args.filter.include);
    }
    if (!ctx.args.filter) {
      next();
    } else if (ctx.args.filter.excludeIfEmpty) {
      // console.log('<i> NestedSearch mixin was used');
      // constants
      ctx.originalFilter = JSON.parse(JSON.stringify(ctx.args.filter));
      delete ctx.args.filter.limit;
      delete ctx.args.filter.skip;
      next();
    } else {
      next();
    }
  });

  Model.beforeRemote('count', function event(ctx, options, next) {
    /* Allows nested filters to be applied */
    if (ctx.args.filter && ctx.args.filter.excludeIfEmpty === true) {
      ctx.args.filter.excludeIfEmpty = generateExcludeArray(ctx.args.filter.include);
    }
    if (!ctx.args.where) {
      next();
    } else if (ctx.args.where.excludeIfEmpty) {
      // console.log('<i> NestedSearch mixin was used');
      // constants
      ctx.methodString.replace('count', 'find');
      ctx.method.name = 'find';
      ctx.args.filter = ctx.args.where;
      ctx.originalFilter = JSON.parse(JSON.stringify(ctx.args.filter));
      ctx.wasCount = true;
      delete ctx.args.filter.limit;
      delete ctx.args.filter.skip;
      next();
    } else {
      next();
    }
  });

  Model.afterRemote('find', function event(ctx, options, next) {
    function includesAreValid(result, excludes) {
      return excludes.reduce((veredict, exclude) => {
        function isEmpty(result, exlude) {
          let curResult = result.__data[exclude[0]];
          if (exclude.length == 1) {
            if (!curResult) {
              return false;
            } else if (Array.isArray(curResult)) {
              return (curResult.length > 0) ? true : false;
            } else {
              return true;
            }
          } else if (curResult) {
            exclude.shift();
            if (Array.isArray(curResult)) {
              curResult = curResult.filter(result => includesAreValid(result, exclude));
              return (curResult.length > 0) ? true : false;
            } else {
              return isEmpty(curResult, exclude);
            }
          } else {
            return false;
          }
        }

        exclude = exclude.split(/\.(.+)/).filter(Boolean);
        return isEmpty(result, exclude) && veredict;
      }, true);
    }

    if (!ctx.args.filter) {
      next();
    } else if (ctx.args.filter.excludeIfEmpty) {
      ctx.result.count ? ctx.result = ctx.result.count : null;
      let results = ctx.result;
      const originalFilter = ctx.originalFilter;
      const excludes = originalFilter.excludeIfEmpty;

      results = results.filter(result => includesAreValid(result, excludes));
      ctx.result = results;

      if (originalFilter.skip) {
        results.remove(0, originalFilter.skip - 1);
      }
      if (originalFilter.limit && results.length > originalFilter.limit) {
        results.remove(originalFilter.limit, results.length - 1);
      }

      if (ctx.wasCount) {
        // means we arrived here from a COUNT request via NestedSearch
        ctx.result = {count: results.length};
      }
      next();
    } else {
      next();
    }
  });
};

function generateExcludeArray(includes) {
  function checkNested(include, soFar) {
    if (!Array.isArray(include)) {
      const relationName = typeof include === 'string' ? include : include.relation;
      soFar = soFar ? soFar + '.' + relationName : relationName;
      nestedArray.push(soFar);
      if (include.scope && include.scope.include) {
        checkNested(include.scope.include, soFar);
      }
    } else {
      include.map(include => checkNested(include, soFar));
    }
  }

  const nestedArray = [];
  checkNested(includes, '');
  return nestedArray;
};
