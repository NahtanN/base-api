/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(`
create table users
(
id                  serial primary key,
user_id             uuid unique                       default gen_random_uuid(),
name                varchar(255)             not null,
email               varchar(100) unique      not null,
email_authenticated boolean                           default false,
password            varchar(200)             not null,
features            varchar[]                         default '{}',
accepted_at         timestamp with time zone not null default (current_timestamp at time zone 'utc'),
created_at          timestamp with time zone not null default (current_timestamp at time zone 'utc'),
updated_at          timestamp with time zone not null default (current_timestamp at time zone 'utc'),
deleted_at          timestamp with time zone
)
`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("users");
};
