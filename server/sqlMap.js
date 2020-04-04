
module.exports = {
    learnPart: {
        queryAll: "select id, part_name, add_time, user_id, credit, reward_point from learn_part",
        insert: "insert into learn_part values(null, ?, ?, ?, ?, ?)",
        deleteById: "delete from learn_part where id = ?",
        updateById: "update learn_part set part_name = ?, credit = ?, reward_point = ? where id = ?"
    },
    article: {
        queryAll: "select article.id, article.title, article.content, article.part_id, user.username as author_id, " +
        "article.create_time, article.last_edit_time, article.view_times," +
        "article.reward_point, article.description from article join user on article.author_id = user.id ",
        queryArticleCount: "select count(*) as total_count from article ",
        insert: "insert into article values(null, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        deleteById: "delete from article where id = ?",
        updateById: "update article set title = ?, content = ?, last_edit_time = ?, reward_point = ?, description = ? where id = ?",
        updateViewTimes: "update article set view_times = ? where id = ?",
        queryArticleDetail: "select id, title, content, part_id, author_id, create_time," +
        "last_edit_time, view_times, reward_point, description from article where id = ?"
    },
    certificate: {
        queryAll: "select id, certificate_name, add_time, get_type, user_id from certificate",
        insert: "insert into certificate values(null, ?, ?, ?, ?)",
        updateById: "update certificate set certificate_name = ?, get_type = ? where id = ? ",
        deleteById: "delete from certificate where id = ?"
    },
    user: {
        queryAll: "select id, username, password, phone, last_login_time, last_modify_time, register_time," +
        "is_admin, is_disabled from user limit ?, ?",
        queryUserCount: "select count(*) as total_count from user",
        insert: "insert into user values(null, ?, ?, ?, ?, ?, ?, ?, ?)",
        deleteById: "delete from user where id = ?",
        updateById: "update user set username = ?, password = ?, last_modify_time = ?, is_admin = ?," +
        "is_disabled = ?, phone = ? where id = ?",
        queryPasswordByUsername: "select id, password from user where username = ?",
        queryUsernameById: "select username from user where id = ?"
    },
    file: {
        insertFile: "insert into upload_file values(null, ?, ?, ?, ?)",
        queryAllFileCount: "select count(*) as total_count from upload_file",
        queryAllFile: "select part_id, upload_time, reward_point, filename from upload_file limit ?, ?"
    },
    exam: {
        queryAll: "select exam.id, exam.title, learn_part.part_name, exam.exam_time from exam join" +
        " learn_part as learn_part on exam.part_id = learn_part.id ",
        queryByExamId: "select exam.id, exam.title, exam.exam_time, learn_part.part_name from exam join learn_part " +
        "on exam.part_id = learn_part.id  where exam.id = ?",
        queryMaxId: "select id from exam order by id desc",
        queryExamCount: "select count(*) as total_count from exam ",
        insert: "insert into exam values(?, ?, ?, ?, ?) "
    },
    examQuestion: {
        queryByExamId: "select options.id as  option_id, options.description,options.is_answer," +
        "question_id as question_id, question.question_title, question.grade as question_grade, question.type as question_type, question.exam_id as exam_id " +
        "from question_options as options left join exam_question as question on question.id = options.question_id;  ",
        queryMaxId: "select id from exam_question order by id desc",
        insert: "insert into exam_question values(?, ?, ?, ?, ?) ",
    },
    questionOption: {
        insert: "insert into question_options values(null, ?, ?, ?) "
    },
    examRecord:{
        queryAll: "select id, user_id, exam_id, exam_start_time, exam_end_time, scores, status from exam",
        queryAllCount: "select count(*) as total_count from exam",
        insert: "insert into exam_record values(null, ?, ?, ?, ?, ?, ?)"
    }
};