# 东北师范大学 QQ 群验证

<template v-if="!hintConfirmed">

您当前正在进行东北师范大学 QQ 群验证页面。

::: warning

1. 该页面仅用于**在 inNENU 开发者 Mr.Hope 的群验证，请您填写真实有效的信息，以换取身份验证码**
1. 您不能将填写结果发送给除 Mr.Hope (QQ: 1178522294) 以外的任何人！

<button @click="confirmHint">我已知晓，继续验证</button>

:::

</template>
<template v-else-if="!isSubmited">

姓名：<input class="verify-input" type="text" v-model="name" placeholder="请输入您的姓名" />

身份证号：<input class="verify-input" type="text" v-model="id" placeholder="请输入您的身份证号" />

14位考生号：<input class="verify-input" type="text" v-model="testId" placeholder="请输入您的考生号" />

<input type="checkbox" v-model="confirm" /> 我已了解此信息仅用于 Mr.Hope 的群验证并且我将只会把获得的验证码发送至其 QQ 1178522294

<button @click="submit">提交</button>

</template>
<template v-else>

::: tip

验证成功，请将下方二维码复制并发送至 Mr.Hope (QQ: 1178522294) 以完成身份验证！ (不要截图)

{{code}}

:::

</template>

<script setup lang="ts">
import { ref } from 'vue';

const hintConfirmed = ref(false);
const isSubmited = ref(false);

const name = ref('');
const id = ref('');
const testId = ref('');
const confirm = ref(false);

const confirmHint = () => {
  hintConfirmed.value = true;
};

const submit = async () => {
  if(!confirm.value) return alert('请确认信息使用要求');

  if(name.value === '' || id.value === '' || testId.value === '')
    return alert('请填写完整信息');

  const response = await fetch('https://service.innenu.com/mp/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name.value,
      id: id.value,
      testId: testId.value
    }),
  });

  const result = await response.json();

  if(!result.success) {
    alert('验证失败'+ result.msg);
    return;
  }

  isSubmited.value = true;
};
</script>
<style>
.verify-input {
  background: var(--vp-c-bg-control);
  font-size: 18px;
  padding: 8px 12px;
  margin: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}
</style>
