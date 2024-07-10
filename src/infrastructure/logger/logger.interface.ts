export default interface LoggerInterface {
  emergency(message: any, ...optionalParams: any[]);
  alert(message: any, ...optionalParams: any[]);
  critical(message: any, ...optionalParams: any[]);
  error(message: any, ...optionalParams: any[]);
  warning(message: any, ...optionalParams: any[]);
  notice(message: any, ...optionalParams: any[]);
  info(message: any, ...optionalParams: any[]);

  debug?(message: any, ...optionalParams: any[]);
}
