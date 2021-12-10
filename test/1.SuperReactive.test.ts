import { expect } from 'chai';
import SuperReactive from '../lib/SuperReactive';
import Endpoint2 from './Endpoint2';

describe('SuperReactive Setup', function() {
	describe('Endpoints', function() {
		it('should be correctly up and running', function() {
			SuperReactive.start(process.env.REDIS_URL!, {
				localEndpointName: 'ep1',
				remoteEndpointName: 'ep2'
			});
			Endpoint2.srInstance.start(process.env.REDIS_URL!, {
				localEndpointName: 'ep2',
				remoteEndpointName: 'ep1'
			});

			expect(SuperReactive.isEnabled()).to.be.true;
			expect(Endpoint2.srInstance.isEnabled()).to.be.true;
		});
	});
});