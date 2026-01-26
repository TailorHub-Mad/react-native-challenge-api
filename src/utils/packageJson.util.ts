import fs from 'fs';
import path from 'path';

type PackageJson = {
	name?: string;
	version?: string;
};

const packageJsonPath = path.join(process.cwd(), 'package.json');

const loadPackageJson = (): PackageJson => {
	try {
		const raw = fs.readFileSync(packageJsonPath, 'utf8');
		return JSON.parse(raw) as PackageJson;
	} catch {
		return {};
	}
};

export const packageJson = loadPackageJson();
