```
<template>
     //format 默认值YYYY-MM-DD  可不传
   <DatePicker :width="420" format="YYYY-MM-DD" v-model="time"></DatePicker>
</template>



export default{

    data(){
        return {
            time
        }
    }
}

```