"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidateOptions = getValidateOptions;
exports.getDefaultOptions = getDefaultOptions;
exports.getDefaultVars = getDefaultVars;
exports._afterCompile = _afterCompile;
exports._prepareForBuild = _prepareForBuild;

function getValidateOptions() {
  return {
    "type": "object",
    "properties": {
      "framework": {
        "type": ["string"]
      },
      "port": {
        "type": ["integer"]
      },
      "emit": {
        "type": ["boolean"]
      },
      "browser": {
        "type": ["boolean"]
      },
      "watch": {
        "type": ["string"]
      },
      "profile": {
        "type": ["string"]
      },
      "environment": {
        "type": ["string"]
      },
      "verbose": {
        "type": ["string"]
      }
    },
    "additionalProperties": false // "errorMessage": {
    //   "option": "should be {Boolean} (https:/github.com/org/repo#anchor)"
    // }

  };
}

function getDefaultOptions() {
  return {
    port: 1962,
    emit: true,
    browser: true,
    watch: 'yes',
    profile: 'desktop',
    environment: 'development',
    verbose: 'no'
  };
}

function getDefaultVars() {
  return {
    firstTime: true,
    browserCount: 0,
    cwd: process.cwd(),
    extPath: '.',
    pluginErrors: [],
    lastNumFiles: 0,
    lastMilliseconds: 0,
    lastMillisecondsAppJson: 0,
    files: ['./app.json'],
    dirs: ['./app', './packages']
  };
}

function _afterCompile(compilation, vars, options) {
  try {
    require('./pluginUtil').logv(options, 'FUNCTION ext-after-compile');

    const path = require('path');

    let {
      files,
      dirs
    } = vars;
    const {
      cwd
    } = vars;
    files = typeof files === 'string' ? [files] : files;
    dirs = typeof dirs === 'string' ? [dirs] : dirs;

    const {
      fileDependencies,
      contextDependencies
    } = _getFileAndContextDeps(compilation, files, dirs, cwd, options);

    if (files.length > 0) {
      fileDependencies.forEach(file => {
        compilation.fileDependencies.add(path.resolve(file));
      });
    }

    if (dirs.length > 0) {
      contextDependencies.forEach(context => {
        compilation.contextDependencies.add(context);
      });
    }
  } catch (e) {
    console.log(e);
    compilation.errors.push('_afterCompile: ' + e);
  }
}

function _getFileAndContextDeps(compilation, files, dirs, cwd, options) {
  require('./pluginUtil').logv(options, 'FUNCTION _getFileAndContextDeps');

  const uniq = require('lodash.uniq');

  const isGlob = require('is-glob');

  const {
    fileDependencies,
    contextDependencies
  } = compilation;
  const isWebpack4 = compilation.hooks;
  let fds = isWebpack4 ? [...fileDependencies] : fileDependencies;
  let cds = isWebpack4 ? [...contextDependencies] : contextDependencies;

  if (files.length > 0) {
    files.forEach(pattern => {
      let f = pattern;

      if (isGlob(pattern)) {
        f = glob.sync(pattern, {
          cwd,
          dot: true,
          absolute: true
        });
      }

      fds = fds.concat(f);
    });
    fds = uniq(fds);
  }

  if (dirs.length > 0) {
    cds = uniq(cds.concat(dirs));
  }

  return {
    fileDependencies: fds,
    contextDependencies: cds
  };
}

