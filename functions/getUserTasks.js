const {TasksModel, TasksHistoryModel, UsersModel} = require("../models.sequelize");

const CATEGORIES = ['own', 'other'];

const makeNullableObj = () => {
    const arr = {}
    for (const CATEGORY of CATEGORIES) {
        arr[CATEGORY] = [];
    }
    return arr;
}

module.exports = async (user_id, ref_code) => {
    const tasks = makeNullableObj();
    for (const CATEGORY of CATEGORIES) {
        const dbReq = await TasksModel.findAll({
            where: {
                category: CATEGORY,
                status: 1
            },
            order: [['id', 'DESC']],
            raw: true
        });
        if (!dbReq.length) continue;
        for (const task of dbReq) {
            const isClaim = await TasksHistoryModel.count({
                where: {
                    tasks_id: task.id,
                    user_id: user_id,
                }
            })
            const taskInfo = task.info;
            if (taskInfo.type === "band") {
                taskInfo.count = await UsersModel.count({
                    where: {
                        ref_used: ref_code
                    }
                })
            }
            tasks[CATEGORY].push({
                id: task.id,
                type: task.type,
                title: task.title,
                reward: task.reward,
                info: taskInfo,
                claim: isClaim > 0
            });
        }
    }
    return tasks;
}