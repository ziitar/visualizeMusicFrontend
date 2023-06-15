# visualizeMusic

基于web audio api实现的音乐可视化项目，音乐源来自网易云。

### visualizeMusicBackend

visualizeMusic的前端项目。使用angular 13.x框架开发。UI组件为参考NG-ZORRO自行开发。

### feature
- [ ] 可选样式的音乐可视化动画
- [ ] 可视化动画颜色可调节
- [ ] 滚动歌词
- [ ] 可自定义上传背景图
- [ ] 登录(~~关联网易云账号~~)
- [ ] 测试用例

### electron branch

1. 安装[node](https://nodejs.cn/download/)
2. 下载本项目
```shell
> git clone https://github.com/ziitar/visualizeMusicFrontend.git && cd visualizeMusicFrontend
```
3. 更改分支
```
> git checkout electron
```
4. 安装依赖
```
> npm install
```
5. 运行程序
```
> npm start
```