import SuperReactiveDefault, { SuperReactive } from "./SuperReactive";

import _debug from 'debug';
const debug = _debug('superreactive:access');

/**
 * Allows the decorated property **of primitive type** to react to remote changes and broadcast changes to all remote location references.
 * @param identifier The unique identifier associated to the property. This value needs to be matched by all remote locations to be correctly updated. If not provided, defaults to the property name.
 * @param superReactive The `SuperReactive` instance to use against value updates and access. Useful when the `SuperReactive` instance is user-managed.
 */
export function reactive(identifier?: string, superReactive?: SuperReactive) {
	return (target: any, propertyKey: PropertyKey) => {
		let currentValue = target[propertyKey];

		// This is the property descriptor of the object that is being decorated.
		// It is useful for defining a good variety of different properties, such as iterability.
		// This concept is hereby leveraged to decorate access to the object, delegating content management to SuperReactive.
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

				debug(`[${instance.localEndpointName}] [READ] ${id}, value: %o`, instance.getValueFor(id));

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
	
				debug(`[${instance.localEndpointName}] [WRITE] ${id}, new value: %o`, newValue);
				
				instance.setValueFor(id, newValue);
			}
		}

		Object.defineProperty(target, propertyKey, descriptor);
	}
};