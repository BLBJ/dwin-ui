


import './style/base.css';
import * as rockUtils from './utils';
import { COMP_PREFIX } from "./config.js";

import ModalBox from "./modal/ModalBox.vue";
import Select from "./Select.vue";
import Table from "./Table.vue";
import Input from "./Input.vue";
import InputNumber from "./InputNumber.vue";
import Switch from "./Switch.vue";
import Button from "./Button.vue";
import Page from "./page.vue";
import Tree from "./Tree.vue";
import Textarea from "./Textarea.vue";
import TreeSelect from "./TreeSelect.vue";
import DatePicker from "./DatePicker/picker.vue";
import Tabs from "./Tabs.vue";
import TabPane from "./TabPane.vue";
import TimePicker from "./timePicker/timePicker.vue"
import Form from "./form/Form.vue";
import FormItem from "./form/FormItem.vue";
import { useForm } from "./form/form"

import ImageViewBig from "./imageView.vue";
import Checkbox from "./checkbox/Checkbox.vue";
import CheckboxGroup from "./checkbox/CheckboxGroup.vue";
import RangePicker from './rangePicker/index.vue';
import Slider from './Slider.vue'
import Rate from './Rate.vue';

import SvgIcon from "./svgIcon.vue";
import 'virtual:svg-icons-register';

import Radio from './radio/Radio.vue';
import RadioButton from './radio/RadioButton.vue';
import RadioGroup from './radio/RadioGroup.vue';

import Ring from './ring/index.vue';
import Message from "./prompt";
import Modal from "./modal";

import ScrollNum from './ScrollNum.vue';
import Spin from './Spin.vue';
import ToolTip from './ToolTip.vue';
import Popover from './Popover.vue';
const components = {
    SvgIcon,
    ModalBox,
    Select,
    Table,
    Input,
    Switch,
    Button,
    Page,
    Tree,
    Textarea,
    TreeSelect,
    DatePicker,
    Tabs,
    TabPane,
    ImageViewBig,
    InputNumber,
    Checkbox,
    CheckboxGroup,
    RangePicker,
    RadioButton,
    RadioGroup,
    Ring,
    Slider,
    ScrollNum,
    Radio,
    TimePicker,
    Form,
    FormItem,
    Spin,
    Rate,
    ToolTip,
    Popover
};


export {
    SvgIcon,
    ModalBox,
    Select,
    Table,
    Input,
    Switch,
    Button,
    Page,
    Tree,
    Textarea,
    TreeSelect,
    DatePicker,
    Tabs,
    TabPane,
    ImageViewBig,
    InputNumber,
    Checkbox,
    CheckboxGroup,
    RangePicker,
    Ring,
    rockUtils,
    Slider,
    Message,
    Modal,
    ScrollNum,
    TimePicker,
    Form,
    FormItem,
    useForm,
    Spin,
    Rate,
    ToolTip
}



export default {
    install: (app) => {

        //前缀
        Object.entries(components).forEach(([name, comp]) => {
            const kebabName = name
                .replace(/([A-Z])/g, '-$1')
                .toLowerCase()
                .replace(/^-/, '');
            app.component(`${COMP_PREFIX}${kebabName}`, comp);
        });
        app.config.globalProperties.$Message = Message;
        app.config.globalProperties.$Modal = Modal;
        return app;
    },
};
