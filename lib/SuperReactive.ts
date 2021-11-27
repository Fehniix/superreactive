import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

/**
 * Allows for inter-container variable states seamless synchronization.
 */
class SuperReactive {
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
	 * @param ioRedisURL `SuperReactive` takes advantage of `IORedis` to manage synchronization. A URL to the server running a Redis instance has to be provided for `SuperReactive` to work.
	 */
	public start(endpointName: string, remoteEndpointName: string, ioRedisURL: string): void {
		this.active 			= true;
		this.queueName 			= endpointName;
		this.remoteQueueName 	= remoteEndpointName;

		this.bmqQueue = new Queue<ReactiveJob>(remoteEndpointName, {
			connection: new IORedis(ioRedisURL, {
				maxRetriesPerRequest: null,
				enableReadyCheck: false
			})
		});

		this.bmqWorker = new Worker<ReactiveJob, void>(endpointName, this.process.bind(this), {
			connection: new IORedis(ioRedisURL, {
				maxRetriesPerRequest: null,
				enableReadyCheck: false
			})
		});
	}

	/**
	 * Processes the incoming jobs, storing the incoming value to its corresponding reference.
	 */
	private async process(job: Job<ReactiveJob>): Promise<void> {
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

export default new SuperReactive();