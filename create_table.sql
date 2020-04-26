CREATE DATABASE IF NOT EXISTS fancy_store character set utf8 COLLATE utf8_general_ci;

--用户表
drop table if exists user;
create table if not exists user(
    id int auto_increment primary key,
    username varchar(50),
    password varchar(50),
    phone varchar(11),
    last_login_time int,
    last_modify_time int,
    register_time int,
    is_disabled int
) 
;
--商品信息表
drop table if exists product_info;
create table if not exists product_info(
    id int unsigned primary key auto_increment comment'商品id',
    category_id int comment'分类id',
    sn varchar(20)  comment'编号',
    name varchar(120)  comment'名称',
    keyword varchar(255) comment'关键字',
    picture int comment'图片',
    tips varchar(255)  comment'提示',
    description varchar(255)  comment'描述',
    content text comment'详情',
    price decimal(10,2) comment '价格',
    stock int  comment '库存',
    score decimal (3,2)  comment'评分',
    is_on_sale tinyint  comment'是否上架',
    is_del tinyint  comment'是否删除',
    is_free_shipping tinyint  comment'是否包邮',
    sell_count int  comment'销量计数',
    comment int  comment'评论计数',
    on_sale_time int null comment'上架时间',
    create_time int comment'创建时间',
    update_time int comment'更新时间'
)
;
-- 商品图片表
drop table if exists shop_album;
create table if not exists shop_album(
    id int unsigned auto_increment key comment 'id',
    pid int unsigned not null comment '商品id',
    album_path varchar(50) not null comment '图片路径',
    goods_sthumb varchar(255) comment '小缩略图片名称'
);

--评论表
drop table if exists product_comment;
create table if not exists product_comment(
   id int auto_increment primary key,
   user_id int comment '用户id',
   product_id int comment '商品id',
   content varchar(255) comment '评论的内容',
   create_time int comment '评论的时间',
   star int comment '商品评分分数,取值为1-5'
)
;
--商品分类表
drop table if exists category;
create table if not exists category(
 cid INT PRIMARY KEY,
 cname VARCHAR(50)
);

--订单表
drop table if exists orders;
create table if not exists orders(
 uuid int auto_increment primary key,
 oid varchar(20),
 uid int,
 product_id int,
 num int,
 create_time int comment'创建时间',
 update_time int comment'更新时间',
 status_code int comment '订单状态'
);

--购物车表
drop table if exists cart;
create table if not exists cart(
cart_id int primary key auto_increment comment '自增',
u_id int not null comment '买家id',
product_id int comment '商品的id',
price_count decimal(10,2) comment '金额小计',
mprice_count decimal(10,2) comment '市场价格小计',
sale_num int comment '购买数量'
);



