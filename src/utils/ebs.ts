import jwt from 'jsonwebtoken';
import { env } from '../env/server.mjs';

export function getEbsToken(userId: string): string {
    return jwt.sign({ exp: Date.now() + 86400, role: 'external', user_id: userId }, Buffer.from(env.TWITCH_EXTENSION_SECRET, 'base64'))
}