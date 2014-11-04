var fs = require('fs');
var maven = require('maven-deploy');
var pkg = require('./package');

/**
 * Special legacy deployment required to publish to maven repos.
 * Usage:
 * 		node legacyDeploy.js true | false
 *
 * It will deploy the artifact to either a release or snapshot repo.
 **/
var isSnapshot = pkg.version.indexOf('SNAPSHOT') != -1;
if (process.argv[2]) {
	isSnapshot = (process.argv[2] === 'true') ? true : false;
}
var repoPostfix = (isSnapshot) ? 'snapshot' : 'release';

var fileName = pkg.name + '-' + pkg.version;
console.log('Creating legacy artifact in ' + __dirname + '/dist/' + fileName + '.war');
var config = {
    'groupId': 'no.finntech',
    'buildDir': __dirname + '/dist/' + fileName + '/',
    'type': 'war',
    'finalName': fileName,
    'snapshot': isSnapshot,
    'repositories': [
        {
            'id': 'finntech-internal-' + repoPostfix,
            'url': 'http://mavenproxy.finntech.no/finntech-internal-'+ repoPostfix + '/'
        }
    ]
};
maven.config(config);

if (isSnapshot) {
    maven.deploy('finntech-internal-' + repoPostfix, true);
} else {
    maven.deploy('finntech-internal-' + repoPostfix);
}
console.log('Done, enjoy!');
