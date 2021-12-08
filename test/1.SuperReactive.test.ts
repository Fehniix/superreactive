import { expect } from 'chai';
import SuperReactive from '../lib/SuperReactive';
import Endpoint2 from './Endpoint2';

describe('SuperReactive Setup', function() {
	describe('Endpoints', function() {
		it('should be correctly up and running', function() {
			SuperReactive.start('ep1', 'ep2', process.env.REDIS_URL!);
			Endpoint2.srInstance.start('ep2', 'ep1', process.env.REDIS_URL!);

			expect(SuperReactive.isEnabled()).to.be.true;
			expect(Endpoint2.srInstance.isEnabled()).to.be.true;
		});
	});
});