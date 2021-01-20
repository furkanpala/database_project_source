import os
import sys

import psycopg2 as dbapi2


def read_sql_file(filename):
    path = os.path.join("sql", filename)
    with open(path, "r") as file:
        context = file.read()
        context = context.split(";")
        context = [statement + ";" for statement in context]
        return context


def initialize(url):
    try:
        with dbapi2.connect(url) as connection:
            with connection.cursor() as cursor:
                print("Connected...", file=sys.stderr)

                create_statements = read_sql_file('create_statements.sql')
                for i in range(0, len(create_statements) - 1):
                    print(create_statements[i])
                    cursor.execute(create_statements[i])
                print("Create tables...", file=sys.stderr)

    except (Exception, dbapi2.Error) as error:
        print("Error while connecting to PostgreSQL: {}".format(
            error), file=sys.stderr)

    finally:
        if connection:
            cursor.close()
            connection.close()


if __name__ == "__main__":
    url = os.getenv("PSQL_DB_URL")
    if url is None:
        print("Usage: DATABASE_URL=url python dbinit.py", file=sys.stderr)
        sys.exit(1)
    initialize(url)