function _prepareForBuild(app, vars, options, output, compilation) {
  try {
    const log = require('./pluginUtil').log;

    const logv = require('./pluginUtil').logv;

    logv(options, '_prepareForBuild');

    const fs = require('fs');

    const recursiveReadSync = require('recursive-readdir-sync');

    var watchedFiles = [];

    try {
      watchedFiles = recursiveReadSync('./app').concat(recursiveReadSync('./packages'));
    } catch (err) {
      if (err.errno === 34) {
        console.log('Path does not exist');
      } else {
        throw err;
      }
    }

    var currentNumFiles = watchedFiles.length;
    logv(options, 'watchedFiles: ' + currentNumFiles);
    var doBuild = true; // var doBuild = false
    // for (var file in watchedFiles) {
    //   if (vars.lastMilliseconds < fs.statSync(watchedFiles[file]).mtimeMs) {
    //     if (watchedFiles[file].indexOf("scss") != -1) {doBuild=true;break;}
    //   }
    // }
    // if (vars.lastMilliseconds < fs.statSync('./app.json').mtimeMs) {
    //   doBuild=true
    // }

    logv(options, 'doBuild: ' + doBuild);
    vars.lastMilliseconds = new Date().getTime();
    var filesource = 'this file enables client reload';
    compilation.assets[currentNumFiles + 'FilesUnderAppFolder.md'] = {
      source: function () {
        return filesource;
      },
      size: function () {
        return filesource.length;
      }
    };
    logv(options, 'currentNumFiles: ' + currentNumFiles);
    logv(options, 'vars.lastNumFiles: ' + vars.lastNumFiles);
    logv(options, 'doBuild: ' + doBuild);

    if (currentNumFiles != vars.lastNumFiles || doBuild) {
      vars.rebuild = true;
      log(app + 'building Ext bundle at: ' + output.replace(process.cwd(), ''));
    } else {
      vars.rebuild = false;
    }

    vars.lastNumFiles = currentNumFiles;
  } catch (e) {
    console.log(e);
    compilation.errors.push('_prepareForBuild: ' + e);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9leHRqc1V0aWwuanMiXSwibmFtZXMiOlsiZ2V0VmFsaWRhdGVPcHRpb25zIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJwb3J0IiwiZW1pdCIsImJyb3dzZXIiLCJ3YXRjaCIsInByb2ZpbGUiLCJlbnZpcm9ubWVudCIsInZlcmJvc2UiLCJnZXREZWZhdWx0VmFycyIsImZpcnN0VGltZSIsImJyb3dzZXJDb3VudCIsImN3ZCIsInByb2Nlc3MiLCJleHRQYXRoIiwicGx1Z2luRXJyb3JzIiwibGFzdE51bUZpbGVzIiwibGFzdE1pbGxpc2Vjb25kcyIsImxhc3RNaWxsaXNlY29uZHNBcHBKc29uIiwiZmlsZXMiLCJkaXJzIiwiX2FmdGVyQ29tcGlsZSIsImNvbXBpbGF0aW9uIiwidmFycyIsIm9wdGlvbnMiLCJyZXF1aXJlIiwibG9ndiIsInBhdGgiLCJmaWxlRGVwZW5kZW5jaWVzIiwiY29udGV4dERlcGVuZGVuY2llcyIsIl9nZXRGaWxlQW5kQ29udGV4dERlcHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZmlsZSIsImFkZCIsInJlc29sdmUiLCJjb250ZXh0IiwiZSIsImNvbnNvbGUiLCJsb2ciLCJlcnJvcnMiLCJwdXNoIiwidW5pcSIsImlzR2xvYiIsImlzV2VicGFjazQiLCJob29rcyIsImZkcyIsImNkcyIsInBhdHRlcm4iLCJmIiwiZ2xvYiIsInN5bmMiLCJkb3QiLCJhYnNvbHV0ZSIsImNvbmNhdCIsIl9wcmVwYXJlRm9yQnVpbGQiLCJhcHAiLCJvdXRwdXQiLCJmcyIsInJlY3Vyc2l2ZVJlYWRTeW5jIiwid2F0Y2hlZEZpbGVzIiwiZXJyIiwiZXJybm8iLCJjdXJyZW50TnVtRmlsZXMiLCJkb0J1aWxkIiwiRGF0ZSIsImdldFRpbWUiLCJmaWxlc291cmNlIiwiYXNzZXRzIiwic291cmNlIiwic2l6ZSIsInJlYnVpbGQiLCJyZXBsYWNlIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUFFTyxTQUFTQSxrQkFBVCxHQUE4QjtBQUNuQyxT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QUFDQVUsSUFBQUEsSUFBSSxDQUFDRixPQUFELEVBQVMsY0FBY3dDLE9BQXZCLENBQUo7O0FBRUEsUUFBSUQsZUFBZSxJQUFJeEMsSUFBSSxDQUFDUCxZQUF4QixJQUF3Q2dELE9BQTVDLEVBQXFEO0FBQ25EekMsTUFBQUEsSUFBSSxDQUFDZ0QsT0FBTCxHQUFlLElBQWY7QUFDQWhDLE1BQUFBLEdBQUcsQ0FBQ2lCLEdBQUcsR0FBRywwQkFBTixHQUFtQ0MsTUFBTSxDQUFDZSxPQUFQLENBQWUzRCxPQUFPLENBQUNELEdBQVIsRUFBZixFQUE4QixFQUE5QixDQUFwQyxDQUFIO0FBQ0QsS0FIRCxNQUlLO0FBQ0hXLE1BQUFBLElBQUksQ0FBQ2dELE9BQUwsR0FBZSxLQUFmO0FBQ0Q7O0FBQ0RoRCxJQUFBQSxJQUFJLENBQUNQLFlBQUwsR0FBb0IrQyxlQUFwQjtBQUNELEdBNUNELENBNkNBLE9BQU0xQixDQUFOLEVBQVM7QUFDUEMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlGLENBQVo7QUFDQWYsSUFBQUEsV0FBVyxDQUFDa0IsTUFBWixDQUFtQkMsSUFBbkIsQ0FBd0IsdUJBQXVCSixDQUEvQztBQUNEO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsaWRhdGVPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICBcImZyYW1ld29ya1wiOiAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJwb3J0XCI6ICAgICAgICB7XCJ0eXBlXCI6IFsgXCJpbnRlZ2VyXCIgXX0sXG4gICAgICBcImVtaXRcIjogICAgICAgIHtcInR5cGVcIjogWyBcImJvb2xlYW5cIiBdfSxcbiAgICAgIFwiYnJvd3NlclwiOiAgICAge1widHlwZVwiOiBbIFwiYm9vbGVhblwiIF19LFxuICAgICAgXCJ3YXRjaFwiOiAgICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwicHJvZmlsZVwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ2ZXJib3NlXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfVxuICAgIH0sXG4gICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICAgIC8vIFwiZXJyb3JNZXNzYWdlXCI6IHtcbiAgICAvLyAgIFwib3B0aW9uXCI6IFwic2hvdWxkIGJlIHtCb29sZWFufSAoaHR0cHM6L2dpdGh1Yi5jb20vb3JnL3JlcG8jYW5jaG9yKVwiXG4gICAgLy8gfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0T3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBwb3J0OiAxOTYyLFxuICAgIGVtaXQ6IHRydWUsXG4gICAgYnJvd3NlcjogdHJ1ZSxcbiAgICB3YXRjaDogJ3llcycsXG4gICAgcHJvZmlsZTogJ2Rlc2t0b3AnLCBcbiAgICBlbnZpcm9ubWVudDogJ2RldmVsb3BtZW50JywgXG4gICAgdmVyYm9zZTogJ25vJ1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0VmFycygpIHtcbiAgcmV0dXJuIHtcbiAgICBmaXJzdFRpbWUgOiB0cnVlLFxuICAgIGJyb3dzZXJDb3VudCA6IDAsXG4gICAgY3dkOiBwcm9jZXNzLmN3ZCgpLFxuICAgIGV4dFBhdGg6ICcuJyxcbiAgICBwbHVnaW5FcnJvcnM6IFtdLFxuICAgIGxhc3ROdW1GaWxlczogMCxcbiAgICBsYXN0TWlsbGlzZWNvbmRzOiAwLFxuICAgIGxhc3RNaWxsaXNlY29uZHNBcHBKc29uOiAwLFxuICAgIGZpbGVzOiBbJy4vYXBwLmpzb24nXSxcbiAgICBkaXJzOiBbJy4vYXBwJywnLi9wYWNrYWdlcyddXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIGV4dC1hZnRlci1jb21waWxlJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgbGV0IHsgZmlsZXMsIGRpcnMgfSA9IHZhcnNcbiAgICBjb25zdCB7IGN3ZCB9ID0gdmFyc1xuICAgIGZpbGVzID0gdHlwZW9mIGZpbGVzID09PSAnc3RyaW5nJyA/IFtmaWxlc10gOiBmaWxlc1xuICAgIGRpcnMgPSB0eXBlb2YgZGlycyA9PT0gJ3N0cmluZycgPyBbZGlyc10gOiBkaXJzXG4gICAgY29uc3Qge1xuICAgICAgZmlsZURlcGVuZGVuY2llcyxcbiAgICAgIGNvbnRleHREZXBlbmRlbmNpZXMsXG4gICAgfSA9IF9nZXRGaWxlQW5kQ29udGV4dERlcHMoY29tcGlsYXRpb24sIGZpbGVzLCBkaXJzLCBjd2QsIG9wdGlvbnMpO1xuICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBmaWxlRGVwZW5kZW5jaWVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgY29tcGlsYXRpb24uZmlsZURlcGVuZGVuY2llcy5hZGQocGF0aC5yZXNvbHZlKGZpbGUpKTtcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChkaXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnRleHREZXBlbmRlbmNpZXMuZm9yRWFjaCgoY29udGV4dCkgPT4ge1xuICAgICAgICBjb21waWxhdGlvbi5jb250ZXh0RGVwZW5kZW5jaWVzLmFkZChjb250ZXh0KTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfYWZ0ZXJDb21waWxlOiAnICsgZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0RmlsZUFuZENvbnRleHREZXBzKGNvbXBpbGF0aW9uLCBmaWxlcywgZGlycywgY3dkLCBvcHRpb25zKSB7XG4gIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX2dldEZpbGVBbmRDb250ZXh0RGVwcycpXG4gIGNvbnN0IHVuaXEgPSByZXF1aXJlKCdsb2Rhc2gudW5pcScpXG4gIGNvbnN0IGlzR2xvYiA9IHJlcXVpcmUoJ2lzLWdsb2InKVxuXG4gIGNvbnN0IHsgZmlsZURlcGVuZGVuY2llcywgY29udGV4dERlcGVuZGVuY2llcyB9ID0gY29tcGlsYXRpb247XG4gIGNvbnN0IGlzV2VicGFjazQgPSBjb21waWxhdGlvbi5ob29rcztcbiAgbGV0IGZkcyA9IGlzV2VicGFjazQgPyBbLi4uZmlsZURlcGVuZGVuY2llc10gOiBmaWxlRGVwZW5kZW5jaWVzO1xuICBsZXQgY2RzID0gaXNXZWJwYWNrNCA/IFsuLi5jb250ZXh0RGVwZW5kZW5jaWVzXSA6IGNvbnRleHREZXBlbmRlbmNpZXM7XG4gIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgZmlsZXMuZm9yRWFjaCgocGF0dGVybikgPT4ge1xuICAgICAgbGV0IGYgPSBwYXR0ZXJuXG4gICAgICBpZiAoaXNHbG9iKHBhdHRlcm4pKSB7XG4gICAgICAgIGYgPSBnbG9iLnN5bmMocGF0dGVybiwgeyBjd2QsIGRvdDogdHJ1ZSwgYWJzb2x1dGU6IHRydWUgfSlcbiAgICAgIH1cbiAgICAgIGZkcyA9IGZkcy5jb25jYXQoZilcbiAgICB9KVxuICAgIGZkcyA9IHVuaXEoZmRzKVxuICB9XG4gIGlmIChkaXJzLmxlbmd0aCA+IDApIHtcbiAgICBjZHMgPSB1bmlxKGNkcy5jb25jYXQoZGlycykpXG4gIH1cbiAgcmV0dXJuIHsgZmlsZURlcGVuZGVuY2llczogZmRzLCBjb250ZXh0RGVwZW5kZW5jaWVzOiBjZHMgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dCwgY29tcGlsYXRpb24pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICAgIGxvZ3Yob3B0aW9ucywnX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgcmVjdXJzaXZlUmVhZFN5bmMgPSByZXF1aXJlKCdyZWN1cnNpdmUtcmVhZGRpci1zeW5jJylcbiAgICB2YXIgd2F0Y2hlZEZpbGVzPVtdXG4gICAgdHJ5IHt3YXRjaGVkRmlsZXMgPSByZWN1cnNpdmVSZWFkU3luYygnLi9hcHAnKS5jb25jYXQocmVjdXJzaXZlUmVhZFN5bmMoJy4vcGFja2FnZXMnKSl9XG4gICAgY2F0Y2goZXJyKSB7aWYoZXJyLmVycm5vID09PSAzNCl7Y29uc29sZS5sb2coJ1BhdGggZG9lcyBub3QgZXhpc3QnKTt9IGVsc2Uge3Rocm93IGVycjt9fVxuICAgIHZhciBjdXJyZW50TnVtRmlsZXMgPSB3YXRjaGVkRmlsZXMubGVuZ3RoXG4gICAgbG9ndihvcHRpb25zLCd3YXRjaGVkRmlsZXM6ICcgKyBjdXJyZW50TnVtRmlsZXMpXG4gICAgdmFyIGRvQnVpbGQgPSB0cnVlXG5cbiAgICAvLyB2YXIgZG9CdWlsZCA9IGZhbHNlXG4gICAgLy8gZm9yICh2YXIgZmlsZSBpbiB3YXRjaGVkRmlsZXMpIHtcbiAgICAvLyAgIGlmICh2YXJzLmxhc3RNaWxsaXNlY29uZHMgPCBmcy5zdGF0U3luYyh3YXRjaGVkRmlsZXNbZmlsZV0pLm10aW1lTXMpIHtcbiAgICAvLyAgICAgaWYgKHdhdGNoZWRGaWxlc1tmaWxlXS5pbmRleE9mKFwic2Nzc1wiKSAhPSAtMSkge2RvQnVpbGQ9dHJ1ZTticmVhazt9XG4gICAgLy8gICB9XG4gICAgLy8gfVxuICAgIC8vIGlmICh2YXJzLmxhc3RNaWxsaXNlY29uZHMgPCBmcy5zdGF0U3luYygnLi9hcHAuanNvbicpLm10aW1lTXMpIHtcbiAgICAvLyAgIGRvQnVpbGQ9dHJ1ZVxuICAgIC8vIH1cbiAgICBcbiAgICBsb2d2KG9wdGlvbnMsJ2RvQnVpbGQ6ICcgKyBkb0J1aWxkKVxuXG4gICAgdmFycy5sYXN0TWlsbGlzZWNvbmRzID0gKG5ldyBEYXRlKS5nZXRUaW1lKClcbiAgICB2YXIgZmlsZXNvdXJjZSA9ICd0aGlzIGZpbGUgZW5hYmxlcyBjbGllbnQgcmVsb2FkJ1xuICAgIGNvbXBpbGF0aW9uLmFzc2V0c1tjdXJyZW50TnVtRmlsZXMgKyAnRmlsZXNVbmRlckFwcEZvbGRlci5tZCddID0ge1xuICAgICAgc291cmNlOiBmdW5jdGlvbigpIHtyZXR1cm4gZmlsZXNvdXJjZX0sXG4gICAgICBzaXplOiBmdW5jdGlvbigpIHtyZXR1cm4gZmlsZXNvdXJjZS5sZW5ndGh9XG4gICAgfVxuXG4gICAgbG9ndihvcHRpb25zLCdjdXJyZW50TnVtRmlsZXM6ICcgKyBjdXJyZW50TnVtRmlsZXMpXG4gICAgbG9ndihvcHRpb25zLCd2YXJzLmxhc3ROdW1GaWxlczogJyArIHZhcnMubGFzdE51bUZpbGVzKVxuICAgIGxvZ3Yob3B0aW9ucywnZG9CdWlsZDogJyArIGRvQnVpbGQpXG5cbiAgICBpZiAoY3VycmVudE51bUZpbGVzICE9IHZhcnMubGFzdE51bUZpbGVzIHx8IGRvQnVpbGQpIHtcbiAgICAgIHZhcnMucmVidWlsZCA9IHRydWVcbiAgICAgIGxvZyhhcHAgKyAnYnVpbGRpbmcgRXh0IGJ1bmRsZSBhdDogJyArIG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLnJlYnVpbGQgPSBmYWxzZVxuICAgIH1cbiAgICB2YXJzLmxhc3ROdW1GaWxlcyA9IGN1cnJlbnROdW1GaWxlc1xuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfcHJlcGFyZUZvckJ1aWxkOiAnICsgZSlcbiAgfVxufVxuIl19