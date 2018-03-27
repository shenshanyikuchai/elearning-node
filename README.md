# elearning-node

使用node+koa2提供学习中心场景缓存api

```
npm install
npm run dev

```
> prefix : /api/userAction/scene/mobileIndex

## 阶段1 --- 整合接口

### 登录 -- `login`

```

产品类型 - type : pcWeb/winExe/iPad/iPhone/aPhone/aPad/zbjyjt/zbjyyw
用户名   - username : zpk
密码     - password : 123456

```

> token 获取token

> login 用户登录

### 首页 -- `index`


用户数据 - `userInfo`

> mycount 笔记，交流，总数

> getLoginLog 登录信息

> messageList-noRead 未读消息列表

课程数据 - `courseInfo`

> learningcourse 在学课程列表

> getCourseProgress 课程进度

> getExamDate 考试时间

广告 - `slideList`

> slide/list 热门活动

### 课程首页 -- `courseIndex`

> courseDetail 课程详情

> getCourseProgress 课程进度

> courseactivestatus 课程状态

> getTasksProgress 任务进度

> getExamDate 考试时间

### 移动端首页 -- `mobileIndex`
### pc端首页 -- `pcIndex`
### pc端课程首页 -- `pcCourseIndex`

### 班级课程列表 -- `classCourseList`
### 班级课程详情 -- `classCourseDetail`
### 教学大纲 -- `teachingProgram`
### 教学计划 -- `teachingPlan`
### 测评成绩报告 -- `examReport`




## 阶段2 --- 接口持久化，错误处理

使用memberid和token来做接口数据持久化...

对接口返回的错误，做适当处理
...

## 阶段3 --- 统计数据，数据可视化


...