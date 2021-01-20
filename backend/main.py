from flask import Flask, request, jsonify,send_from_directory
from flask_login import UserMixin, LoginManager, current_user, login_user, logout_user
import psycopg2.extras
import psycopg2 as dbapi2
import os
import re
from passlib.hash import pbkdf2_sha256 as hasher
from database import search_user,insert_user,insert_picture,search_picture,update_user,update_picture, get_all_notices, insert_notice, search_notice, get_latest_notices, get_all_categories,create_notice_dict
from werkzeug.utils import secure_filename
import uuid
from flask_cors import CORS, cross_origin

app = Flask(__name__,static_folder="./client/build",static_url_path="/")
app.secret_key = os.getenv("SECRET_KEY")

@app.route('/')
def serve():
    return app.send_static_file("index.html")

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
PSQLURL = os.getenv("PSQL_DB_URL")
lm = LoginManager()
lm.init_app(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@lm.user_loader
def load_user(user_id):
    user = search_user(user_id)
    if user is None:
        return None
    else:
        return User(user["user_id"], user["password"])

class User(UserMixin):
    def __init__(self,user_id,password):
        self.user_id = user_id
        self.password = password

    def get_id(self):
        return self.user_id

@app.route("/user", methods=["GET"])
def get_authenticated_user():
    if current_user.is_authenticated:
        user = search_user(user_id=current_user.user_id)
        user.pop("password")
        return {
            "currentUser" : user
        }, 200

    else:
        return {
            "currentUser" : None
        }, 403

@app.route("/user",methods=["PUT"])
def handle_update_user():
    if not current_user.is_authenticated:
        return {
            "error":"Unauthorized"
        }, 403
    else:
        user = search_user(user_id = current_user.get_id())
        errorExists = False
        errors = {
            "fnameError" : "",
            "lnameError" : "",
            "usernameError" : "",
            "emailError" : "",
            "phoneNumberError" : "",
            "usernameExists" : False,
            "emailExists" : False
        }

        fname = request.form["fname"]
        if fname.strip() == "":
            errors["fnameError"] = "First name must not be empty"
            errorExists = True

        lname = request.form["lname"]
        if lname.strip() == "":
            errors["lnameError"] = "Last name must not be empty"
            errorExists = True

        username = request.form["username"]
        if len(username.strip()) < 4 or len(username.strip()) > 20:
            errors["usernameError"] = "Username length must be between 4 and 20 characters"
            errorExists = True
        
        email = request.form["email"]
        if ("@" not in email):
            errors["emailError"] = "Email is not valid"
            errorExists = True

        phoneNumber = request.form["phoneNumber"]
        if (len(phoneNumber.strip()) > 15):
            errors["phoneNumberError"] = "Phone number must be maximum 15 characters"
            errorExists = True

        if errorExists:
            return errors, 400
        else:
            if not username == user["username"] and search_user(username=username) is not None:
                errors["usernameExists"] = True
                errorExists = True
            
            if not email == user["email"] and search_user(email=email) is not None:
                errors["emailExists"] = True
                errorExists = True

            if not phoneNumber == "" and not phoneNumber == user["phoneNumber"] and search_user(phoneNumber=phoneNumber) is not None:
                errors["phoneNumberExists"] = True
                errorExists = True
            
            if errorExists:
                return errors, 409

            else:
                new_profile_picture_id = None

                if 'file' in request.files:
                    file = request.files['file']
                    if file and allowed_file(file.filename):
                        filename = secure_filename(uuid.uuid4().hex + "." + file.filename.rsplit('.', 1)[1].lower())
                        file.save(os.path.join(app.config["UPLOAD_DIR"],filename))
                        print()
                        current_picture = None
                        if user["profile_picture"] is not None:
                            current_picture = search_picture(user["profile_picture"]["picture_id"])
                        if current_picture is not None:
                            os.remove(os.path.join(app.config["UPLOAD_DIR"],current_picture["filename"]))
                            update_picture(current_picture["picture_id"],filename)
                        else:
                            new_profile_picture_id = insert_picture(filename)
                        
                update_user(current_user.get_id(),username,fname,lname,email,phoneNumber,new_profile_picture_id)
                user = search_user(user_id=current_user.user_id)
                user.pop("password")
                return {
                    "currentUser" : user,
                }, 200
    
@app.route("/user/<string:username>",methods=["GET"])
def user(username):
    if current_user.is_authenticated:
        user = search_user(username=username)
        if user is None:
            return {
                "user":None
            },404
        else:
            user.pop("password")
            return {
                "user":user
            },200
    else:
        return {
            "user":None
        }, 403

@app.route("/signup", methods=["POST"])
def signup():
    errorExists = False
    errors = {
        "fnameError" : "",
        "lnameError" : "",
        "usernameError" : "",
        "emailError" : "",
        "password1Error" : "",
        "password2Error" : "",
        "usernameExists" : False,
        "emailExists" : False
    }

    fname = request.form["fname"]
    if fname.strip() == "":
        errors["fnameError"] = "First name must not be empty"
        errorExists = True

    lname = request.form["lname"]
    if lname.strip() == "":
        errors["lnameError"] = "Last name must not be empty"
        errorExists = True

    username = request.form["username"]
    if len(username.strip()) < 4 or len(username.strip()) > 20:
        errors["usernameError"] = "Username length must between 4 and 20 characters"
        errorExists = True
    
    email = request.form["email"]
    if ("@" not in email):
        errors["emailError"] = "Email is not valid"
        errorExists = True

    password1 = request.form["password1"]
    if (len(password1) < 6):
        errors["password1Error"] = "Password must be at least 6 characters"
        errorExists = True

    password2 = request.form["password2"]
    if (password1 != password2):
        errors["password2Error"] = "Passwords did not match"
        errorExists = True
    
    if errorExists:
        return errors, 400
    else:
        user = search_user(username=username)

        if user is not None:
            errors["usernameExists"] = True
            errorExists = True

        user = search_user(email=email)

        if user is not None:
            errors["emailExists"] = True
            errorExists = True

        if errorExists:
            return errors, 409

        else:
            new_file_id = None
            if 'file' in request.files:
                file = request.files['file']
                if file and allowed_file(file.filename):
                    filename = secure_filename(uuid.uuid4().hex + "." + file.filename.rsplit('.', 1)[1].lower())
                    file.save(os.path.join(app.config["UPLOAD_DIR"],filename))
                    new_file_id = insert_picture(filename)

            hashed = hasher.hash(password1)
            insert_user(username,fname,lname,email,hashed,new_file_id)
            return errors, 201


@app.route("/signin",methods=["POST"])
def signin():
    username = request.json["username"]
    password = request.json["password"]
    db_user = search_user(username=username)

    if db_user is None:
        return {
            "currentUser" : None,
            "wrongCredentials" : True,
        }, 401

    else:
        user = load_user(db_user["user_id"])
        if hasher.verify(password,user.password):
            login_user(user)
            db_user.pop("password")
            return {
                "currentUser" : db_user,
                "wrongCredentials" : False,
            }, 200
        else:
            return {
                "currentUser" : None,
                "wrongCredentials" : True
            }, 401


@app.route("/signout",methods=["POST"])
def signout():
    if not current_user.is_authenticated:
        return {
            "error":"Unauthorized"
        }, 403

    else:
        logout_user()
        return {
            "currentUser" : None,
        }, 200

@app.route("/notices", methods=["POST"])
def get_notices():
    title = request.json["title"]
    colour = request.json["colour"]
    place = request.json["place"]
    selectedCategories = request.json["selectedCategories"]
    sortBy = request.json["sortBy"]
    howToSort = request.json["howToSort"]
    print(howToSort)

    search_title = "%{}%".format(title)
    search_colour = "%{}%".format(colour)
    search_place = "%{}%".format(place)


    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
        if len(selectedCategories) == 0:
            cursor.execute(f"""SELECT item_notice.*, picture.fname, app_user.username
            FROM item_notice
            LEFT JOIN picture
            ON item_notice.item_notice_id = picture.notice_id
            INNER JOIN app_user
            ON item_notice.sent_by = app_user.app_user_id
            WHERE (title ILIKE %s OR title IS NULL) 
            AND (colour ILIKE %s OR colour IS NULL) 
            AND (place ILIKE %s OR place IS NULL) 
            ORDER BY {sortBy} {howToSort};""",(search_title,search_colour,search_place))

        rows = cursor.fetchall()
        cursor.close()
        result = []
        for row in rows:
            result.append(row)

        return {"notices":result},200




    

@app.route("/notice<string:notice_id>", methods = ["GET"])
def get_notice():
    pass

@app.route("/notice", methods=["POST"])
def add_notice():
    if current_user.is_authenticated:
        errors = {
            "titleError":"",
            "noticeDescriptionError":"",
            "colourError" : "",
            "placeError" : "",
            "noticeTypeError":""
        }
        errorExists = False

        title = request.form["title"]
        title = title.strip()

        if (len(title) == 0 or len(title) > 100):
            errors["titleError"] = "Title must be between 1 and 100 characters"
            errorExists = True

        item_notice_type = request.form["item_notice_type"]
        if item_notice_type == "0":
            item_notice_type = False
        elif item_notice_type == "1":
            item_notice_type = True
        else:
            errors["noticeTypeError"] = "Invalid type"
            errorExists = True

        notice_description = request.form["notice_description"]
        notice_description = notice_description.strip()
        if (len(notice_description) > 1000):
            errors["noticeDescriptionError"] = "Too long description"
            errorExists = True

        if (notice_description == ""):
            notice_description = None


        colour = request.form["colour"]
        colour = colour.strip()

        if (len(colour) > 100):
            errors["colourError"] = "Too long colour"
            errorExists = True

        if (colour == ""):
            colour = None


        place = request.form["place"]
        place = place.strip()
        if(len(place) > 20):
            errors["placeError"] = "Too long place name"
            errorExists = True

        if place == "":
            place = None

        if errorExists:
            return errors, 400
        else:
            category_name = request.form["category_name"]

            insert_notice(title,item_notice_type,current_user.get_id(),category_name,notice_description,colour,place)
            fileAmount = int(request.form["fileAmount"])
            for i in range(0,fileAmount):
                
                file = request.files["file"+str(i)]
                if file and allowed_file(file.filename):
                    filename = secure_filename(uuid.uuid4().hex + "." + file.filename.rsplit('.', 1)[1].lower())
                    file.save(os.path.join(app.config["UPLOAD_DIR"],filename))
                    notice_id = get_latest_notices(current_user.get_id())[0]["notice_id"]
                    insert_picture(filename,notice_id)

            return errors, 201
    else:
        return "Unauthorized", 403

@app.route("/categories",methods=["GET"])
def get_categories():
    categories = get_all_categories()
    return {"categories":categories},200

@app.route("/comment",methods=["POST"])
def new_comment():
    if current_user.is_authenticated:
        comment = request.json["comment"]
        notice_id = request.json["notice_id"]
        if comment is not None:
            with dbapi2.connect(PSQLURL) as connection:
                cursor = connection.cursor()
                cursor.execute("INSERT INTO user_comment (sent_by,notice_id,content) VALUES (%s, %s, %s);",(current_user.get_id(),notice_id,comment))
                cursor.close()

            return "Success", 201

        else:
            return "No comment",400

    else:
        return "Unauthorized", 403

@app.route("/comment/<int:id>", methods=["GET"])
def get_comments(id):
    with dbapi2.connect(PSQLURL) as connection:
        cursor = connection.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
        cursor.execute("""
        SELECT user_comment.*, app_user.username
        FROM user_comment
        INNER JOIN app_user
        ON user_comment.sent_by = app_user.app_user_id
        WHERE notice_id = %s;""",(id,))
        rows = cursor.fetchall()
        cursor.close()
        return {
            "comments" : rows
        }, 200

@app.route("/helpful/<int:id>", methods=["GET"])
def helpful(id):
    with dbapi2.connect(PSQLURL) as connection:
        cursor=connection.cursor()
        cursor.execute("""
            UPDATE user_comment SET helpful = TRUE
            WHERE comment_id = %s;
        """,(id,))
        cursor.close()
        return "Success", 200

@app.route("/not_helpful/<int:id>", methods=["GET"])
def not_helpful(id):
    with dbapi2.connect(PSQLURL) as connection:
        cursor=connection.cursor()
        cursor.execute("""
            UPDATE user_comment SET not_helpful = TRUE
            WHERE comment_id = %s;
        """,(id,))
        cursor.close()
        return "Success", 200

if __name__ == "__main__":
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["UPLOAD_DIR"] ="client/build/static/images" 
    app.run(host="0.0.0.0", port=8080, debug=True)
