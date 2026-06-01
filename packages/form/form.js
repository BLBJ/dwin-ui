import { ref } from "vue";

//表单校验
export const useForm = (form,rules) => {
  const error = ref({});
  Object.keys(form).map((key) => {
    error.value[key] = "";
  });
  const formVerify = () => {
    let checkValue = true;
    Object.entries(rules).forEach(([key,checkRules]) => {
      error.value[key] = "";
      let value = form[key];
      for (let i = 0; i < checkRules.length; i++) {
        if (checkRules[i].require === false && value === "") {
          break;
        }
        if(!checkRules[i].result) break;
        if (checkRules[i].type === "string") {
          if (value === null || value === undefined|| (value === checkRules[i].verify)) {
            console.log("检测到：" + key + "为空");
            error.value[key] = checkRules[i].prompt;
            checkValue = false;
            break;
          }
        } else if (checkRules[i]["min"]) {
          if (value.length < checkRules[i]["min"]) {
            error.value[key] = checkRules[i].prompt;
            checkValue = false;
            break;
          }
        } else if (checkRules[i].type === "array") {
          if (!value || !value.length) {
            console.log("检测到：" + key + "为空");
            error.value[key] = checkRules[i].prompt;
            checkValue = false;
            break;
          }
        } else if (checkRules[i].type === "regexp") {
          if (!checkRules[i].verify.test(value)) {
            console.log("检测到：" + key + "非法",checkRules[i].prompt);
            error.value[key] = checkRules[i].prompt;
            checkValue = false;
            break;
          }
        }else if(checkRules[i].type === "function"){
          if (!checkRules[i].verify(value)) {
            console.log("检测到：" + key + "非法",checkRules[i].prompt);
            error.value[key] = checkRules[i].prompt;
            checkValue = false;
            break;
          }
        }
      }
    });
    return checkValue;
  };
  const resetError = () => {
    Object.keys(form).map((key) => {
      error.value[key] = "";
    });
  };
  return {
    error,
    formVerify,
    resetError,
  };
};
