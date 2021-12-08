import dotenv from 'dotenv';

dotenv.config();

export const mochaHooks = {
	async afterAll() {
		setTimeout(() => { process.exit(); }, 200);
	}
}