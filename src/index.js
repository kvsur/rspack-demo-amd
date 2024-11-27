import emitter from "./emitter";

emitter.addListener('xxx', () => alert('xxx event fired.'))

emitter.emit('xxx');
