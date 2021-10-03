import pkg from "winston"
const { createLogger, format, transports } = pkg


export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
    defaultMeta: { service: 'jeeves-app-api' },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
            ),
        }),
        new transports.File({
            filename: 'quick-start-error.log',
            level: 'info',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.errors({ stack: true }),
                format.splat(),
                format.json(),
            )
        })
    ]
})