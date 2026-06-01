<template>
    <div class="rock_form_item">
        <label><span :style="{width:labelWidth+'px'}"  :required="required">{{ label }}</span></label>
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    name:String,
    error:String,
    required: {
        type: Boolean,
        default: false
    },
    label: String,
    labelWidth:{
        type:Number,
        default:100
    }
})

</script>

<style lang="scss" scoped>
.rock_form_item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    >label {
        margin-bottom: 0;
        position: relative;
        display: flex;
        align-items: center;

        >span {
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            color: var(--color-text);
            line-height: 22px;

            &[required='true']:after {
                content: "*";
                display: inline-block;
                font-size: 18px;
                color: var(--color-error);
                line-height: 22px;
                transform: translate(3px, 5px);
            }
        }

    }
}
</style>