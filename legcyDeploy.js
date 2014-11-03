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
var config = {

	'groupId': 'no.finntech',
	'buildDir': __dirname + '/dist/' + pkg.name + '-' + pkg.version + '/',
	'type': 'war',
	'finalName': pkg.name + '-' + pkg.version,
	'snapshot': isSnapshot,
	'repositories': [
		{
			'id': 'finntech-internal-' + repoPostfix,
			'url': 'http://mavenproxy.finntech.no/finntech-internal-'+ repoPostfix + '/'
		}
	]
};

if (isSnapshot) {
	maven.deploy('finntech-internal-' + repoPostfix, true);
} else {
	maven.deploy('finntech-internal-' + repoPostfix);
}
