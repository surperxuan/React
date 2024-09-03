import fs from 'fs';
import path from 'path';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

// 包路径
const pkgPath = path.resolve(__dirname, '../../packages');
// 打包产物路径
const distPath = path.resolve(__dirname, '../../dist/node_modules');

// 解析包的路径 isDist是否是产物路径
export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgPath}/${pkgName}`;
}

// 解析包的package.json文件
export function getPackageJSON(pkgName) {
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(str);
}

export function getBaseRollupPlugins({ typescript = {} } = {}) {
	return [cjs(), ts(typescript)];
}
