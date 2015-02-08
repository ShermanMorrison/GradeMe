DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS test;
DROP TABLE IF EXISTS professor2grader;
DROP TABLE IF EXISTS grader2question;

CREATE TABLE person (
  firstName TEXT,
  lastName TEXT,
  username TEXT PRIMARY KEY UNIQUE,
  password TEXT,
  grader INTEGER
);

CREATE TABLE test (
  tId INTEGER PRIMARY KEY UNIQUE,
  name TEXT,
  professor TEXT,
  qPerPage INTEGER,
  qTotal INTEGER
);

CREATE TABLE professor2grader (
  professor TEXT,
  grader TEXT,
  PRIMARY KEY(professor, grader)
);

CREATE TABLE grader2question (
  username TEXT,
  tId INTEGER,
  question INTEGER,
  PRIMARY KEY(tId, question)
);

CREATE TABLE page (
  uuid TEXT PRIMARY KEY,
  professor TEXT,
  tId INTEGER,
  pageNum INTEGER
)