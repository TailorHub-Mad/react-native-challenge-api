import '../src/@types/index.d';
import { Logger } from 'winston';

const globalWithLogger = global as typeof globalThis & { logger: Logger };

globalWithLogger.logger = {} as Logger;
globalWithLogger.logger.error = jest.fn();
globalWithLogger.logger.warn = jest.fn();
globalWithLogger.logger.info = jest.fn();
globalWithLogger.logger.http = jest.fn();
globalWithLogger.logger.debug = jest.fn();
