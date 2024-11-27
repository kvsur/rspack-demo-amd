## Rspack vs Webpack

此Demo是为了提供实际项目中 从 `webpack` 迁移到 `rspack` 遇到的一个问题：

### 问题描述
使用 `rspack` 之后其中一个包 `eventemitter` 在 runtime 运行时导入的内容是一个空对象 `{}`

```js
import EventEmitter2 from "eventemitter2";

console.log(EventEmitter2); // rspack时输出 "{}", webpack时输出 EventEmitter2函数体

export default new EventEmitter2();
```

### 重要说明
项目本身使用 `sinlge-spa` 微前端框架，所以根据其官方的推荐，我们讲所有子项目的 `output.library.type` 都配置成了 `system`；
1. ‼️⚠️⚠️：而且 `system` 库是通过 cdn 引入的，同时也引入了 `extral system AMD` 模块，兼容一些很老的子项目 模块管理方式；
2. 问题出现我们第一时间也排查出来了是因为 extral system AMD 模块引入导致（针对rspack），移除之后就解决了 eventemitter2 不能正确使用的问题，但是着同时导致以前的AMD形式的AMD 模块不能用了；

system cdn相关引入在 src/index.html 模板文件中
```html
<html>
  <head>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.15.1/system.min.js" />
   <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.15.1/extras/amd.min.js" />
  </head>
  <!-- ... -->
</html>
```

来看一眼 eventemitter2 源码模块导出方式：
```js
;!function(undefined){
  // ... 省略
  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = EventEmitter;
  }
  else {
    // global for any kind of environment.
    var _global= new Function('','return this')();
    _global.EventEmitter2 = EventEmitter;
  }
}();
```

### 调试复现
如果要详细的调试或者查看异常信息，自行启动此Demo即可，步骤如下：

```bash
# 安装依赖包
pnpm install

# 启动（rspack）
pnpm start
# Or 启动（webpack）
pnpm start:webpack

# 访问 http://localhost:9012/
```
我们不确定这个问题最终是 `rspack` 或者 `webpack` 的什么机制导致，但是确实给项目带来困扰，无法顺利迁移到 `rspack`
