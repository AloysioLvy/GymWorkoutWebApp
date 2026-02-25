import { Queue } from 'bullmq';

export const WORKOUT_QUEUE_NAME = 'workout-generation';

export const workoutQueue = new Queue(WORKOUT_QUEUE_NAME, {
  connection: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5s → 10s → 20s
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});
