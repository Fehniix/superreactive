import { expect } from 'chai';
import { reactive } from '../lib/ReactiveDecorator';
import Endpoint2 from './Endpoint2';

type MyTestProp = {
	num: number
	word: string
}

class TestClass {
	@reactive('testProp')
	public reactiveEP1!: MyTestProp;

	@reactive('testProp', Endpoint2.srInstance)
	public reactiveEP2!: MyTestProp;
}

describe('ReactiveDecorator', function() {
	context('Given a reactive property', function() {
		let testClass: TestClass;

		this.beforeAll(() => {
			testClass = new TestClass();
			testClass.reactiveEP1 = {
				num: 0,
				word: "a"
			};
		});

		context('When updated on EP1', function() {
			it('should correctly update on EP2 as well', async function() {
				testClass.reactiveEP1.num = 1;

				await new Promise(r => setTimeout(r, 400));

				expect(testClass.reactiveEP2?.num).to.equal(1);
			});
		});
	});
});