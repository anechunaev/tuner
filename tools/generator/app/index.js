'use strict';

const Generator = require('yeoman-generator');
const path = require('path');

class TunerPackageGenerator extends Generator {
	paths() {
		this.sourceRoot(path.resolve(__dirname, '../templates'));
		this.destinationRoot(path.resolve(this.contextRoot, './packages'));
	}

	async prompting() {
		this.answers = await this.prompt(
			[
				{
					type: 'input',
					name: 'name',
					message: 'Package name: `@tuner/<NAME>`',
					default: "unnamed"
				},
				{
					type: 'input',
					name: 'description',
					message: 'Package description',
					default: ""
				},
			],
		);
	}

	writing() {
		this.log(this.answers.name);
		this.log(this.answers.description);

		this.fs.copyTpl(
			this.templatePath('_package.json'),
			this.destinationPath(`${this.answers.name}/package.json`),
			{
				name: this.answers.name,
				description: this.answers.description,
			}
		);
		this.fs.copyTpl(
			this.templatePath('README.md'),
			this.destinationPath(`${this.answers.name}/README.md`),
			{
				name: this.answers.name,
				description: this.answers.description,
			}
		);
		this.fs.copyTpl(
			this.templatePath('tsconfig.build.json'),
			this.destinationPath(`${this.answers.name}/tsconfig.build.json`),
			{
				name: this.answers.name,
				description: this.answers.description,
			}
		);
		this.fs.copyTpl(
			this.templatePath('src/index.ts'),
			this.destinationPath(`${this.answers.name}/src/index.ts`),
			{
				name: this.answers.name,
				description: this.answers.description,
			}
		);
	}
}

module.exports = TunerPackageGenerator;
