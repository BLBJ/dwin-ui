# 选项式使用

```
 this.$Message.success('xxx');
 this.$Message.warning('xxx');
 this.$Message.error('xxx');
 this.$Message.info('xxx');
``` 

# 组合式使用

```
import Message from "../components/base/prompt/base";

Message.success('xxx');
Message.warning('xxx');
Message.error('xxx');
Message.info('xxx');

//设置自动关闭时长  duration:Number /ms
Message.success('xxx',3000); //3s后关闭

```

# 手动关闭

duration设置为0；
```
let message = Message.warning("系统异常",0);
setTimeout(()=>{
  Message.remove(message)
},3000)
```
