create schema test_schema;

create table test_schema.test_table (
  id serial primary key,
  done boolean not null default false,
  task text not null,
  due timestamptz
);

insert into test_schema.test_table (task) values
  ('this is test task 1'), ('this is test task 2');

create role web_anon nologin;

grant usage on schema test_schema to web_anon;
grant usage on schema public to web_anon;
grant select on test_schema.test_table to web_anon;
grant select on public.customers to web_anon;