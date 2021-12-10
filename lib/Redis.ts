import IORedis from 'ioredis';

class Redis {
	/**
	 * The Redis connection object.
	 */
	private redisConnection?: IORedis.Redis;

	/**
	 * Creates an ioredis connection to the remote ioredis instance.
	 * @param redis Can be either an instance of `ioredis.Redis` or the connection URL.
	 * @returns A duplicated `ioredis.Redis` connection object.
	 */
	public createConnection(redis: IORedis.Redis | string): IORedis.Redis {
		if (typeof redis === 'string')
			this.redisConnection = new IORedis(redis, {
				maxRetriesPerRequest: null,
				enableReadyCheck: false
			});
		else
			this.redisConnection = redis;

		return this.redisConnection.duplicate();
	}
}

export default new Redis();