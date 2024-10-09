// Define the Logging Levels
export enum LogLevel {
    LOG = "LOG",
    ERROR = "ERROR",
    WARN = "WARN",
    INFO = "INFO"
}

const formatMessage = (level: LogLevel, messsage: string): string => {
    return `[${level}] ${new Date().toISOString()}: ${messsage}`;
};

export const log = <T>(message: T):void => {
    console.log(formatMessage(LogLevel.LOG, JSON.stringify(message)));
};

export const error = <T>(message: T):void => {
    console.error(formatMessage(LogLevel.ERROR, JSON.stringify(message)));
};

export const warn = <T>(message: T):void => {
    console.warn(formatMessage(LogLevel.WARN, JSON.stringify(message)));
};

export const info = <T>(message: T):void => {
    console.info(formatMessage(LogLevel.INFO, JSON.stringify(message)));
};