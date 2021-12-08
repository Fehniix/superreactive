import SuperReactiveDefault, { SuperReactive } from "./SuperReactive";

import _debug from 'debug';
const debug = _debug('superreactive:access');

/**
 * Allows the decorated property to react to remote changes and broadcast changes to all remote location references.
 * @param identifier The unique identifier associated to the property. This value needs to be matched by all remote locations to be correctly updated. If not provided, defaults to the property name.
 * @param superReactive The `SuperReactive` instance to use against value updates and access. Useful when the `SuperReactive` instance is user-managed.
 */
export function reactive(identifier?: string, superReactive?: SuperReactive) {
	return (target: any, propertyKey: PropertyKey) => {
		let currentValue = target[propertyKey];

		const descriptor = {
			get: () => {
				let instance: SuperReactive;

				if (superReactive !== undefined)
					instance = superReactive;
				else
					instance = SuperReactiveDefault

				if (!instance.isEnabled())
					return currentValue;

				const id: string = identifier ?? propertyKey.toString();

				debug(`[READ] ${id}, value: %o`, instance.getValueFor(id));

				return instance.getValueFor(id);
			},
			set: (newValue: any) => {
				let instance: SuperReactive;

				if (superReactive !== undefined)
					instance = superReactive;
				else
					instance = SuperReactiveDefault

				if (!instance.isEnabled()) {
					currentValue = newValue;
					return;
				}

				const id: string = identifier ?? propertyKey.toString();
				
				debug(`[WRITE] ${id}, new value: %o`, newValue);
				
				instance.setValueFor(id, newValue);
			}
		}

		Object.defineProperty(target, propertyKey, descriptor);
	}
};