export default interface CallbackQueryPgInterface {
  (queryText: string, args: any[]): void;
}
