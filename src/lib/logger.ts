import pino from 'pino'

const logger = pino(
  process.env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }
    : undefined,
)

/**
 * ONLY USE SERVER-SIDE. DO NOT IMPORT INTO CLIENT-SIDE CODE.
 */
export function getLogger(context: string) {
  return logger.child({ context })
}
