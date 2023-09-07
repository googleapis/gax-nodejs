"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const TSCONFIG_DATA = {
    include: ['src/**/*.ts'],
    exclude: ['src/**/*.spec.ts']
};
function safeReadJSON(path, tree) {
    try {
        return JSON.parse(tree.read(path).toString());
    }
    catch (e) {
        throw new schematics_1.SchematicsException(`Error when parsing ${path}: ${e.message}`);
    }
}
function ngAdd() {
    return (tree, context) => {
        const tsconfigDocFile = 'tsconfig.doc.json';
        if (!tree.exists(tsconfigDocFile)) {
            tree.create(tsconfigDocFile, JSON.stringify(TSCONFIG_DATA));
        }
        const packageJsonFile = 'package.json';
        const packageJson = tree.exists(packageJsonFile) && safeReadJSON(packageJsonFile, tree);
        if (packageJson === undefined) {
            throw new schematics_1.SchematicsException('Could not locate package.json');
        }
        let packageScripts = {};
        if (packageJson['scripts']) {
            packageScripts = packageJson['scripts'];
        }
        else {
            packageScripts = {};
        }
        if (packageScripts) {
            packageScripts['compodoc:build'] = 'compodoc -p tsconfig.doc.json';
            packageScripts['compodoc:build-and-serve'] = 'compodoc -p tsconfig.doc.json -s';
            packageScripts['compodoc:serve'] = 'compodoc -s';
        }
        if (tree.exists(packageJsonFile)) {
            tree.overwrite(packageJsonFile, JSON.stringify(packageJson, null, 2));
        }
        else {
            tree.create(packageJsonFile, JSON.stringify(packageJson, null, 2));
        }
        context.addTask(new tasks_1.NodePackageInstallTask());
        return tree;
    };
}
exports.ngAdd = ngAdd;
