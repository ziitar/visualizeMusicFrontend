# visualizeMusic

基于web audio api实现的音乐可视化项目，音乐源来自本地或网易云。

### visualizeMusicBackend

[visualizeMusic](https://github.com/ziitar/visualizeMusicBackend.git)的前端项目。使用angular 13.x框架开发。UI组件为参考NG-ZORRO自行开发。

### feature
- [x] 配合[后端项目](https://github.com/ziitar/visualizeMusicBackend.git)实现读取本地音乐文件进行播放
- [x] 配合[客户端项目](https://github.com/ziitar/music-electron.git)实现本地音乐文件的ID3标签修改或写入
- [x] 音乐可视化

### todolist
- [ ] 可选样式的音乐可视化动画
- [ ] 可视化动画颜色可调节
- [ ] 滚动歌词
- [ ] 可自定义上传背景图
- [ ] 测试用例

### electron branch

1. 安装[node](https://nodejs.cn/download/)
2. 下载本项目
```shell
> git clone https://github.com/ziitar/visualizeMusicFrontend.git && cd visualizeMusicFrontend
```
3. 安装依赖
```
> npm install
```
4. 运行程序
```
> npm start
```