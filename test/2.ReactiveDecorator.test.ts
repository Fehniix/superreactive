import { expect } from 'chai';
import { reactive } from '../lib/ReactiveDecorator';
import Endpoint2 from './Endpoint2';

class PropWrapperEP1 {
	@reactive('string')
	public _string!: string;

	@reactive('number')
	public _number!: number;

	@reactive('boolean')
	public _boolean!: boolean;

	@reactive('any')
	public _any!: any;
}

class PropWrapperEP2 {
	@reactive('string', Endpoint2.srInstance)
	public _string!: string;

	@reactive('number', Endpoint2.srInstance)
	public _number!: number;

	@reactive('boolean', Endpoint2.srInstance)
	public _boolean!: boolean;

	@reactive('any', Endpoint2.srInstance)
	public _any!: any;
}

async function sleep(ms: number): Promise<void> {
	return new Promise(r => setTimeout(r, ms));
}

describe('ReactiveDecorator', function() {
	let ep1: PropWrapperEP1;
	let ep2: PropWrapperEP2;

	this.beforeAll(() => {
		ep1 = new PropWrapperEP1();
		ep2 = new PropWrapperEP2();
	});

	describe('Given a string property on EP1', function() {
		context('When first instantiated', function() {
			it('should be correctly updated on EP2 as well', async function() {
				ep1._string = 'a';

				await sleep(600);

				expect(ep2._string).to.equal('a');
			});
		});

		context('When casually updated with the += operator', function() {
			it('the change should be correctly implemented over on EP2 as well', async function() {
				ep1._string += 'b';

				await sleep(400);

				expect(ep2._string).to.equal('ab');
			});
		});
	});
});