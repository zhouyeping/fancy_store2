# 1. 用户表
create table user(
    id int auto_increment primary key,
    username varchar(50),
    password varchar(50),
    phone varchar(11),
    last_login_time int,
    last_modify_time int,
    register_time int,
    is_admin int,
    is_disabled int
);

# 2. 学习专区表
create table learn_part(
    id int auto_increment primary key,
    part_name varchar(50),
    add_time int,
    user_id int,
    credit int,
    reward_point int
);

# 3. 文章表（学习内容表）
create table article(
    id int auto_increment primary key,
    title varchar(50),
    content text(65535),
    part_id int,
    author_id int,
    create_time int,
    last_edit_time int,
    view_times int,
    reward_point int,
    description varchar(200)
);

# 4. 证书表
create table certificate(
    id int auto_increment primary key,
     certificate_name varchar(50),
     add_time int,
     get_type int,
     user_id int

);
# 5. 学习记录表
create table learn_record(
    id int auto_increment primary key,
    user_id int,
    article_id int,
    learn_start_time int,
    learn_cost_time int
);
# 6. 获取证书历史表
create table certificate_record(
    id int auto_increment primary key,
    user_id int,
    certificate_id int,
    get_time int
);
# 7. 考试题目表
create table exam_question(
    id int auto_increment primary key,
    question_title varchar(500),
    exam_id int,
    grade int,
    type int
);
# 8、试题表
create table exam(
    id int auto_increment primary key,
    title varchar(200),
    part_id int,
    exam_time int,
    auto_review_exam int
);

# 9. 考试题目选项表
create table question_options(
    id int auto_increment primary key,
    description varchar(500),
    question_id int,
    is_answer int
);

# 10. 考试记录表
create table exam_record(
    id int auto_increment primary key,
    user_id int,
    exam_id int,
    exam_start_time int,
    exam_end_time int,
    scores int,
    status int
);
# 11. 积分获取历史表
create table credit_record(
    id int auto_increment primary key,
    user_id int,
    reward_point int,
    get_time int
);

# 12. pdf上传记录表
create table upload_file(
    id int primary  key auto_increment,
    part_id int,
    upload_time int,
    reward_point int,
    filename varchar(100)
);


