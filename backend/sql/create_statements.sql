CREATE TABLE IF NOT EXISTS app_user (
    app_user_id bigserial PRIMARY KEY,
    username varchar(20) UNIQUE NOT NULL,
    passcode text NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    phone_number varchar(15) UNIQUE,
    is_phone_number_visible boolean NOT NULL DEFAULT FALSE,
    experience_level real NOT NULL DEFAULT 0 CHECK (experience_level >= 0),
    is_admin boolean NOT NULL DEFAULT FALSE,
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS picture (
    picture_id bigserial PRIMARY KEY,
    fname text NOT NULL,
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS item_notice (
    item_notice_id bigserial PRIMARY KEY,
    title varchar(100) NOT NULL,
    notice_description varchar(1000),
    colour varchar(100),
    place varchar(20),                    
    item_notice_type boolean NOT NULL DEFAULT FALSE,  /* FALSE: I have found item ..., TRUE: I have lost item ...*/
    situation boolean NOT NULL DEFAULT FALSE,        /* FALSE: active, TRUE: closed */
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_comment (
    comment_id bigserial PRIMARY KEY,
    sent_by bigint NOT NULL REFERENCES app_user(app_user_id),
    notice_id bigint NOT NULL REFERENCES item_notice(item_notice_id),
    content varchar(500) NOT NULL,
    helpful boolean DEFAULT FALSE,
    not_helpful boolean DEFAULT FALSE,
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vote (
    vote_id bigserial PRIMARY KEY,
    voter_id bigint NOT NULL REFERENCES app_user(app_user_id),
    comment_id bigint REFERENCES user_comment(comment_id),
    notice_id bigint REFERENCES item_notice(item_notice_id),
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS category (
    category_id bigserial PRIMARY KEY,
    category_name varchar(20) NOT NULL,
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reputation (
    voter_id bigint NOT NULL,
    voted_id bigint NOT NULL,
    date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (voter_id, voted_id),
    FOREIGN KEY (voter_id) REFERENCES app_user(app_user_id),
    FOREIGN KEY (voted_id) REFERENCES app_user(app_user_id)
);

ALTER TABLE app_user ADD COLUMN IF NOT EXISTS profile_picture_id bigint REFERENCES picture(picture_id);

ALTER TABLE picture ADD COLUMN IF NOT EXISTS notice_id bigint REFERENCES item_notice(item_notice_id);

ALTER TABLE item_notice ADD COLUMN IF NOT EXISTS sent_by bigint NOT NULL REFERENCES app_user(app_user_id);
ALTER TABLE item_notice ADD COLUMN IF NOT EXISTS category bigint NOT NULL REFERENCES category(category_id);

INSERT INTO category (category_name) VALUES ('Computer');
INSERT INTO category (category_name) VALUES ('Mobile phone');
INSERT INTO category (category_name) VALUES ('Tablet');
INSERT INTO category (category_name) VALUES ('Charger');
INSERT INTO category (category_name) VALUES ('Watch');
INSERT INTO category (category_name) VALUES ('Jewellery');
INSERT INTO category (category_name) VALUES ('Card');
INSERT INTO category (category_name) VALUES ('Key');
INSERT INTO category (category_name) VALUES ('Other');