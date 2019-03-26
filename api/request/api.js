module.exports = {
<<<<<<< HEAD
  'demo': true,
  'token': 'dd68b8cb-9c9c-4da4-9d24-7cbc92006d41',
  'sendsms' : {
    'name': '发送服务器错误报警短信',
    'url': '/api/base/sms/sendErrorAlertSms',
    'mock': '/mock/sendsms.json',
    'type': 'POST',
    'defaultData': {
      'adminName': 'zpk',
      'errorUrl': 'sendErrorAlertSms',
      'errorMsg': 'error',
      'errorId' : '123123',
      'mobile' : '18612875765'
    }
  },
  'getClassPlanDetail': {
    'name': '班级课程列表',
    'hostNameDemo': 'http://192.168.10.201:9995',
    'url': '/api/userAction/php/class/getClassPlanDetail',
    'mock': '/mock/memberGetplan.json',
    'defaultData': {
      'classId': 'b8d924a90d42ca12685cec1ed32fb23e',
      'courseId': 'c0709cf3baf8fc1b4cb6932f4af165c4',
      'planType': 1
    }
  },
  'getStudyPlanList': {
    'name': 'ez课程个人学习计划',
    // 'hostNameDemo': 'http://192.168.10.201:9995',
    // 'url': '/api/userAction/php/plan/studyPlanList',
    'url': '/api/study/userAction/plan/studyPlanList',
    'type': 'POST',
    'mock': '/mock/studyPlanList.json',
    'defaultData': {
      'token': 'b8d924a90d42ca12685cec1ed32fb23e',
      'courseId': 'c0709cf3baf8fc1b4cb6932f4af165c4'
    }
  },
  'studyPlanProgressSave': {
    'name': 'ez课程保存学员学习计划状态',
    // 'hostNameDemo': 'http://192.168.10.201:9995',
    // 'url': '/api/userAction/php/plan/studyPlanList',
    'url': '/api/study/userAction/plan/studyPlanProgressSave',
    'type': 'POST',
    'mock': '/mock/studyPlanProgressSave.json',
    'defaultData': {
      'token': 'b8d924a90d42ca12685cec1ed32fb23e',
      'courseId': 'c0709cf3baf8fc1b4cb6932f4af165c4'
    }
  },
  'classCourseList': {
    'name': '班级课程列表',
    'url': '/api/userAction/study/member/getClass',
    'mock': '/mock/getClass.json',
    'defaultData': {
      'token': this.token,
      'memberId': 'ff8080815133db0d0151375bfdf30c0d',
      'courseId': ''
    }
  },
  'teachingProgram': {
    'name': '课程班级教学大纲',
    'isPrefix': true,
    'path': '/teachingProgram',
    'mock': '/mock/courseDetail.json',
    'notMock': true,
    'queryData': {
      'courseid': "123456"
    }
  },
  'teachingPlan': {
    'name': '课程班级教学计划',
    'isPrefix': true,
    'path': '/teachingPlan',
    'mock': '/mock/teachingPlan.json',
    'notMock': true,
    'queryData': {
      'courseid': "123456"
    }
  },
  'getClass': {
    'name': '获取指定学员班级列表信息',
    'path': '/api/userAction/study/member/getClass',
    'mock': '/mock/getClass.json',
    'queryData': {
      'token': "123456"
    }
  },
  'teachingPlan': {
    'name': '获取学员在某班级指定课程和学习计划的学习计划进度',
    'path': '/api/userAction/study/member/getplan',
    'mock': '/mock/teachingPlan.json',
    'queryData': {
      'token': "123456",
      'courseCategoryId': "科目id",
      'courseId': "课程id"
    }
  },
  'examReport': {
    'name': '测评成绩报告',
    'isPrefix': true,
    'path': '/examReport',
    'mock': '/mock/examReport.json',
    'notMock': true,
    'queryData': {
      'courseid': "123456"
    }
  },
  'getTeacherClass': {
    'name': '获取教师班级列表信息',
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/userAction/study/teacher/getClass',
    'path': '/api/userAction/study/teacher/getClass',
    'mock': '/mock/getTeacherClass.json',
    'queryData': {
      'token': '123456',
      'type': '0' // 0老师，1班主任，2助教
    }
  },
  'getClassCourse': {
    'name': '获取班级下的课程',
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/userAction/study/teacher/getClassCourse',
    'path': '/api/userAction/study/teacher/getClassCourse',
    'mock': '/mock/getClassCourse.json',
    'queryData': {
      'classId': "123456"
    }
  },
  'getTeacherLiveCourselist': {
    'name': '获取教师直播课列表',
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/teachsource/course/getteacheropencourselist',
    // 'mock': '/static/mock/getClassCourse.json',
    'defaultData': {
      'teacherId': 'teacherId',
    }
  },
  'userExerciseStatus': {
    'hostNameDemo': 'http://192.168.10.201:8080',
    'url': '/api/userAction/examen/get_user_knowledge_point_exercise_list',
    'name': '获取用户某知识点（或试卷）答题记录',
    'isPrefix': true,
    'path': '/userExerciseStatus',
    'mock': '/mock/userExerciseStatus.json',
    'notMock': true,
    'queryData': {
      'knowledge_point_id': "知识点id",
      'member_id': '用户id',
      'examenNum': '测试批次',
      'pageNo': '分页页码',
      'pageSize': '每页面记录数'
    }
  },
  'userExamStatus': {
    'hostNameDemo': 'http://192.168.10.201:8080',
    'url': '/api/userAction/examen/get_exercise_knowledge_member_status',
    'name': '获取用户知识点（或试卷）的答题进度',
    'isPrefix': true,
    'type': 'POST',
    'path': '/userExamStatus',
    'mock': '/mock/userExamStatus.json',
    'notMock': true,
    'queryData': {
      'knowledge_point_id': "知识点id",
      'member_id': '用户id',
      'examenNum': '测试批次',
      'type': '1:通过path模糊搜索，2:通过level1精确检索，3:通过level2精确检索 4:通过knowledge_point_id精确匹配'
    }
  },
  'getExerciseBaseInfo': {
    'url': '/api/teachsource/examen/getExerciseBaseInfo/data',
    'name': '根据试卷id获取试卷试题基本信息',
    'isPrefix': true,
    'path': '/getExerciseBaseInfo',
    'mock': '/mock/getExerciseBaseInfo.json',
    'notMock': true,
    'queryData': {
      'examenId': "123456"
    }
  },
  'getKnowledgePointInfoByExerciseIds': {
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/teachsource/knowledge/getKnowledgePointInfoByExerciseIds',
    'name': '根据试卷ids获取知识点',
    'isPrefix': true,
    'path': '/getKnowledgePointInfoByExerciseIds',
    'mock': '/mock/getKnowledgePointInfoByExerciseIds.json',
    'notMock': true,
    'queryData': {
      'exerciseIds': "ff8080814ad1f7d3014afc9ef7286b7c,ff8080814a766dea014a767e38fb0003"
=======
  'demo' : true,
  'token' : 'dd68b8cb-9c9c-4da4-9d24-7cbc92006d41',
  'classCourseList': {
    'name' : '登录',
    'url': '/api/userAction/study/member/getClass',
    'mock' : 'getClass.json',
    'defaultData' : {
      'token' : this.token,
      'memberId' : 'ff8080815133db0d0151375bfdf30c0d',
      'courseId' : ''
    }
  },
  'classCourseDetail': {
    'name' : '登录',
    'url': '/api/zbids/member/login/v1.0',
    'mock' : 'classCourseDetail.json',
    'defaultData' : {
      'token' : this.token,
      'memberId' : 'ff8080815133db0d0151375bfdf30c0d',
      'courseId' : ''
    }
  },
  'teachingProgram' : {
    'name' : '课程班级教学大纲',
    'isPrefix' : true,
    'path' : '/teachingProgram',
    'mock' : '/courseDetail.json',
    'notMock' : true,
    'queryData' : {
      'courseid' : "123456"
    }
  },
  'teachingPlan' : {
    'name' : '课程班级教学计划',
    'isPrefix' : true,
    'path' : '/teachingPlan',
    'mock' : '/teachingPlan.json',
    'notMock' : true,
    'queryData' : {
      'courseid' : "123456"
    }
  },
  'getClass' : {
    'name' : '获取指定学员班级列表信息',
    'path' : '/api/userAction/study/member/getClass',
    'mock' : '/getClass.json',
    'queryData' : {
      'token' : "123456"
    }
  },
  'teachingPlan' : {
    'name' : '获取学员在某班级指定课程和学习计划的学习计划进度',
    'path' : '/api/userAction/study/member/getplan',
    'mock' : '/teachingPlan.json',
    'queryData' : {
      'token' : "123456",
      'courseCategoryId' : "科目id",
      'courseId' : "课程id"
>>>>>>> 7d2dcad445046277906f6b533e87d63ec5d6fa1d
    }
  },
  'gettoken': {
    'name': '获取token',
    'url': '/api/zbids/app/gettoken/v1.0/',
    // 'url': '/api/edu/zbids/app/gettoken/',
    'mock': '/mock/token.json',
    'defaultData': {
      "appType": "pc",
      "appId": "pcWeb",
      "appKey": "e877000be408a6cb0428e0f584456e03"
    }
  },
  'login': {
    'name': '登录',
    'url': '/api/zbids/member/login/v1.0',
    // 'url': '/api/edu/zbids/member/login',
    'mock': '/mock/login.json',
    'type': 'POST',
    'defaultData': {
      'account': 'zpk',
      'password': '123456',
      'token': this.token
    }
  },
  'teacherLogin': {
    'name': '登录',
    'url': '/api/zbids/member/login/v1.0',
    // 'url': '/api/edu/zbids/member/login',
    'mock': '/mock/teacherLogin.json',
    'type': 'POST',
    'defaultData': {
      'account': 'zpk',
      'password': '123456',
      'token': this.token
    }
  },
  'getCourseArrange': {
    'name': '课表列表',
    'path': '/getCourseArrange',
    'url': '/api/userAction/php/course_arrange/get_course_arrange',
    'mock': '/mock/get_course_arrange.json',
    'notMock': false,
    'type': 'POST',
    'queryData': {
      'classId': 'e1699c9662050a66f0d6fd5af3823604',
      'token': '7f10d7d7-09e2-43d3-ab4b-4092f4a330b1',
      'pageNo': 1,
      'pageSize': 999
    }
  },

  'logout': {
    'name': '登出',
    'url': '/api/zbids/member/loginout/v1.0'
  },
  'mycount': {
    'name': '我的交流笔记统计',
    'url': '/api/studytools/mycount/v2.1',
    'mock': '/mock/mycount.json',
    'defaultData': {
      'token': this.token
    }
  },
  'slideList': {
    'name': '活动列表',
    'url': '/api/article/slide/list',
    'mock': '/mock/slide-list.json',
    'defaultData': {
      'tag': '0',
      'valid': 'true',
      'count': '4'
    }
  },
  'getLoginLog': {
    'name': '登录日志',
    'url': '/api/zbids/member/getLoginLog',
    'mock': '/mock/getLoginLog.json',
    'defaultData': {
      'memberid': 'ff8080815133db0d0151375bfdf30c0d',
      'pageNo': 1,
      'pageSize': 1
    }
  },
  'getExamDate': {
    'name': '考试时间',
    'url': '/api/business/coursestudy/getExamDate',
    'mock': '/mock/getExamDate.json',
    'defaultData': {
      'memberId': 'ff8080815133db0d0151375bfdf30c0d'
    }
  },
  'learningcourse': {
    'name': '在学的课程',
    'url': '/api/business/learning/learningcourse/v1.0',
    'mock': '/mock/learningcourse.json',
    'defaultData': {
      'token': this.token,
      'pageNo': 1,
      'pageSize': 999
    }
  },
  'noActivecourse': {
    'name': '未激活的课程',
    'url': '/api/business/learning/noActivecourse/v1.0',
    'mock': '/mock/noActivecourse.json'
  },
  'noActivecourse-mock': {
    'name': '未激活的课程',
    'url': '/api/business/learning/noActivecourse/v1.0',
    'mock': '/mock/noActivecourse-mock.json'
  },
  'noActivecourse_pad-mock': {
    'name': '未激活的课程',
    'url': '/api/business/learning/noActivecourse/v1.0',
    'mock': '/mock/noActivecourse_pad-mock.json'
  },
  'expirationcourse': {
    'name': '过期的课程',
    'url': '/api/business/learning/expirationcourse/v1.0',
    'mock': '/mock/expirationcourse.json'
  },

  'getCourseProgress': {
    'name': '课程进度',
    'action': 'true',
    'hostName': 'http://action.zbgedu.com',
    'hostNameDemo': 'http://action.zbgedu.com',
    'url': '/api/userAction/course/getCourseProgress/v1.0/',
    'mock': '/mock/getCourseProgress.json',
    'defaultData': {
      'token': this.token,
      'memberId': 'ff8080815133db0d0151375bfdf30c0d',
      'courseId': ''
    }
  },
  'messageList': {
    'name': '消息列表',
    'url': '/api/study/message/list/v1.0',
    'mock': '/mock/message-list.json',
    'defaultData': {
      'token': this.token,
      // 'type' : '1',
      'pageNo': 1,
      'pageSize': 20
    }
  },
  'messageListPageNo2': {
    'name': '消息列表',
    'url': '/api/study/message/list/v1.0',
    'mock': '/mock/message-list-pageNo2.json',
    'defaultData': {
      'token': this.token,
      'pageNo': 1,
      'pageSize': 20
    }
  },
  'messageListNoRead': {
    'name': '未阅读消息列表',
    'url': '/api/study/message/list/v1.0',
    'mock': '/mock/message-list-noread.json',
    'defaultData': {
      'token': this.token,
      'isRead': '0', // 0 未阅读 1 已阅读
      // 'type' : '1',
      'pageNo': 1,
      'pageSize': 20
    }
  },
  'updateStatus': {
    'name': '更新消息状态',
    'url': '/api/study/message/updateStatus/v1.0',
    'mock': '/mock/updateStatus.json',
    'defaultData': {
      'token': this.token,
      'messageId': 'messageId',
      'isall': '0' // 0 更新一个 1 更新所有
    },
  },
  'member': {
    'name': '用户详细信息',
    'url': '/api/zbids/member/getmemberinfo'
  },
  'courseDetail': {
    'name': '课程详情',
    'urlDemo': '/api/teachsource/course/courseDetail/data',
    'url': '/api/teachsource/course/courseDetail/data',
    // 'mock' : '/mock/courseDetail-test.json',
    'mock': '/mock/courseDetail.json',
    'defaultData': {
      'courseId': '8a22ecb55e755132015e8361703400c6'
    }
  },
  'courseactivestatus': {
    'url': '/api/business/learning/courseactivestatus',
    'mock': '/mock/courseactivestatus.json',
    'defaultData': {
      'token': '7a98a7c9-208a-44c3-ab17-7f836287adde',
      'versionId': 'ff808081473905e701476205d8740070'
    }
  },
  'actionGetTasksProgress': {
    'name': '任务进度',
    'action': 'true',
    'hostName': 'http://action.zbgedu.com',
    'hostNameDemo': 'http://action.zbgedu.com',
    'url': '/api/userAction/course/getTasksProgress/v1.0/',
    'mock': '/mock/actionGetTasksProgress.json',
    'defaultData': {
      'token': '7a98a7c9-208a-44c3-ab17-7f836287adde',
      'memberId': '8a22ecb553a0b1320153a7251a1e149f',
      'courseId': '8a22ecb55e755132015e8361703400c6'
    },
  },



  // 'courseBaseInfo': {
  //   'urlDemo': '/api/v2.1/course/courseBaseInfo/data',
  //   'url': '/api/v2.1/course/courseBaseInfo/data',
  //   'type': 'POST'
  // },

  'courseBaseInfo': {
    'urlDemo': '/api/teachsource/course/courseBaseInfo/data',
    'url': '/api/teachsource/course/courseBaseInfo/data'
  },
  'handout': {
    'urlDemo': '/api/teachsource/course/courseBaseInfo/data',
    'url': '/api/teachsource/course/courseBaseInfo/data'
  },
  'version': {
    'urlDemo': '/api/teachsource/course/coursesversionlist/data',
    'url': '/api/teachsource/course/coursesversionlist/data'
  },
  'getNidExerciseDetail': {
    'hostNameDemo': 'http://192.168.10.112:8083',
    'urlDemo': '/api/teachsource/examen/getNidExerciseDetail/data',
    'url': '/api/teachsource/examen/getNidExerciseDetail/data'
  },
  'getExerciseIds': {
    'urlDemo': '/api/teachsource/examen/getExerciseIds/data',
    'url': '/api/teachsource/examen/getExerciseIds/data'
  },

  'getTasksProgress': {
    'url': '/api/v2/study/getTasksProgress'
  },
  'taskProgress': {
    'url': '/api/v2.1/chapter/taskProgress',
    'type': 'POST'
  },

  'bbslist': {
    'url': '/api/studytools/bbslist/v1.0'
  },
  'bbsdetail': {
    'url': '/api/studytools/bbsdetail/v1.0'
  },
  'bbslist_myJoin': {
    'url': '/api/studytools/bbslist_myJoin/v1.0'
  },
  'bbs_praise': {
    'url': '/api/studytools/bbs_praise/v1.0'
  },
  'bbsreply': {
    'url': '/api/studytools/bbsreply/v1.0',
    'type': 'POST'
  },
  'bbssave': {
    'url': '/api/studytools/bbssave/v1.0',
    'type': 'POST'
  },
  'bbs_del': {
    'url': '/api/studytools/bbs_del/v1.0'
  },
  'insertMessage':{
    'url': '/api/userAction/php/message/insertMessage',
    'type': 'POST'
  },
  'getTeacherData':{
    'url': '/api/userAction/php/teacher/getTeacherData',
    // 'type': 'POST'
  },
  'sendStudentQuestionWarningMail':{
    'url': '/api/base/mail/sendStudentQuestionWarningMail',
    'type': 'POST'
  },
  'sendStudentQuestionMessageMail':{
    'url': '/api/base/mail/sendStudentQuestionMessageMail',
    'type': 'POST'
  },
  'course-node': {
    'url': '/api/v2/course/node'
  },
  'nodelist': {
    'url': '/api/studytools/nodelist/v2.1'
  },
  'nodedetail': {
    'url': '/api/studytools/nodedetail/v2.1'
  },
  'node-list': {
    'url': '/api/v2/note/list'
  },
  'nodesave': {
    'url': '/api/studytools/nodesave/v2.1',
    'type': 'POST'
  },
  'coursechapternodecount': {
    'url': '/api/studytools/coursechapternodecount/v2.1',
    'type': 'POST'
  },
  'myallcoursechapternodecount': {
    'url': '/api/studytools/myallcoursechapternodecount/v2.1',
    'type': 'POST'
  },
  'delmycontent': {
    'url': '/api/studytools/delmycontent/v2.1'
  },
  'ad_discuss': {
    'url': '/api/studytools/ad_discuss/v2.1'
  },
  'timeList': {
    'url': '/api/teachsource/exam/timeList'
  },
  'active': {
    'url': '/api/business/order/courseActive/v1.0'
  },
  'bbs_forumlistShow': {
    'url': '/api/studytools/bbs_forumlistShow/v1.0'
  },
  'addLMG': {
    'url': '/api/business/complaintOpinion/create/v1.0',
    'type': 'POST'
  },
  'exercisePointCountCache': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/extendapi/examen/get_exercise_point_count_cache',
    'type': 'POST'
  },
  'exerciseKnowledgeMemberStatus': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/userAction/examen/get_exercise_knowledge_member_status',
    'type': 'POST'
  },
  'userKnowledgePointExerciseList': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/userAction/examen/get_user_knowledge_point_exercise_list'
  },
  'setMemberExerciseLog': {
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/userAction/examen/setMemberExerciseState',
    'type': 'POST'
  },

  'actionTaskProgress': {
    'action': 'true',
    'hostName': 'http://action.zbgedu.com',
    'url': '/api/userAction/course/taskProgress/v1.0/'
  },
  'wileyCourseActive': {
    'url': '/api/business/order/wileyCourseActive/v1.0'
  },
  'wileyCourseStudy': {
    'url': '/api/business/order/wileyCourseStudy/v1.0'
  },
  'getAppointmentState': {
    'hostName': 'http://elearning.zbgedu.com',
    'url': '/publicCourse/getAppointmentState.do',
    'type': 'POST'
  },
  'appointClick': {
    'hostName': 'http://elearning.zbgedu.com',
    'url': '/publicCourse/appointClick.do',
    'type': 'POST'
  },

  'getmembernotprocnoticelist': {
    'url': '/api/business/coursegroup/getmembernotprocnoticelist'
  },
  'membercheck': {
    'url': '/api/business/coursegroup/membercheck'
  },

  'get_exercise_knowledge_member_status': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/userAction/examen/get_exercise_knowledge_member_status',
    'type': 'POST'
  },
  'getMemberErrorExercise': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/userAction/examen/getMemberErrorExercise'
  },
  'delMemberExercise': {
    'url': '/api/userAction/examen/delMemberExercise'
  },
  'setMemberErrorExercise': {
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/userAction/examen/setMemberErrorExercise',
    'type': 'POST'
  },
  'setMemberExamenFinish': {
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/userAction/examen/setMemberExamenFinish',
    'type': 'POST'
  },
  'appointment': {
    'url': '/api/userAction/opencourse/appointment',
  },
  'getappointmentlist': {
    'url': '/api/userAction/opencourse/getappointmentlist',
  },
  'includeopencoursegroup': {
    'url': '/api/business/coursegroup/includeopencoursegroup'
  },
  'memberbuycategorylist': {
    'url': '/api/business/course/memberbuycategorylist'
  },
  'memberbuylist': {
    'url': '/api/business/coursegroup/memberbuylist'
  },
  'getTotalTime': {
    'url': '/api/userAction/openCourse/getTotalTime'
  },
  'settotaltime': {
    'url': '/api/userAction/openCourse/settotaltime'
  },
  'setgift': {
    'url': '/api/userAction/openCourse/setgift'
  },
  'payment': {
    'url': '/api/business/order/payment',
    'type': 'POST'
  },
  'ccLogin': {
    'hostName': 'https://view.csslcloud.net',
    'hostNameDemo': 'https://view.csslcloud.net',
    'url': '/api/view/login',
    'type': 'POST'
  },
  'getcoursecategory': {
    'staticData': './script/staticData/getcoursecategory.json',
    'staticDataDemo': './scripts/staticData/getcoursecategory.json'
  },
  'courseCategoryExamenCount': {
    'url': '/api/teachsource/examen/courseCategoryExamenCount',
  },
  'courseCategoryExamenList': {
    'url': '/api/teachsource/examen/courseCategoryExamenList'
  },
  'childKnowledgeNodePointList': {
    'url': '/api/teachsource/knowledge/childKnowledgeNodePointList'
  },
  'getListById': {
    'url': '/api/teachsource/resources/getListById'
  },
  'getDetailById': {
    'url': '/api/teachsource/resources/getDetailById'
  },
  'getExamenInfo': {
    'url': '/api/teachsource/examen/getExamenInfo'
  },
  'getKnowledgePointInfo': {
    'url': '/api/teachsource/knowledge/getKnowledgePointInfo'
  },
  'searchCourseAlterationsByVersionId': {
    'url': '/api/teachsource/courseAlteration/searchCourseAlterationsByVersionId',
    'mock': '/mock/searchCourseAlterationsByVersionId.json',
    'defaultData': {
      'versionId': 'ff808081473905e701476205d8740070'
    }
  },
  'courselist': {
    'name': '获取商品包课程列表',
    'url': '/api/business/coursegroup/courselist'
  },
  'getplan': {
    'name': '获取课程计划模板',
    'url': '/api/userAction/study/getplan'
  },
  'memberGetplan': {
    'name': '获取学员学习计划',
    'url': '/api/userAction/study/member/getplan',
    // 'mock' : '/mock/memberGetplan-test.json',
    'mock': '/mock/memberGetplan.json',
    'defaultData': {
      'token': '7a98a7c9-208a-44c3-ab17-7f836287adde',
      'courseCategoryId': 'ff808081473905e701476204cb6c006f',
      'courseId': '8a22ecb55e755132015e8361703400c6'
    }
  },
  'getPreview': {
    'name': '获取学员学习预览',
    'url': '/api/userAction/study/member/getPreview'
  },
  'saveplan': {
    'name': '保存学员学习预览',
    'url': '/api/userAction/study/member/saveplan',
    'type': 'POST'
  },
  'getMaxOverplan': {
    'name': '获取学员未完成的学习计划最大周',
    'url': '/api/userAction/study/member/getMaxOverplan'
  },
  'updateplan': {
    'name': '更新学员学习计划',
    'url': '/api/userAction/study/member/updateplan',
    'type': 'POST'
  },
  'saveExtension': {
    'name': '申请修改学员计划',
    'url': '/api/userAction/study/member/saveExtension',
    'type': 'POST'
  },
  'editinfo': {
    'name': '学员完善个人信息',
    'url': '/api/zbids/member/editinfo',
    'type': 'POST'
  },
  'getappdownloadinfo': {
    'name': '获取产品版本和下载信息',
    'url': '/api/zbids/app/getappdownloadinfo',
    'mock': '/mock/getappdownloadinfo.json',
    'defaultData': {
      'token': '7a98a7c9-208a-44c3-ab17-7f836287adde'
    }
  },
  'applyrestudy': {
    'name': '申请重听提交成绩',
    'url': '/api/business/learning/applyrestudy',
    'type': 'POST'
  },
  'fileUpload': {
    'name': '上传图片',
    'href': 'http://api.zbgedu.com/api/v2.1/commons/fileUpload',
    'type': 'POST'
  },
  'applyrestudylist': {
    'name': '学员申请重听审核状态列表',
    'url': '/api/business/learning/applyrestudylist'
  },
  'exerciseIdList': {
    'name': '课程试卷id列表',
    // 'url': '/api/business/learning/noActivecourse/v1.0',
    'mock': '/mock/exerciseIdList.json'
  },
}