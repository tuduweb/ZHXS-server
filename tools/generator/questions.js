#!/usr/bin/env node

import quesModel from "../../models/questions"

const newQuesIns = new quesModel({
    title: "标题：这是一个问题的标题",
    type: 1,
    remark: "很难",
    content: "这是这个问题的描述信息，用来描述这个问题的详情",
    options: ["猪头", "笨蛋", "可爱", "宝贝"],
    answer: [1, 2]
})

newQuesIns.save().then(() => console.log('okk'));