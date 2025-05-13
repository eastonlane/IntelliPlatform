import DbLoader from '@dal';
import { env } from '$env/dynamic/private';

export const dbLoader = new DbLoader(env.VITE_DATABASE_URL);