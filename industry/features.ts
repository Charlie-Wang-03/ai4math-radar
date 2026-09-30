// AI4Math Radar 当前只复用通用资讯管线；AIHOT 示例站的专属模块暂不启用。
// 关闭后：导航入口隐藏，对应定时任务不运行，页面与接口返回 404。

export const FEATURES = {
  /** AIHOT 示例模型榜。AI4Math Radar 若未来需要领域榜单，将另行设计和验证。 */
  leaderboard: false,
  /** AIHOT 示例 Codex 重置监控，与本项目领域无关。 */
  codexResetMonitor: false,
} as const;
