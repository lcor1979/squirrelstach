/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  // map tells the System loader where to look for things
  var map = {
    'app':                        'app', // 'dist',
    '@angular':                   'node_modules/@angular',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs':                       'node_modules/rxjs',
    'underscore': 'node_modules/underscore',
    'underscore.string': 'node_modules/underscore.string/dist',
    'angular2-localstorage': 'node_modules/angular2-localstorage',
    'materialize': 'node_modules/angular2-materialize',
    'angular2-materialize': 'node_modules/angular2-materialize',
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js'},
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
    'underscore': { main: 'underscore-min.js',  defaultExtension: 'js'},
    'underscore.string': { main: 'underscore.string.min.js',  defaultExtension: 'js'},
    'angular2-localstorage': { defaultExtension: 'js'},
    'materialize': { main: 'dist/materialize-directive', defaultExtension: 'js'},
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];
  // Add package entries for angular packages
  ngPackageNames.forEach(function(pkgName) {
    packages['@angular/'+pkgName] = { main: pkgName + '.umd.js', defaultExtension: 'js' };
  });
  var config = {
    map: map,
    packages: packages
  }
  System.config(config);
})(this);
