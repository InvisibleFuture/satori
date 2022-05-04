import fs from 'fs'
import { Sequelize, DataTypes } from 'sequelize'

fs.stat('data', (err,stats) => {
  if (!stats) fs.mkdirSync('data')
})

fs.stat('data/file', (err,stats) => {
  if (!stats) fs.mkdirSync('data/file')
})

// 连接数据库
export const db = new Sequelize({
  host: 'localhost',
  port: 3306,
  dialect: 'mariadb',
  database: 'satori',
  username: 'satori',
  password: 'satori',
  timezone: '+08:00',
  logging: false
})

// 定义用户表
export const User = db.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  salt: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
})

// 定义课题表
export const Project = db.define('project', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  data: { type: DataTypes.STRING },
})

// 定义博客表
export const Blog = db.define('blog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  data: { type: DataTypes.STRING },
})

// 定义评论表
export const Comment = db.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  data: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  mail: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
})

// 定义文件表
export const File = db.define('file', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  path: { type: DataTypes.STRING },
  size: { type: DataTypes.INTEGER },
})

// 定义标签表
export const Tag = db.define('tag', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
}, { timestamps: false })

// 定义双向关联表(Blog - Tag)
export const Blog_Tag = db.define('blog_tag', {}, { timestamps: false })

Blog.belongsToMany(Tag, { through: Blog_Tag })
Tag.belongsToMany(Blog, { through: Blog_Tag })

// 定义表关联
Blog.belongsTo(User) // blog 附属于 user
File.belongsTo(Blog) // file 附属于 blog

// 初始化数据库 (alter 更新表字段, force 强制删除表重建)
User.sync({alter: true})
Blog.sync({alter: true})
Comment.sync({alter: true})
File.sync({alter: true})
Tag.sync({alter: true})
Project.sync({alter: true})

Blog_Tag.sync({alter: true})

// ---
// title: theme主题介绍
// date: 2018-09-07 09:25:00
// author: 作者
// img: /source/images/xxx.jpg
// top: true
// cover: true
// coverImg: /images/1.jpg
// password: 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
// toc: false
// mathjax: false
// summary: 这是你自定义的文章摘要内容，如果这个属性有值，文章卡片摘要就显示这段文字，否则程序会自动截取文章的部分内容作为摘要
// categories: Markdown
// tags:
//   - Typora
//   - Markdown
// ---
