```
<template>
     //format 默认值hh:mm:ss  可不传
   <TimePicker :width="420" format="hh:mm:ss" v-model="time"></TimePicker>
</template>



export default{

    data(){
        return {
            time
        }
    }
}

```