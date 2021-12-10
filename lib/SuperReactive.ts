import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import Redis from './Redis';

import _debug from 'debug';
const debug = _debug('superreactive:main');
const debugAccess = _debug('superreactive:access');

/**
 * Allows for inter-container variable states seamless synchronization.
 */
export class SuperReactive {
	/**
	 * Contains Object and primitives references mapped by namespace/name
	 */
	private reactiveReferences: Map<string, any>;

	/**
	 * The current BullMQ name.
	 */
	private queueName!: string;

	/**
	 * The remote BullMQ name.
	 */
	private remoteQueueName!: string;

	/**
	 * The reusable IORedis connection.
	 */
	private redisInstance!: IORedis.Redis;

	private bmqQueue!: Queue;
	private bmqWorker!: Worker;

	/**
	 * Whether the `SuperReactive` service is currently active or not.
	 */
	private active: boolean = false;

	public constructor() {
		this.reactiveReferences = new Map<string, any>();
	}

	/**
	 * Starts the `SuperReactive` service.
	 * 
	 * `endpointName` and `remoteEndpointName` must be cross-matching in order for variables to be correctly synchronized.
	 * @abstract If the current process running an instance of `SuperReactive` is named "endpoint1", `remoteEndpointName` on the remote endpoint **must** be "endpoint1".
	 * @param endpointName The **unique** identifier for the current endpoint.
	 * @param remoteEndpointName The **unique** identifier for the remote endpoint.
	 * @param redis `SuperReactive` takes advantage of `IORedis` to manage synchronization. Can be either an instance of `ioredis.Redis` or the connection URL.
	 */
	public start(redis: IORedis.Redis | string, config: SuperReactiveConfiguration): void {
		this.redisInstance 		= Redis.createConnection(redis);

		this.active 			= true;
		this.queueName 			= config.localEndpointName;
		this.remoteQueueName 	= config.remoteEndpointName;

		this.bmqQueue = new Queue<ReactiveJob>(config.remoteEndpointName, {
			connection: this.redisInstance
		});

		this.bmqWorker = new Worker<ReactiveJob, void>(config.localEndpointName, this.process.bind(this), {
			connection: this.redisInstance.duplicate()
		});

		debug(`Started local worker: ${config.localEndpointName}`);
		debug(`Started remote queue: ${config.remoteEndpointName}`);
	}

	/**
	 * Processes the incoming jobs, storing the incoming value to its corresponding reference.
	 */
	private async process(job: Job<ReactiveJob>): Promise<void> {
		debugAccess(`[${this.localEndpointName}] [REMOTE] ${job.data.identifier}, new value: %o`, job.data.value);
		this.reactiveReferences.set(job.data.identifier, job.data.value);
	}

	/**
	 * Returns the value associated with the given identifier.
	 */
	public getValueFor(identifier: string): any | undefined {
		return this.reactiveReferences.get(identifier);
	}

	/**
	 * Given the reference identifier, sets its value and enqueues a Job to signal change to the remote endpoint.
	 */
	public setValueFor(identifier: string, value: any): void {
		this.reactiveReferences.set(identifier, value);

		this.bmqQueue.add(identifier, {
			identifier: identifier,
			value: value
		});
	}

	/**
	 * Returns the name of the internal queue.
	 */
	public get localEndpointName(): string {
		return this.queueName;
	}

	/**
	 * Returns the name of the internal worker name.
	 */
	public get remoteEndpointName(): string {
		return this.remoteQueueName;
	}

	/**
	 * Determines whether the `SuperReactive` service is currently up and running or not.
	 */
	public isEnabled(): boolean {
		return this.active;
	}
}

/**
 * A job that contains the identifier/value pair for an instance reference.
 */
interface ReactiveJob {
	/**
	 * The unique identifier for the reference
	 */
	identifier: string

	/**
	 * The value associated with the identifier
	 */
	value: any
}

/**
 * Describes an object that configures SuperReactive at startup.
 */
export interface SuperReactiveConfiguration {
	/**
	 * The **unique** identifier for the current endpoint.
	*/
	localEndpointName: string,

	/**
	 * The **unique** identifier for the remote endpoint.
	 */
	remoteEndpointName: string
}

export default new SuperReactive();