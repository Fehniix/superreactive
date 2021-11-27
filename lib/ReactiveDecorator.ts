import SuperReactive from "./SuperReactive";

import _debug from 'debug';
const debug = _debug('superreactive');

/**
 * Allows the decorated property to react to remote changes and broadcast changes to all remote location references.
 * @param identifier The unique identifier associated to the property. This value needs to be matched by all remote locations to be correctly updated. If not provided, defaults to the property name.
 */
export function reactive(identifier?: string) {
	return (target: any, propertyKey: PropertyKey) => {
		let currentValue = target[propertyKey];

		const descriptor = {
			get: () => {
				if (!SuperReactive.isEnabled())
					return currentValue;

				const id: string = identifier ?? propertyKey.toString();

				debug(`Property with identifier ${id} read, with value: ${SuperReactive.getValueFor(id)}`);

				return SuperReactive.getValueFor(id);
			},
			set: (newValue: any) => {
				if (!SuperReactive.isEnabled()) {
					currentValue = newValue;
					return;
				}

				const id: string = identifier ?? propertyKey.toString();
				
				debug(`Setting new value for property with identifier ${id}, new value: ${SuperReactive.getValueFor(id)}`);
				
				SuperReactive.setValueFor(id, newValue);
			}
		}

		Object.defineProperty(target, propertyKey, descriptor);
	}
};