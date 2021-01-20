import psycopg2 as dbapi2
import os
PSQLURL = os.getenv("PSQL_DB_URL")

def search_picture(picture_id):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM picture WHERE (picture_id = %s);",(picture_id,))
        row = cursor.fetchone()

        if row is None:
            return None

        else:
            return {
                "picture_id" : row[0],
                "filename" : row[1],
                "date_created" : row[2]
            }

def search_user(user_id=None, username=None, email=None, phoneNumber=None):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        if user_id is not None:
            cursor.execute("SELECT * FROM app_user WHERE (app_user_id = %s);",(user_id,))
        elif username is not None:
            cursor.execute("SELECT * FROM app_user WHERE (username = %s);",(username,))
        elif email is not None:
            cursor.execute("SELECT * FROM app_user WHERE (email = %s);",(email,))
        else:
            cursor.execute("SELECT * FROM app_user WHERE (phone_number = %s);",(phoneNumber,))

        row = cursor.fetchone()
        cursor.close()
        
        if row is None:
            return None
        
        else:
            user_id = row[0]
            username = row[1]
            password = row[2]
            email = row[3]
            fname = row[4]
            lname = row[5]
            dbPhoneNumber = row[6]
            if dbPhoneNumber is None:
                dbPhoneNumber = ""
            is_phone_number_visible = row[7]
            experience_level = row[8]
            is_admin = row[9]
            date_created = row[10]
            profile_picture_id = row[11]

            profile_picture = None

            if profile_picture_id is not None:
                profile_picture = search_picture(profile_picture_id)

            return {
                "user_id" : user_id,
                "username" : username,
                "password" : password,
                "email" : email,
                "fname" : fname,
                "lname": lname,
                "phoneNumber" : dbPhoneNumber,
                "is_phone_number_visible" : is_phone_number_visible,
                "experience_level":experience_level,
                "is_admin":is_admin,
                "date_created":date_created,
                "profile_picture":profile_picture
            }

def insert_user(username,fname,lname,email,hashed,new_file_id):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        if new_file_id is not None:
            cursor.execute("INSERT INTO app_user (username, first_name, last_name, email, passcode,profile_picture_id) VALUES (%s, %s, %s, %s, %s, %s);",(username,fname,lname,email,hashed,new_file_id))
        else:
            cursor.execute("INSERT INTO app_user (username, first_name, last_name, email, passcode) VALUES (%s, %s, %s, %s, %s);",(username,fname,lname,email,hashed))
        cursor.close()

def update_user(user_id,username,fname,lname,email,phoneNumber,new_profile_picture_id):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        if new_profile_picture_id is not None:
            cursor.execute("UPDATE app_user SET username = %s, first_name = %s, last_name = %s, email = %s, phone_number = %s, profile_picture_id = %s WHERE app_user_id = %s;",(username,fname,lname,email,None if phoneNumber == "" else phoneNumber ,new_profile_picture_id,user_id))
        else:
            cursor.execute("UPDATE app_user SET username = %s, first_name = %s, last_name = %s, email = %s, phone_number = %s WHERE app_user_id = %s;",(username,fname,lname,email,None if phoneNumber == "" else phoneNumber,user_id))

        cursor.close()

def insert_picture(filename, notice_id=None):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        if notice_id is None:
            cursor.execute("INSERT INTO picture (fname) VALUES (%s);",(filename,))
        else:
            cursor.execute("INSERT INTO picture (fname,notice_id) VALUES (%s, %s);",(filename,notice_id))
        cursor.execute("SELECT (picture_id) FROM picture WHERE (fname = %s);",(filename,))
        new_file_id = cursor.fetchone()[0]
        cursor.close()

        return new_file_id

def update_picture(picture_id, filename):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        cursor.execute("UPDATE picture SET fname = %s WHERE picture_id = %s;",(filename,picture_id))
        cursor.close()

def create_notice_dict(row):
    notice_id = row[0]
    title = row[1]
    notice_description = row[2]
    colour = row[3]
    place = row[4]
    notice_type = row[5]
    situation = row[6]
    date_created = row[7]
    last_updated = row[8]

    return{
        "notice_id" : notice_id,
        "title" : title,
        "notice_description" : notice_description,
        "colour" : colour,
        "place" : place,
        "notice_type" : notice_type,
        "situation" : situation,
        "date_created" : date_created,
        "last_updated" : last_updated
    }

def search_notice(item_notice_id=None):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM item_notice WHERE (item_notice_id = %s);",(item_notice_id,))
        
        row = cursor.fetchone()
        cursor.close()
        if row is None:
            return None

        return create_notice_dict(row)

def get_all_notices():
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM item_notice;")
        rows = cursor.fetchall()
        cursor.close()
        result = []
        for row in rows:
            result.append(create_notice_dict(row))

        return result

def insert_category(category_name):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO category (category_name) VALUES (%s);",(category_name,))
        cursor.close()

def search_category(category_name):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM category WHERE (category_name = %s);",(category_name,))
        row = cursor.fetchone()
        cursor.close()
        if row is None:
            return None
        else:
            category_id = row[0]
            category_name = row[1]
            date_created = row[2]

            return {
                "category_id" : category_id,
                "category_name" :category_name,
                "date_created" :date_created
            }

def get_all_categories():
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM category;")
        rows = cursor.fetchall()
        cursor.close()

        result = []
        for row in rows:
            result.append({
                "category_id":row[0],
                "category_name":row[1],
                "date_created":row[2]
            })

        return result

def insert_notice(title, item_notice_type, sent_by, category_name="Other", notice_description=None, colour=None, place=None):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        category = search_category(category_name)
        if category is not None:
            cursor.execute("INSERT INTO item_notice (title, item_notice_type, notice_description, colour, place,sent_by,category) VALUES (%s, %s, %s, %s, %s, %s, %s);",(title,item_notice_type,notice_description,colour,place,sent_by,category["category_id"]))
            cursor.close()

def get_latest_notices(sent_by):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM item_notice WHERE (sent_by = %s) ORDER BY date_created DESC;",(sent_by,))
        rows = cursor.fetchall()
        cursor.close()

        result = []
        for row in rows:
            result.append(create_notice_dict(row))

        return result

# def get_notices(sortBy="date",howToSort="desc"):
#     with dbapi2.connect(PSQLURL) as connection:
#         cursor = connection.cursor()
#         query = "SELECT * FROM item_notice"



#         cursor.execute("SELECT * FROM item_notice WHERE (sent_by = %s) ORDER BY date_created DESC;",(sent_by,))
#         rows = cursor.fetchall()
#         cursor.close()
